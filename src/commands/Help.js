import chalk from 'chalk';

const Help = {
  name: 'help',
  description: "Displays a list of this bot's commands.",
  execute({ client }) {
    try {
      return {
        title: 'Commands',
        description: 'Below are a list of commands I can do:',
        fields: client.commands.map(({ name, options, description }) => ({
          name: `/${name}${options?.map(({ name }) => ` \`${name}\``) || ''}`,
          value: description,
        })),
      };
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/help >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Error',
        description: `An error occured while retrieving commands.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Help;
