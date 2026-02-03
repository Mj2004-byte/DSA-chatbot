 const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();

/* middlewares */
app.use(cors());
app.use(express.json());

/* serve public folder */
app.use(express.static(path.join(__dirname, "public")));

/* root */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* groq */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* api */
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.json({ answer: "Please ask a DSA question 🙂" });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are a Data Structures and Algorithms tutor." },
        { role: "user", content: question },
      ],
    });

    res.json({
      answer: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Groq Error:", error);
    res.json({ answer: "Groq API error ❌" });
  }
});

/* LOCAL + VERCEL SUPPORT */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
