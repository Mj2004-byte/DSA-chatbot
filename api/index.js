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
app.use(express.static(path.join(__dirname, "../public")));

/* root route */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

/* groq client */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* api route */
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.json({ answer: "Please ask a DSA question 🙂" });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "You are a Data Structures and Algorithms tutor."
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    res.json({
      answer: completion.choices[0].message.content
    });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ answer: "Groq API error ❌" });
  }
});

/* export for vercel */
module.exports = app;
