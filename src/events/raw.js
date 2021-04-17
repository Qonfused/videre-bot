import chalk from 'chalk';

// Handles websocket events.
const RawEvent = {
  name: 'raw',
  async execute(client, packet) {
    try {
      if (packet.t !== 'INTERACTION_CREATE') return;

      const interaction = packet.d;
      const { name, options } = interaction.data;

      const command = client.commands.get(name);
      if (!command) return;

      const output = await command.execute({
        client,
        options: options?.map(({ value }) => value),
      });
      if (!output) return;
      if (output.ephemeral) return {
        content: output.description,
        ephemeral: true,
      }

      return client.send(
        interaction,
        typeof output === 'string' ? { content: output } : output
      );
    } catch (error) {
      console.error(chalk.red(`raw >> ${error.stack}`));
    }
  },
};

export default RawEvent;
