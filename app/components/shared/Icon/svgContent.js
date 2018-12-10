// @flow

import Logger from 'app/lib/Logger';
import escape from 'escape-html';

// NOTE: We cast `require` to an Object here so we can call `context`,
//       as Flow doesn't understand Webpack's require extensions.
const context = (require: Object).context('!raw-loader!./', false, /\.svg$/);

export default function svgContent(name, title){
  let icon = context('./placeholder.svg');

  try {
    icon = context(`./${name}.svg`);
  } catch (err) {
    Logger.error(`[Icon] No icon defined for "${name}"`, err);
  }

  return (title ? `<title>${escape(title)}</title>` : '') + icon;
}
