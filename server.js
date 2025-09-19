const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
console.log("Key present:", !!OPENAI_KEY);

app.post("/api/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ answer: "No question provided." });

  const lowerQ = question.toLowerCase().trim();

  if (lowerQ === "what is math?") {
    return res.json({
      answer: "Mathematics is the study of numbers, quantities, shapes, and patterns. It is used for solving problems and understanding the world logically."
    });
  }

  if (lowerQ === "what is physics?") {
    return res.json({
      answer: "Physics is the natural science that studies matter, energy, and the fundamental forces of nature. It explains how things move and interact in the universe."
    });
  }

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: question }],
        max_tokens: 200,
      }),
    });

    const raw = await r.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(500).json({ answer: "Could not parse OpenAI response." });
    }

    const answer = data.choices?.[0]?.message?.content?.trim() || "No answer received.";
    res.json({ answer });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ answer: "Error talking to OpenAI." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
