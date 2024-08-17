require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { Client, Intents } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');

// Telegram Bot Token and Chat ID
const telegramToken = '7299665026:AAG6-gmQbOJyfNtM3FDyW0SsGcpdJkrGMME';
// Hardcoded Telegram Chat ID
const telegramChatId = '-1001365987500';
console.log('Telegram Chat ID:', telegramChatId);

// Discord Bot Token from environment variable
const discordToken = 'MTI3Mzg4MjMxMzY5NjIxNTEwNQ.Gz6PyF.SutciU6cYpwsIwHazbcG4wvS2D4AMHVSkF1KIc'; // This will be set in Vercel

// Log the Discord token for debugging purposes
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

// Add a separate handler for Telegram messages if needed
telegramBot.on('message', (msg) => {
  // Handle Telegram messages if necessary
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  console.log('Received webhook. Request body:', JSON.stringify(req.body));
  try {
    const { content } = req.body;
    console.log('Extracted content:', content);

    if (content && content.includes('joined the game')) {
      const player = content.split(' joined')[0];
      console.log('Sending notification to chat ID from webhook:', telegramChatId);
      await telegramBot.sendMessage(telegramChatId, `LENS Alert: ${player} has joined the Minecraft server!`)
        .then(() => {
          console.log(`Sent join message for ${player} from webhook`);
        })
        .catch((error) => {
          console.error('Error sending join message from webhook:', error);
        });
    } else {
      console.log('Unhandled content in webhook:', content);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.sendStatus(500);
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('LENS bot is running!');
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LENS (Legion Engagement and Notification System) is running on port ${PORT}`);
});

// Login Discord bot
discordClient.login(discordToken).then(() => {
  console.log('Discord bot is ready!');
}).catch(error => {
  console.error('Error logging in to Discord:', error);
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