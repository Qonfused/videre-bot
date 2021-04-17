import { JSDOM } from 'jsdom';
import { APIMessage } from 'discord.js';
import createDOMPurify from 'dompurify';
import {
  INTERACTION_RESPONSE_FLAGS,
  EMBED_DEFAULTS,
  COMMAND_OPTION_TYPES,
} from 'constants';

// Shared sanitation context
const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

/**
 * Normalizes and cleans up unsafe strings, eval.
 *
 * @param {String} string Target string.
 */
export const normalize = string => DOMPurify.sanitize(string);

/**
 * Sanitizes Discord syntax from command arguments.
 *
 * @param {String} message Discord message string to sanitize.
 */
export const sanitize = message => {
  if (!message) return;

  return normalize(
    message
      // Remove newline characters
      .replace(/\n/gm, ' ')
      // Remove mentions
      .replace(/<@!\d*>/g, '')
      // Remove formatting
      .replace(/(\*|`|:)*/g, '')
      // Trim inline spaces
      .replace(/\s+/g, ' ')
      .trim()
  );
};

// Discord embed property size limits
const MAX_TITLE_LENGTH = 256;
const MAX_DESC_LENGTH = 2048;

const MAX_FIELD_LENGTH = 25;
const MAX_FIELD_NAME_LENGTH = 256;
const MAX_FIELD_VALUE_LENGTH = 1024;

export const validateEmbed = ({ title, description, fields, ...rest }) => ({
  ...EMBED_DEFAULTS,
  title: title?.slice(0, MAX_TITLE_LENGTH),
  description: description?.slice(0, MAX_DESC_LENGTH),
  fields: fields?.reduce((fields, field, index) => {
    if (index <= MAX_FIELD_LENGTH) {
      const { name, value, inline } = field;

      fields.push({
        name: name.slice(0, MAX_FIELD_NAME_LENGTH),
        value: value.slice(0, MAX_FIELD_VALUE_LENGTH),
        inline: Boolean(inline),
      });
    }

    return fields;
  }, []),
  ...rest,
});

/**
 *
 * @param {INTERACTION_RESPONSE_FLAGS} flags
 */
export const validateFlags = flags =>
  flags
    ? Object.keys(flags).find(flag => INTERACTION_RESPONSE_FLAGS[flag.toUpperCase()])
    : null;

// Discord message content size limit
const MAX_CONTENT_LENGTH = 2000;

/**
 * Validates a message response and its embed if available.
 *
 * @param {APIMessage} message Message object or inline embed
 */
export const validateMessage = message => {
  console.log(message)
  if (!message) return;

  // Early return if parsing an existing message
  if (message instanceof APIMessage) return message;

  // Parse inline message flags
  const flags = validateFlags(message);

  // Handle vanilla message
  if (message.content || message.embeds)
    return {
      flags,
      content: message.content?.slice(0, MAX_CONTENT_LENGTH),
      embeds: message.embeds?.map(validateEmbed),
    };

  // Handle inline embed
  return {
    flags,
    embed: validateEmbed(message),
  };
};

// Validates human-readable command meta into a Discord-ready object.
export const validateCommand = ({ name, description, options }) => ({
  name,
  description,
  options: options?.map(({ type, ...rest }) => ({
    type: COMMAND_OPTION_TYPES[type.toUpperCase()],
    ...rest,
  })),
});
