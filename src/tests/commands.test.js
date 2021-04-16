import Bot from 'bot';
import Help from 'commands/Help';

let client;

beforeAll(() => {
  client = new Bot();
  client.loadCommands();
});

describe('commands/Help', () => {
  it("displays this bot's commands", () => {
    const output = Help.execute({ client });

    expect(output.fields.length).not.toBe(0);
  });
});

afterAll(() => {
  client.destroy();
});
