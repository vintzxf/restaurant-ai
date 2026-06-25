// REAL AI food assistant powered by LLaMA 3 (Groq)

const Food = require("../models/Food");
const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

exports.chatWithAI = async (req, res) => {

    const foods = await Food.find().populate("restaurantId");

    const menuData = foods
  .map(
    (food) =>
      `${food.name} - ₦${food.price} (${food.restaurantId.name})`
  )
  .join("\n");

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ reply: "Message is required" });
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
You are CounterAI.
Only recommend foods from this menu.
MENU:
${menuData}
If someone asks for food recommendations, only use foods from the menu above.
Do not invent foods that are not listed.
Keep responses short and helpful.
`,

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

console.log("AI route hit");