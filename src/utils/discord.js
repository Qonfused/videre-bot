import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { EMBED_DEFAULTS, COMMAND_OPTION_TYPES } from 'constants';

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

// Discord embed prop char limits
const MAX_TITLE_LENGTH = 256;
const MAX_DESC_LENGTH = 2048;

const MAX_FIELD_LENGTH = 25;
const MAX_FIELD_NAME_LENGTH = 256;
const MAX_FIELD_VALUE_LENGTH = 1024;

/**
 * Generates an embed with default properties.
 *
 * @param {{ title: String, description: String, fields?: any[] }} props Overloaded embed properties.
 */
export const validateEmbed = props => {
  const { title, description, fields, ...rest } = props;

  return {
    ...EMBED_DEFAULTS,
    title: title?.slice(0, MAX_TITLE_LENGTH),
    description: description?.slice(0, MAX_DESC_LENGTH),
    fields: fields?.reduce((fields, field, index) => {
      if (index <= MAX_FIELD_LENGTH) {
        const { name, value, ...rest } = field;

        fields.push({
          name: name.slice(0, MAX_FIELD_NAME_LENGTH),
          value: value.slice(0, MAX_FIELD_VALUE_LENGTH),
          ...rest,
        });
      }

      return fields;
    }, []),
    ...rest,
  };
};

// Discord message char limit
const MAX_MESSAGE_LENGTH = 2000;

/**
 * Validates a message response and its embed if available
 *
 * @param {String | Object} message Discord message response.
 */
export const validateMessage = message =>
  typeof message === 'object'
    ? { embed: validateEmbed(message) }
    : message.slice(0, MAX_MESSAGE_LENGTH);

// Validates human-readable command meta into a Discord-ready object.
export const validateCommand = ({ name, description, options }) => ({
  name,
  description,
  options: options?.map(({ type, ...rest }) => ({
    type: COMMAND_OPTION_TYPES[type.toUpperCase()],
    ...rest,
  })),
});
