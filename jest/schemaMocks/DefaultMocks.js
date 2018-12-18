// @flow weak

export default class DefaultMocks {
  static get ID() {
    const ids = new Map();

    return (_parent, _args, _context, { parentType }) => {
      const nextId = (ids.get(parentType) + 1 || 1);
      ids.set(parentType, nextId);
      return `ID:${parentType}:${nextId}`;
    };
  }

  static get String() {
    return () => "";
  }

  static get DateTime() {
    return () => new Date(1986, 7, 28).valueOf().toString();
  }
}
