// Pull in ESLint's own "getFormatter" method (https://git.io/fpAqw), which
// normalises both ESLint's friendly names, npm package names, and files
// on-disk, and then returns the result of requiring them.
let getFormatter = require('eslint/lib/cli-engine').prototype.getFormatter.bind({});

module.exports = function(results) {
  // Since ESLint doesn't give us access to any context or config,
  // we have to resort to pulling Environment Variables
  let formatters = (
    process.env['ESLINT_MULTI_FORMATTERS'].split(';')
    || [ false ]
  );

  // Map over each formatter, calling it with the result array we got given,
  // then return the combination of all the outputs.
  return formatters
    .map(function (formatterName) {
      let formatter = getFormatter(formatterName);

      // TODO: When would this happen, and not just be a thrown error?
      if (!formatter) {
        console.debug('Weird! "' + formatterName + '" isn\'t a real formatter...');
        return;
      }

      return formatter(results);
    })
    .filter(function(output) {
      return output && output.trim().length > 0;
    })
    .join('\n\n');
};
