# LENS (Legion Engagement and Notification System)

LENS is a Telegram bot designed to send notifications to a group chat whenever a player joins or leaves the Minecraft server. It uses McDiscordWebhook to receive events from the server.

## Features

- Monitors the Minecraft server for player join and leave events
- Sends notifications to a specified Telegram group chat
- Easily configurable through environment variables

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and fill in the required environment variables (see below)
4. Install and configure McDiscordWebhook on your Minecraft server
5. Run the bot: `npm start`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_group_chat_id
PORT=3000
```

Replace the placeholder values with your actual credentials.

## Dependencies

- node-telegram-bot-api
- express
- body-parser

## Usage

Once set up and running, LENS will automatically listen for webhook events from McDiscordWebhook and send notifications to the specified Telegram group chat when a player joins or leaves the Minecraft server.