const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Servidor del bot activo ✅");
});

app.post("/whatsapp", async (req, res) => {
  const userMessage = req.body.message || "Hola";
  const response = await getOpenAIResponse(userMessage);
  res.send({ reply: response });
});

async function getOpenAIResponse(message) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error al consultar OpenAI:", error.response?.data || error.message);
    return "Lo siento, hubo un error al procesar tu mensaje.";
  }
}

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
