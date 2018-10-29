import path, {resolve, normalize, relative, dirname, parse} from 'path';

export const parser = 'flow';

function isRelativePath(path) {
  return path.slice(0, 3) === '../';
}

// This codemod rewrites relative imports to 'absolute', module style imports.
export default function removeRelativeImports(file, api, options) {
  const {dir: fileDir} = parse(file.path)
  const {jscodeshift} = api;
  const printOptions = options.printOptions || {quote: 'single'};
  const root = jscodeshift(file.source)
  const nodesToUpdate = new Set();

  root
    .find(jscodeshift.ImportDeclaration)
    .find(jscodeshift.Literal)
    .filter(node => isRelativePath(node.value.value))
    .forEach(path => nodesToUpdate.add(path));

  root
    .find(jscodeshift.ExportNamedDeclaration)
    .filter(path => path.value.source !== null)
    .find(jscodeshift.Literal)
    .filter(node => isRelativePath(node.value.value))
    .forEach(path => nodesToUpdate.add(path));

  root
    .find(jscodeshift.ExportAllDeclaration)
    .find(jscodeshift.Literal)
    .filter(node => isRelativePath(node.value.value))
    .forEach(path => nodesToUpdate.add(path));

  nodesToUpdate.forEach(node => {
    const newPath = normalize(path.join(fileDir, node.value.value));
    jscodeshift(node).replaceWith(() => jscodeshift.literal(newPath));
  });

  return nodesToUpdate.size ? root.toSource(printOptions) : null;
};