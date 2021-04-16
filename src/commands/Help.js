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
      console.error(chalk.red(`/help >> ${error.stack}`));
    }
  },
};

export default Help;
