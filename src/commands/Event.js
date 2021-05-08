import chalk from 'chalk';

const Event = {
  name: 'event',
  description: "(WIP) Displays an event by name, id, date, or search query.",
  // options
  execute({ client, args }) {
    try {
      throw new Error("Command still a work in progress.");
    } catch (error) {
      // chalk error logging
      return {
        title: 'Error',
        description: error.message,
        color: 0xe74c3c,
        ephemeral: true,
      };
    }
  },
};

export default Event;
