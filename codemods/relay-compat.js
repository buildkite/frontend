import path, { normalize, parse } from 'path';

export const parser = 'flow';

// This codemod rewrites relative imports to 'absolute', module style imports.
export default function removeRelativeImports(file, api, options) {
  const { dir: fileDir } = parse(file.path);
  const { jscodeshift } = api;
  const printOptions = options.printOptions || { quote: 'single' };
  const root = jscodeshift(file.source);
  const nodesToUpdate = new Set();

  root
    .find(jscodeshift.ImportDeclaration)
    .find(jscodeshift.Literal)
    .filter((node) => node.value.value === 'react-relay/classic')
    .forEach((path) => nodesToUpdate.add(path));

  nodesToUpdate.forEach((node) => jscodeshift(node).replaceWith(() => jscodeshift.literal('react-relay/compat')));

  return nodesToUpdate.size ? root.toSource(printOptions) : null;
}
