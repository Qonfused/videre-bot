import dotenv from 'dotenv';

dotenv.config();

// Bot config vars
const config = {
  // Discord bot prefix
  prefix: process.env.PREFIX || '!',
  // Server for local testing of slash commands
  guild: process.env.GUILD,
  // Discord bot token
  token: process.env.TOKEN,
};

export default config;
