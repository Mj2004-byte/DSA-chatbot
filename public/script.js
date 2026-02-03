async function ask() {
  const input = document.getElementById("question");
  const chat = document.getElementById("chat");

  const question = input.value.trim();
  if (!question) return;

  chat.innerHTML += `<div class="user">🧑 ${question}</div>`;
  input.value = "";

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();
    chat.innerHTML += `<div class="bot">🤖 ${data.answer}</div>`;
  } catch (err) {
    chat.innerHTML += `<div class="bot">❌ Server error. Try again.</div>`;
  }

  chat.scrollTop = chat.scrollHeight;
}
