import chalk from 'chalk';

const Card = {
  name: 'card',
  description: "(WIP) Returns a card by name and/or by a given search query via Scryfall.",
  options: [
    {
      name: 'name',
      description: 'A specific cardname to find a specific card',
      type: 'string',
      required: false,
    },
    {
      name: 'query',
      description: 'A search query to search for related cards',
      type: 'string',
      required: false,
    },
  ],
  execute({ client }) {
    try {
      //
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/card >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Card',
        description: `An error occured while retrieving card data.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
      };
    }
  },
};

export default Card;
