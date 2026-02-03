const Groq = require("groq-sdk");

/* groq client */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* Vercel serverless function handler */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ answer: 'Method not allowed' });
    return;
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ answer: "Please ask a DSA question 🙂" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        answer: "Server configuration error: GROQ_API_KEY is not set. Please add it in Vercel environment variables." 
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful Data Structures and Algorithms tutor. Provide clear, concise explanations with examples when appropriate." 
        },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    res.status(200).json({
      answer: completion.choices[0].message.content
    });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ 
      answer: error.message || "Groq API error ❌. Please check your API key and try again." 
    });
  }
};
