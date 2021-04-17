import { sanitize } from 'utils/discord';
import { crawl } from 'utils/puppeteer';
import config from 'config';

describe('utils/discord', () => {
  it('sanitizes Discord mentions', () => {
    const output = sanitize(`${config.prefix}command args <@!1234>`);

    expect(output).toBe(`${config.prefix}command args`);
  });

  it('sanitizes Discord emotes', () => {
    const output = sanitize(`${config.prefix}command args :emote:`);

    expect(output).toBe(`${config.prefix}command args emote`);
  });

  it('sanitizes whitespace', () => {
    const output = sanitize(`${config.prefix}command args  arg2\narg3`);

    expect(output).toBe(`${config.prefix}command args arg2 arg3`);
  });

  it('sanitizes Discord markdown', () => {
    const output = sanitize(`
      ${config.prefix}command args
      *Italics*
      **Bold**
      \`Code\`
      \`\`\`Codeblock\`\`\`
    `);

    expect(output).toBe(`${config.prefix}command args Italics Bold Code Codeblock`);
  });
});

describe('utils/puppeteer', () => {
  it('crawls a webpage and callsback', async () => {
    const output = await crawl('about:blank');

    expect(output).toBe('');
  });
});
