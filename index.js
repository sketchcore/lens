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
  try {
    const { content } = req.body;
    console.log('Received webhook:', content);
    
    if (content.includes('joined the game')) {
      const player = content.split(' ')[0];
      await bot.sendMessage(chatId, `LENS Alert: Player ${player} has joined the Minecraft server!`);
      console.log(`Sent join message for ${player}`);
    } else if (content.includes('left the game')) {
      const player = content.split(' ')[0];
      await bot.sendMessage(chatId, `LENS Alert: Player ${player} has left the Minecraft server.`);
      console.log(`Sent leave message for ${player}`);
    } else {
      console.log('Unhandled content:', content);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.sendStatus(500);
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LENS (Legion Engagement and Notification System) is running on port ${PORT}`);
});