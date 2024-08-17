require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { Client, Intents } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');

// Telegram Bot Token and Chat ID from environment variables
const telegramToken = process.env.TELEGRAM_BOT_TOKEN; // This will be set in Vercel
const telegramChatId = process.env.TELEGRAM_CHAT_ID; // This should also be set in Vercel
console.log('Telegram Chat ID:', telegramChatId);

// Discord Bot Token from environment variable
const discordToken = process.env.DISCORD_BOT_TOKEN; // This will be set in Vercel

// Log the Discord token for debugging purposes (remove in production)
console.log('Discord token:', discordToken);

// Create bot instances
const telegramBot = new TelegramBot(telegramToken, { polling: true });
const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Create an Express app to listen for webhook events
const app = express();
app.use(bodyParser.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('Body:', JSON.stringify(req.body));
  next();
});

// Discord bot event handler
discordClient.on('messageCreate', async (message) => {
  console.log('Received Discord message:', JSON.stringify(message));
  
  // Check if the message is from a specific channel or user
  if (message.content.includes('joined the game')) {
    console.log('Condition met for sending notification.');
    const player = message.content.split(' joined')[0];
    
    // Log the chat ID being used
    console.log('Sending notification to chat ID:', telegramChatId);
    
    await telegramBot.sendMessage(telegramChatId, `LENS Alert: ${player} has joined the Minecraft server!`)
      .then(() => {
        console.log(`Sent join message for ${player}`);
      })
      .catch((error) => {
        console.error('Error sending join message:', error);
      });
  } else {
    console.log('Condition not met for sending notification.');
  }
});

// Start the Discord bot
discordClient.login(discordToken).then(() => {
  console.log('Discord bot is ready!');
}).catch(error => {
  console.error('Error logging in to Discord:', error);
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LENS (Legion Engagement and Notification System) is running on port ${PORT}`);
});

// Test sending a message to the group chat
console.log('Sending test message to chat ID:', telegramChatId);
telegramBot.sendMessage(telegramChatId, 'Test message to group chat!')
  .then(() => {
    console.log('Test message sent to group chat!');
  })
  .catch((error) => {
    console.error('Error sending test message:', error);
  });