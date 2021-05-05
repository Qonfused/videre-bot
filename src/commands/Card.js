import chalk from 'chalk';
import config from 'config';
const fetch = require('node-fetch');
const Discord = require('discord.js');

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
    const findEmoji = symbol => client.emojis.cache.find(emoji => emoji.name === symbol);
    try {
      if (prices != true) {
        const scryfallURL = 'https://api.scryfall.com/cards/named?format=text&fuzzy=';

        const response = await fetch(`${scryfallURL}${cardName}`);
        if (response.status !== 200) throw new Error(`${response.status} — ${response.statusText}`);

        const cardText = (await response.text())
          .replace(/(\([^)]+\))/g, '*$1*');

        return {
          description: manamoji(client.guilds.resolve(config.emojiGuild), cardText),
          ephemeral: true,
        };
      } else if (prices == true) {
          const child_process = require("child_process");
          const cardPrices = await child_process.execSync(`python ./src/utils/cardPrices.py --cardname \"${cardName}\"`);

          const data = JSON.parse(cardPrices.toString());

          const imageStream = new Buffer.from(data.graph, 'base64');
          const attachment = new Discord.MessageAttachment(imageStream, 'graph.png');

          function evalPrice(item) { return typeof item === 'object' ? '—' : (item > -1 ? item : '—') }

          return new Discord.MessageEmbed()
          	.setColor('#3498DB')
          	.setTitle(
              manamoji(
                client.guilds.resolve(config.emojiGuild),
                `Price History for ${data.matchedName} ${data.mana_cost}`
            ))
            .setDescription(`Showing results for **${data.set_name}** (**${data.set.toUpperCase()}**):`)
          	.setThumbnail(data.png)
            .addField('USD', `$**${ evalPrice(data.prices?.usd) }** | $**${ evalPrice(data.prices?.usd_foil) }**`, true)
            .addField('EUR', `€**${ evalPrice(data.prices?.eur) }** | €**${ evalPrice(data.prices?.eur_foil) }**`, true)
            .addField('TIX', `**${ evalPrice(data.prices?.tix) }** tix | **${ evalPrice(data.prices?.tix_foil) }** tix`, true)
            .attachFiles(attachment)
          	.setImage('attachment://graph.png')
          	.setFooter(
              'Price history data sourced from MTGStocks.com',
              'https://pbs.twimg.com/profile_images/482510609934602240/ZTMbGoMr_200x200.png'
            );

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
