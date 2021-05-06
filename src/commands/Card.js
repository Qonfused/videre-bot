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
    {
      name: 'set',
      description: 'A specific set to limit a search to',
      type: 'string',
      required: false,
    },
  ],
  async execute({ interaction, client, options }) {
    const [cardName, prices, set] = options;
    const findEmoji = symbol => client.emojis.cache.find(emoji => emoji.name === symbol);
    try {
      let scryfallURL = 'https://api.scryfall.com/cards/named?fuzzy=';
      if (set) scryfallURL += `&set=${set}`;

      const response = await fetch(`${scryfallURL}${cardName}`);
      if (response.status !== 200) throw new Error(`${response.status} — ${response.statusText}`);

      let data = await response.json();

      const cardTitle = (!data?.card_faces) ? manamoji(
        client.guilds.resolve(config.emojiGuild),
          [data.name, data.mana_cost].join(' ')
        ) : manamoji(
        client.guilds.resolve(config.emojiGuild), [
          `${data.card_faces[0].name} ${data.card_faces[0].mana_cost}`,
          `${data.card_faces[1].name} ${data.card_faces[1].mana_cost}`
        ].join(' // '));

      const thumbnailImage = (!data?.card_faces) ? data.image_uris.png : data.card_faces[0].image_uris.png;

      const footerText = [
          `🖌 ${data.artist}`,
          `${data.set.toUpperCase()} (${data.lang.toUpperCase()}) #${data.collector_number}`,
          data.rarity.replace(/^\w/, (c) => c.toUpperCase())
        ].join(' • ');

      if (prices !== true) {

        if (!data?.card_faces) {
          let cardText = manamoji(
            client.guilds.resolve(config.emojiGuild),
            [data.type_line, data.oracle_text].join('\n')
            .replace(/(\([^)]+\))/g, '*$1*')
          )

          if (data?.flavor_text) cardText += `\n*${data.flavor_text}*`;
          if (data?.power && data?.toughness) cardText += `\n${data.power}${data.toughness}`;
          if (data?.loyalty) cardText += `\nLoyalty: ${data.loyalty}`;

          return {
            title: cardTitle,
            url: data.scryfall_uri,
            description: cardText,
            thumbnail: {
              url: thumbnailImage
            },
            footer: {
              text: footerText
            },
          };
        } else {
          let cardText = manamoji(
            client.guilds.resolve(config.emojiGuild),
            `**${data.card_faces[0].name}** ${data.card_faces[0].mana_cost}`
          )

          cardText += "\n" + manamoji(
            client.guilds.resolve(config.emojiGuild),
            [data.card_faces[0].type_line, data.card_faces[0].oracle_text].join('\n')
            .replace(/(\([^)]+\))/g, '*$1*')
          )

          if (data.card_faces[0]?.flavor_text) cardText += `\n*${data.card_faces[0].flavor_text}*`;
          if (data.card_faces[0]?.power && data.card_faces[0]?.toughness) cardText += `\n${data.card_faces[0].power}/${data.card_faces[0].toughness}`;
          if (data.card_faces[0]?.loyalty) cardText += `\nLoyalty: ${data.card_faces[0].loyalty}`;

          cardText += "\n---------\n" + manamoji(
            client.guilds.resolve(config.emojiGuild),
            `**${data.card_faces[1].name}** ${data.card_faces[1].mana_cost}`
          )

          cardText += "\n" + manamoji(
            client.guilds.resolve(config.emojiGuild),
            [data.card_faces[1].type_line, data.card_faces[1].oracle_text].join('\n')
            .replace(/(\([^)]+\))/g, '*$1*')
          )

          if (data.card_faces[1]?.flavor_text) cardText += `\n*${data.card_faces[1].flavor_text}*`;
          if (data.card_faces[1]?.power && data.card_faces[1]?.toughness) cardText += `\n${data.card_faces[1].power}/${data.card_faces[1].toughness}`;
          if (data.card_faces[1]?.loyalty) cardText += `\nLoyalty: ${data.card_faces[1].loyalty}`;

          return {
            title: cardTitle,
            url: data.scryfall_uri,
            description: cardText,
            thumbnail: {
              url: thumbnailImage
            },
            footer: {
              text: footerText
            },
          };
        }

      }

      const child_process = require("child_process");
      const cardPrices = await child_process.execSync(`python ./src/utils/cardPrices.py --cardname \"${data.name.replace('/', '%2F')}\" --set \"${ set !== void 0 ? '&set=' + set : '' }\"`);

      const json = JSON.parse(cardPrices.toString());
      const imageStream = new Buffer.from(json.graph, 'base64');

      const description = `Showing results for **${data.set_name}** (**${data.set.toUpperCase()}**):`;

      function evalPrice(item) {
        return typeof item === 'object' ? '—' : (item > -1 ? item : '—')
      }

      const message = new Discord.APIMessage(client.channels.resolve(interaction.channel_id), {
        embed: {
          title: `Price History for ${cardTitle}`,
          url: json.url,
          fields: [
            { name: 'USD', value: `$**${ evalPrice(data.prices?.usd) }** | $**${ evalPrice(data.prices?.usd_foil) }**`, inline: true },
            { name: 'EUR', value: `€**${ evalPrice(data.prices?.eur) }** | €**${ evalPrice(data.prices?.eur_foil) }**`, inline: true },
            { name: 'TIX', value: `**${ evalPrice(data.prices?.tix) }** tix | **${ evalPrice(data.prices?.tix_foil) }** tix`, inline: true },
          ],
          thumbnail: {
            url: thumbnailImage,
          },
          image: {
            url: 'attachment://file.jpg',
          },
          footer: {
            "text" : footerText,
          },
          color: '#3498DB',
        },
        files: [imageStream],
      });
      await message.resolveData();

      const channel = await client.channels.cache.get(interaction.channel_id);
      await channel.send(message);

      return description;

    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/card >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Error',
        description: `An error occured while retrieving card data.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Card;
