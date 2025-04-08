import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { answers } = req.body;
  const prompt = `Generate a simple, creative business idea based on:
Location: ${answers[0]}
Interests: ${answers[1]}
Income Goal: ${answers[2]}
Budget: ${answers[3]}
Education/Skills: ${answers[4]}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const idea = completion.choices[0].message.content;
    res.status(200).json({ idea });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate idea." });
  }
}
