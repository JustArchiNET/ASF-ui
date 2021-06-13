export default function isSameConfig(newConfig, oldConfig) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [property] of Object.entries(newConfig)) {
    const found = oldConfig[property] === newConfig[property];
    if (found) return true;
  }

  return false;
}