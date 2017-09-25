// @flow

import escapeHtml from 'escape-html';

import BUILDKITE_EMOJI from '../emoji/buildkite';
import UNICODE_EMOJI from '../emoji/apple';

const EMOJI_CATALOGUES = [
  BUILDKITE_EMOJI,
  UNICODE_EMOJI
];

const COLON_REGEXP = /:[^\s:]+:(?::skin-tone-[2-6]:)?/g;

type ParseEmojiOptions = {
  escape?: boolean
};

export default function parseEmoji(string: string, options: ParseEmojiOptions = {}): string {
  if (!string || string.length === 0) {
    return '';
  }

  // Turn off escaping if the option is explicitly set
  if (options.escape !== false) {
    string = escapeHtml(string);
  }

  return string.replace(COLON_REGEXP, (match) => {
    // Find a catalogue which contains the emoji
    const catalogue = EMOJI_CATALOGUES
      .find((catalogue) => catalogue.index.hasOwnProperty(match));

    if (catalogue) {
      // If we found one, pull out the emoji's entry
      const emoji = catalogue.emoji[catalogue.index[match]];

      // Double check, just in case
      if (emoji) {
        // Replace Unicode emoji shortcodes with real Unicode
        if (emoji.unicode) {
          return emoji.unicode;
        }

        // And Buildkite emoji with images
        // Emoji catalogue hosts have a normalized host that always end with a "/"
        const emojiUrl = `${catalogue.host}${emoji.image}`;

        return `<img class="emoji" title="${emoji.name}" alt=":${emoji.name}:" src="${emojiUrl}" draggable="false" />`;
      }
    }

    return match;
  });
}