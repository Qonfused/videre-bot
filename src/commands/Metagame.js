import chalk from 'chalk';

const Metagame = {
  name: 'metagame',
  description: "(WIP) Displays a breakdown of decks from the most recent events by format.",
  execute({ client }) {
    try {
      //
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/metagame >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Metagame',
        description: `An error occured while retrieving metagame data.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
      };
    }
  },
};

export default Metagame;
