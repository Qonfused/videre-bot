import chalk from 'chalk';
const fetch = require('node-fetch');
import config from 'config';

import { manamoji } from 'utils/manamoji';

const Card = {
  name: 'card',
  description: "(WIP) Returns a card by name via Scryfall.",
  options: [
    {
      name: 'name',
      description: 'A specific cardname to find a specific card',
      type: 'string',
      required: true,
    },
    {
      name: 'prices',
      description: 'Flag to show card prices and price history instead',
      type: 'boolean',
      required: false,
    },
  ],
  async execute({ client, options }) {
    const [cardName, prices] = options;
    try {
      if (prices != true) {
        const scryfallURL = 'https://api.scryfall.com/cards/named?format=text&fuzzy=';

        const response = await fetch(`${scryfallURL}${cardName}`);
        if (response.status !== 200) throw new Error(`${response.status} — ${response.statusText}`);

        const cardText = (await response.text())
          .replace(/(\([^)]+\))/g, '*$1*');

        const findEmoji = symbol => client.emojis.cache.find(emoji => emoji.name === symbol);

        return {
          description: manamoji(client.guilds.resolve(config.emojiGuild), cardText),
          ephemeral: true,
        };
      } else if (prices == true) {
          const child_process = require("child_process");
          const cardPrices = await child_process.execSync(`python ./src/utils/cardPrices.py --cardname \"${cardName}\"`);

          const data = JSON.parse(cardPrices.toString());
          const imageStream = Buffer.from(data.graph, 'base64');

          return {
            title: `Price History for ${data.matchedName}`,
            // files: [{ name : "graph.png", attachment : imageStream }],
            // image: { url: 'attachment://graph.png' },
            footer: {
              "icon_url" : "https://pbs.twimg.com/profile_images/482510609934602240/ZTMbGoMr_200x200.png",
              "text" : "Price history data sourced from MTGStocks.com"
            },
          };

          // return {
          //   description: `**Price History for ${data.matchedName}**\n\`\`\`diff\n${data.table}\n\`\`\``,
          //   ephemeral: true,
          // };
      }
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/card >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Card',
        description: `An error occured while retrieving card data.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Card;
