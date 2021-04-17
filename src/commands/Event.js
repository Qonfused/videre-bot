import chalk from 'chalk';
import { formats, eventTypes } from 'utils/magic';

const Event = {
  name: 'event',
  description: '(WIP) Displays an event by type, id, date, and/or search query.',
  options: [
    {
      name: 'format',
      description: 'A specific format to return events from',
      type: 'string',
      required: false,
      choices: formats,
    },
    {
      name: 'type',
      description: 'A specific event type to return events from',
      type: 'string',
      required: false,
      choices: eventTypes,
    },
    {
      name: 'date',
      description: 'A specific date to return events from in MM/DD/YY format',
      type: 'string',
      required: false,
    },
    {
      name: 'query',
      description: 'A search query to search for related events',
      type: 'string',
      required: false,
    },
  ],
  execute({ client }) {
    try {
      //
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/event >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Event',
        description: `An error occured while retrieving events.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Event;
