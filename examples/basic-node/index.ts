import express from "express";
import { agent } from "./agent.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve a simple HTML page
app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>PersonaKit Node Example</title>
        <style>
          body { font-family: system-ui; max-width: 600px; margin: 40px auto; padding: 20px; }
          #messages { border: 1px solid #ccc; padding: 20px; height: 300px; overflow-y: auto; margin-bottom: 20px; }
          .user { color: blue; }
          .assistant { color: green; }
          form { display: flex; gap: 10px; }
          input { flex: 1; padding: 10px; }
          button { padding: 10px 20px; }
        </style>
      </head>
      <body>
        <h1>PersonaKit Chat</h1>
        <div id="messages"></div>
        <form id="chat-form">
          <input type="text" id="input" placeholder="Type a message..." autocomplete="off" />
          <button type="submit">Send</button>
        </form>
        <script>
          const messages = document.getElementById('messages');
          const form = document.getElementById('chat-form');
          const input = document.getElementById('input');

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = input.value.trim();
            if (!content) return;

            messages.innerHTML += '<p class="user"><b>You:</b> ' + content + '</p>';
            input.value = '';

            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: [{ role: 'user', content }] }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            messages.innerHTML += '<p class="assistant"><b>Assistant:</b> <span id="current"></span></p>';
            const current = document.getElementById('current');

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\\n');
              for (const line of lines) {
                if (line.startsWith('0:')) {
                  try {
                    const text = JSON.parse(line.slice(2));
                    assistantMessage += text;
                    current.textContent = assistantMessage;
                  } catch {}
                }
              }
            }
            current.removeAttribute('id');
            messages.scrollTop = messages.scrollHeight;
          });
        </script>
      </body>
    </html>
  `);
});

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
  // Convert Express request to Web Request
  const webRequest = new Request(`http://localhost:${PORT}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });

  // Get response from agent
  const response = await agent.handle(webRequest);

  // Stream the response
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const reader = response.body?.getReader();
  if (!reader) {
    res.end();
    return;
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop");
});
