const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta principal para ver si está funcionando
app.get("/", (req, res) => {
  res.send("Servidor del bot activo ✅");
});

// Ruta POST para recibir mensajes y responder con OpenAI
app.post("/whatsapp", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Falta el campo 'message'" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error al consultar OpenAI:", error.message);
    res
      .status(500)
      .json({ error: "Lo siento, hubo un error al procesar tu mensaje." });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});

