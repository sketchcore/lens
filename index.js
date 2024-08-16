require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

// Telegram Bot Token
const token = process.env.TELEGRAM_BOT_TOKEN;

// Telegram Group Chat ID
const chatId = process.env.TELEGRAM_CHAT_ID;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Create an Express app to listen for webhook events
const app = express();
app.use(bodyParser.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const { content } = req.body;
  
  if (content.includes('joined the game')) {
    const player = content.split(' ')[0];
    await bot.sendMessage(chatId, `LENS Alert: Player ${player} has joined the Minecraft server!`);
  } else if (content.includes('left the game')) {
    const player = content.split(' ')[0];
    await bot.sendMessage(chatId, `LENS Alert: Player ${player} has left the Minecraft server.`);
  }

  res.sendStatus(200);
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LENS (Legion Engagement and Notification System) is running on port ${PORT}`);
});