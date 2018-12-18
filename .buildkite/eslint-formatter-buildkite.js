const spawnSync = require('child_process').spawnSync;

module.exports = function(results) {
  const { warning, error } = results.reduce(
      function(acc, file) {
        if (file.errorCount > 0) {
          acc.error.push(file);
        }

        if (file.warningCount > 0) {
          acc.warning.push(file);
        }

        return acc;
      },
      {
        warning: [],
        error: []
      }
    );

  if (error.length > 0) {
    let errorOutput = `
#### ESLint Errors

${
  error.map(function(file) {
    return `
<details><summary>${file.filePath}</summary>

${
  file.messages.map(function(message) {
    if (message.severity > 1) {
      return '';
    }

    return `${message.line}:${message.column}: ${message.message} (${message.ruleId})`;
  }).join('\n\n')
}

</details>`;

      // return JSON.stringify(file, null, 2);
  }).join('\n\n')
}`;

    if (process.env["BUILDKITE"]) {
      spawnSync(
        'buildkite-agent',
        [
          'annotate',
          '--context', 'eslint',
          '--style', 'error',
          errorOutput
        ]
      );
    } else {
      console.log(errorOutput);
    }
  }

  if (warning.length > 0) {
    let warningOutput = `
#### ESLint Warnings

${
  warning.map(function(file) {
    return `
<details><summary>${file.filePath}</summary>

${
  file.messages.map(function(message) {
    if (message.severity > 1) {
      return '';
    }

    return `${message.line}:${message.column}: ${message.message} (${message.ruleId})`;
  }).join('\n\n')
}

</details>`;

      // return JSON.stringify(file, null, 2);
  }).join('\n\n')
}`;

    if (process.env["BUILDKITE"]) {
      spawnSync(
        'buildkite-agent',
        [
          'annotate',
          '--context', 'eslint',
          '--style', 'warning',
          warningOutput
        ]
      );
    } else {
      console.log(warningOutput);
    }
  }

  return '';
};
