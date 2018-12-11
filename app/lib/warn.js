// @flow weak

/* eslint-disable no-unused-vars */
let warn = (...args) => {};

if (process.env.NODE_ENV !== "production") {
  warn = (condition: boolean, format: string, ...args) => {
    if (!condition) {
      const name = "Warning:";
      let argIndex = 0;
      const message = format.replace(/%s/g, () => (args[argIndex++]));
      /* eslint-disable no-console */
      console.error(name, message);
    }
  };
}

export default warn;
