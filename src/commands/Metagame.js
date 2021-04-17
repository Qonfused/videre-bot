import chalk from 'chalk';
import { formats, eventTypes } from 'utils/magic';

const Metagame = {
  name: 'metagame',
  description:
    '(WIP) Displays a metagame breakdown of decks by format, archetype, and/or query.',
  options: [
    {
      name: 'format',
      description: 'A specific format to return metagame data from',
      type: 'string',
      required: false,
      choices: formats,
    },
    {
      name: 'archetype',
      description: 'A specific archetype to return metagame data from',
      type: 'string',
      required: false,
    },
    {
      name: 'query',
      description: 'A search query to search metagame data from',
      type: 'string',
      required: false,
    },
  ],
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
        ephemeral: true,
      };
    }
  },
};

export default Metagame;
