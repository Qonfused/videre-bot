import chalk from 'chalk';

const Event = {
  name: 'event',
  description: "(WIP) Displays an event by name, id, date, or search query.",
  execute({ client }) {
    try {
      //
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/event >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Error',
        description: `An error occured while retrieving events.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Event;
