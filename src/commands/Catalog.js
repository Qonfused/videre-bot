import chalk from 'chalk';
import { group } from "d3-array";

const Catalog = {
  name: 'catalog',
  description: "Displays most recent events in event catalog.",
  execute({ client }) {
    // Query from database
    // let data =
    // Create array from nested InternMap
    // let catalog = Array.from(d3.group(data, d => d.format, d => d.date));
    try {
      return {
        title: 'Catalog',
        description:'',
        // Map array from catalog object
        // fields: [],
      };
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
