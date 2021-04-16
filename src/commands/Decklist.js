import chalk from 'chalk';

const Decklist = {
  name: 'decklist',
  description: "(WIP) Displays a decklist or deck-related stats by archetype, player, date, or by a search query.",
  execute({ client }) {
    try {
      //
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/decklist >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Decklist',
        description: `An error occured while retrieving decklists.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
      };
    }
  },
};

export default Decklist;
