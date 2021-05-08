import chalk from 'chalk';
import config from 'config';
const fetch = require('node-fetch');
const Discord = require('discord.js');

import { manamoji } from 'utils/manamoji';


const Card = {
  name: 'card',
  description: "Returns a card by name via Scryfall.",
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
  async execute({ client, interaction, args }) {
    const [cardName, prices, set] = args;
    const findEmoji = symbol => client.emojis.cache.find(emoji => emoji.name === symbol);
    try {
      let scryfallURL = `https://api.scryfall.com/cards/named?fuzzy=${cardName}`;
      if (set) scryfallURL += `&set=${set.replace(/[^0-9A-Z]+/gi,"")}`;

      let response = await fetch(scryfallURL);

      // Handle conditions for invalid Scryfall response by each query parameter and condition
      if (response.status !== 200) {
        // Get fuzzy response without set
        const response_1 = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`);
        if (response_1.status !== 200) throw new Error(`The requested card could not be found.`);
        let data = await response_1.json();

        // Get and handle missing card printings
        const response_2 = await fetch(data.prints_search_uri);
        if (response_2.status !== 200) throw new Error(`No printings for the requested card could be found.`);
        let printings = await response_2.json();

        // Filter unique values
        function onlyUnique(value, index, self) { return self.indexOf(value) === index; }

        // Get and handle invalid set parameter
        let sets = printings['data'].map(({ set }) => set).filter(onlyUnique);
        let message = 'No match was found for the requested card in the specified set.';
        let url = `https://scryfall.com/search?as=grid&order=released&q=%21%22${data?.name}%22&unique=prints`;
        if (data?.name) message += `\n[${sets.length} other printings](${url}) were found.`;
        if (sets.includes(set) !== true) return {
          title: 'Error',
          description: message,
          thumbnail: {
            url: !data?.card_faces ? data.image_uris.png : (!data.card_faces[0]?.image_uris ? data.image_uris.png : data.card_faces[0].image_uris.png)
          },
          footer: {
            text: [
              `🖌 ${data.artist}`,
              `${data.set.toUpperCase()} (${data.lang.toUpperCase()}) #${data.collector_number}`,
              data.rarity.replace(/^\w/, (c) => c.toUpperCase())
            ].join(' • ')
          },
          color: 0xe74c3c,
          ephemeral: true,
        };

        // Handle other miscellaneous errors 
        throw new Error(`An error occured while fetching the requested card.`);
      }

      let data = await response.json();

      const cardTitle = (!data?.card_faces) ? manamoji(
        client.guilds.resolve(config.emojiGuild),
          [data.name, data.mana_cost].join(' ')
        ) : manamoji(
        client.guilds.resolve(config.emojiGuild), [
          `${data.card_faces[0].name} ${data.card_faces[0].mana_cost}`,
          `${data.card_faces[1].name} ${data.card_faces[1].mana_cost}`
        ].join(' // '));

      const thumbnailImage = !data?.card_faces ? data.image_uris.png : (!data.card_faces[0]?.image_uris ? data.image_uris.png : data.card_faces[0].image_uris.png);

      const footerText = [
          `🖌 ${data.artist}`,
          `${data.set.toUpperCase()} (${data.lang.toUpperCase()}) #${data.collector_number}`,
          data.rarity.replace(/^\w/, (c) => c.toUpperCase())
        ].join(' • ');

      if (prices !== true) {

        if (!data?.card_faces) {
          let cardText = manamoji(
            client.guilds.resolve(config.emojiGuild),
            [data.type_line, data.oracle_text.replace(/\*/g, '\\*')].join('\n')
            .replace(/(\([^)]+\))/g, '*$1*')
          )

          if (data?.flavor_text) cardText += `\n*${data.flavor_text.replace(/\*/g, '')}*`;
          if (data?.power && data?.toughness) cardText += `\n${data.power.replace(/\*/g, '\\*')}/${data.toughness.replace(/\*/g, '\\*')}`;
          if (data?.loyalty) cardText += `\nLoyalty: ${data.loyalty.replace(/\*/g, '\\*')}`;

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
            .replace(/\*/g, '\\*')
            .replace(/(\([^)]+\))/g, '*$1*')
          )

          if (data.card_faces[0]?.flavor_text) cardText += `\n*${data.card_faces[0].flavor_text.replace(/\*/g, '')}*`;
          if (data.card_faces[0]?.power && data.card_faces[0]?.toughness) cardText += `\n${data.card_faces[0].power.replace(/\*/g, '\\*')}/${data.card_faces[0].toughness.replace(/\*/g, '\\*')}`;
          if (data.card_faces[0]?.loyalty) cardText += `\nLoyalty: ${data.card_faces[0].loyalty.replace(/\*/g, '\\*')}`;

          cardText += "\n---------\n" + manamoji(
            client.guilds.resolve(config.emojiGuild),
            `**${data.card_faces[1].name}** ${data.card_faces[1].mana_cost}`
          )

          cardText += "\n" + manamoji(
            client.guilds.resolve(config.emojiGuild),
            [data.card_faces[1].type_line, data.card_faces[1].oracle_text].join('\n')
            .replace(/\*/g, '\\*')
            .replace(/(\([^)]+\))/g, '*$1*')
          )

          if (data.card_faces[1]?.flavor_text) cardText += `\n*${data.card_faces[1].flavor_text.replace(/\*/g, '\\*')}*`;
          if (data.card_faces[1]?.power && data.card_faces[1]?.toughness) cardText += `\n${data.card_faces[1].power.replace(/\*/g, '\\*')}/${data.card_faces[1].toughness.replace(/\*/g, '\\*')}`;
          if (data.card_faces[1]?.loyalty) cardText += `\nLoyalty: ${data.card_faces[1].loyalty.replace(/\*/g, '\\*')}`;

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
      const cardPrices = await child_process.execSync(`python ./src/utils/cardPrices.py --cardname \"${ data.name }\" --set \"${ data.set.toUpperCase() }\"`);

      const json = cardPrices.toString().length > 2 ? JSON.parse(cardPrices.toString()) : {};
      const imageStream = cardPrices.toString().length > 2 ? new Buffer.from(json?.graph, 'base64') : undefined;

      const description = `Showing results for **${data.set_name}** (**${data.set.toUpperCase()}**):`;

      function evalPrice(item) {
        return typeof item === 'object' ? '—' : (item > -1 ? item : '—')
      }

      const message = {
        title: `Price History for ${cardTitle}`,
        description: description,
        fields: [
          { name: 'USD', value: `$**${ evalPrice(data.prices?.usd) }** | $**${ evalPrice(data.prices?.usd_foil) }**`, inline: true },
          { name: 'EUR', value: `€**${ evalPrice(data.prices?.eur) }** | €**${ evalPrice(data.prices?.eur_foil) }**`, inline: true },
          { name: 'TIX', value: `**${ evalPrice(data.prices?.tix) }** tix | **${ evalPrice(data.prices?.tix_foil) }** tix`, inline: true },
        ],
        thumbnail: {
          url: thumbnailImage,
        },
        footer: {
          "text" : footerText,
        },
        color: '#3498DB',
      }

      if (cardPrices.toString().length > 2) message.url = json?.url;
      if (cardPrices.toString().length > 2) message.image = { url: 'attachment://file.jpg' };
      if (cardPrices.toString().length > 2) message.files = [imageStream];

      return message;

    }  catch (error) {
      console.error(
        chalk.cyan(`[/card]`)+
        chalk.grey(` cardName: `) + chalk.green(`\"${cardName}\"`)+
        chalk.grey(` prices: `) + (!prices ? chalk.grey('None') : chalk.yellow(prices))+
        chalk.grey(` set: `) + (!set ? chalk.grey('None') : chalk.green(`\"${set}\"`))+
        chalk.grey('\n>> ') + chalk.red(`Error: ${error.message}`)
      );
      return {
        title: 'Error',
        description: error.message,
        color: 0xe74c3c,
        ephemeral: true,
      };

    }
  },
};

export default Card;
