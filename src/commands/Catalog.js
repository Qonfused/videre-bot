import chalk from 'chalk';

const Catalog = {
  name: 'catalog',
  description: "Displays most recent events in event catalog.",
  execute({ client }) {
    try {
      // return {
      //   title: 'Catalog',
      //   description:'',
      //   fields: [
      //     {
      //       name: '',
      //       value: '',
      //       inline: false,
      //     },
      //   ],
      //   timestamp: new Date(),
      //   footer: {
      //     text: '/catalog'
      //   };
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/catalog >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Catalog',
        description: `An error occured while getting this bot's events catalog.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
      };
    }
  },
};

export default Catalog;
