export function uncamelise(thing) {
  return thing.toString()
    .replace(/(^|[a-z0-9])([A-Z][a-z0-9])/g, '$1 $2')
    .trim();
}
