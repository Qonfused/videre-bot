import chalk from 'chalk';
import { group } from "d3-array";
import { formats, eventTypes } from 'utils/magic';

const Catalog = {
  name: 'catalog',
  description: "(WIP) Displays most recent events by format, type, and/or date.",
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
  ],
  execute({ client }) {
    // Query from database
    // let data =
    // Create array from nested InternMap
    // let catalog = Array.from(d3.group(data, d => d.format, d => d.date));
    try {
      // return {
      //   title: 'Catalog',
      //   description:'',
      //   // Map array from catalog object
      //   // fields: [],
      // };
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/catalog >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Error',
        description: `An error occured while retrieving the events catalog.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Catalog;
