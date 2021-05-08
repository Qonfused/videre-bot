import chalk from 'chalk';

const Help = {
  name: 'help',
  description: "Displays a list of this bot's commands.",
  type: 'global',
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
      console.error(
        chalk.cyan(`[/help]`)+
        chalk.grey('\n>> ') + chalk.red(`Error: ${error.message}`)
      );
      return {
        title: 'Error',
        description: `An error occured while retrieving commands.`,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Help;
