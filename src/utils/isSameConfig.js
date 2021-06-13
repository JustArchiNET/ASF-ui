export default function isSameConfig(newConfig, oldConfig) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [property] of Object.entries(newConfig)) {
    if (typeof oldConfig[property] === 'object') {
      // Vue's observer returns different result for empty object
      const objectsEmpty = (
        oldConfig[property]
        && Object.keys(oldConfig[property]).length === 0
        && newConfig[property]
        && Object.keys(newConfig[property]).length === 0);
      if (objectsEmpty) continue;
    }

    const foundDifference = oldConfig[property] !== newConfig[property];
    if (foundDifference) return false;
  }

  Object.keys(oldConfig).forEach(key => {
    if (key.startsWith('s_')) delete oldConfig[key.substr(2)];
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const [property] of Object.entries(oldConfig)) {
    if (typeof oldConfig[property] === 'object') {
      // Vue's observer returns different result for empty object
      const objectsEmpty = (
        oldConfig[property]
        && Object.keys(oldConfig[property]).length === 0
        && newConfig[property]
        && Object.keys(newConfig[property]).length === 0);
      if (objectsEmpty) continue;
    }

    const foundDifference = oldConfig[property] !== newConfig[property];
    if (foundDifference) return false;
  }

  return true;
}
