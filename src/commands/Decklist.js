import chalk from 'chalk';
import { formats } from 'utils/magic';

const Decklist = {
  name: 'decklist',
  description: "(WIP) Displays decklist(s) filtered by format, archetype, player, date, and/or by a search query.",
  options: [
    {
      name: 'format',
      description: 'A specific format to return events from',
      type: 'string',
      required: false,
      choices: formats,
    },
    {
      name: 'archetype',
      description: 'A specific archetype to return decklists from',
      type: 'string',
      required: false,
    },
    {
      name: 'player',
      description: 'A specific player to return decklists from',
      type: 'string',
      required: false,
    },
    {
      name: 'date',
      description: 'A specific date to return events from in MM/DD/YY format',
      type: 'string',
      required: false,
    },
    {
      name: 'query',
      description: 'A search query to search for related decklists',
      type: 'string',
      required: false,
    },
  ],
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
