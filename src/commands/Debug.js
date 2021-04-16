import chalk from 'chalk';

const Debug = {
  name: 'debug',
  description: "(WIP) Displays the bot's current uptime, cluster info, and latency.",
  execute({ client }) {
    try {
      // Get uptime in nearest days, hours, minutes and seconds
      let totalSeconds = client.uptime / 1000;
      let days = Math.floor(totalSeconds / 86400).toFixed(0);
      let hours = Math.floor(totalSeconds / 3600).toFixed(0);

      totalSeconds %= 3600;

      let minutes = Math.floor(totalSeconds / 60).toFixed(0);
      let seconds = (totalSeconds % 60).toFixed(0);

      // Create array of these values to later filter out null values
      let formattedArray = [
        `${days > 0 ? days + (days == 1 ? ' day' : ' days') : ''}`,
        `${hours > 0 ? hours + (hours == 1 ? ' hour' : ' hours') : ''}`,
        `${minutes > 0 ? minutes + (minutes == 1 ? ' minute' : ' minutes') : ''}`,
        `${seconds > 0 ? seconds + (seconds == 1 ? ' second' : ' seconds') : ''}`,
      ];

      return {
        title: 'Debug',
        fields: [
          // Uptime since 'Ready' status
          {
            name: 'Current Uptime',
            value:
              formattedArray
                .filter(Boolean)
                .join(', ')
                // Replace last comma with ' and' for fluency
                .replace(/, ([^,]*)$/, ' and $1') + '.',
            inline: false,
          },
          // Various cluster information
          { name: 'PID', value: `\`${process.pid}\``, inline: true },
          { name: 'Cluster', value: `\`${'N/A'}\``, inline: true },
          { name: 'Shard', value: `\`${'N/A'}\``, inline: true },
          // Latency between Discord bot and user
          {
            name: 'Bot Latency',
            value: `\`${'N/A'} ms\``,
            inline: true,
          },
          // Latency between Discord bot and Discord API
          {
            name: 'API Latency',
            value: `\`${Math.round(client.ws.ping)} ms\``,
            inline: true,
          },
        ],
      };
    } catch (error) {
      // Send full error stack to console
      console.error(chalk.red(`/debug >> ${error.stack}`));
      // Send brief error message in Discord response
      return {
        title: 'Debug',
        description: `An error occured while retrieving this bot's debug info.\n**>>** \`${error.message}\``,
        color: 0xe74c3c,
      };
    }
  },
};

export default Debug;
