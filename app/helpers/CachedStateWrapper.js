function CachedStateWrapper(Component, options = {}) {
  const validLength = options.validLength || -1;
  const propsForContext = options.propsForContext || [];

  Component.prototype.setCachedState = function(state = {}) {
    const localStorageKey = CachedStateWrapper.getLocalStorageKey(this, propsForContext);
    this.setState(state, () => {
      const stateToCache = {
        state
      };

      if (validLength > 0) {
        stateToCache.expiresAt = Date.now() + validLength;
      }

      localStorage[localStorageKey] = JSON.stringify(stateToCache);
    });
  };

  Component.prototype.getCachedState = function() {
    const localStorageKey = CachedStateWrapper.getLocalStorageKey(this, propsForContext);

    const cachedState = JSON.parse(localStorage[localStorageKey] || '{}');
    if (!cachedState.state || (cachedState.expiresAt && cachedState.expiresAt < Date.now())) {
      return {};
    }

    return cachedState.state;
  };

  return Component;
}

CachedStateWrapper.getLocalStorageKey = (component, propsForContext = []) => (
  `CachedState:${CachedStateWrapper.getNameForComponent(component)}:${CachedStateWrapper.getPropContextStringForComponent(component.props, propsForContext)}`
);

CachedStateWrapper.getNameForComponent = (component) => (
  component.displayName || component.constructor.displayName || component.constructor.name
);

// Get a string of mapped prop values, for segmenting
// cached values by their (relevant) prop context
//
// Example `props` value:
// { 'greeting': 'Hello', 'location': { 'name': 'world' } }
// => 'greeting=hello:location.name=world'
CachedStateWrapper.getPropContextStringForComponent = (props, propsForContext = []) => (
  propsForContext
    .sort()
    .map((propName) => {
      const propPath = propName.split('.');

      // Pull out the prop value; if the path is a "simple" value (i.e. does not contain a `.`),
      // just pull it out - if not, go through it to pull out the target value using `reduce`
      const propValue = propPath.length === 1
        ? props[propName]
        : propPath.reduce((prevValue, currentValue, currentIndex) => {
          if (currentIndex === 1) {
            // On the first iteration, `prevValue` is the first segment of the path;
            // pull its value from the component props
            return props[prevValue][currentValue];
          }

          return prevValue[currentValue];
        });

      return `${propName}=${propValue.toString()}`;
    })
    .join(':')
);

export default CachedStateWrapper;
