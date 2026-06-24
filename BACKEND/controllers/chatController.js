// REAL AI food assistant powered by LLaMA 3 (Groq)

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }
    
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are CounterAI, a smart food assistant that recommends meals from restaurants. Keep responses short, helpful, and food-focused.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      reply: "AI server error. Please try again later.",
    });
  }
};