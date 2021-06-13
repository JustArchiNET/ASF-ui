import { isEqual } from 'lodash-es';

export default function isSameConfig(newConfig, oldConfig) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [property] of Object.entries(newConfig)) {
    // we want to use lodash for object comparison since JS sucks
    const foundDifference = (typeof oldConfig[property] === 'object')
      ? !isEqual(oldConfig[property], newConfig[property])
      : oldConfig[property] !== newConfig[property];

    if (foundDifference) return false;
  }

  return true;
}
