import Bot from 'bot';
import Videre from 'commands/Videre';

let client;

beforeAll(() => {
  client = new Bot();
  client.loadCommands();
});

describe('commands/Videre', () => {
  it("displays this bot's commands", () => {
    const output = Videre.execute({ client });

    expect(output.fields.length).not.toBe(0);
  });
});

afterAll(() => {
  client.destroy();
});
