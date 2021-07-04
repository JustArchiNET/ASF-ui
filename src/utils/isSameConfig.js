import { isEqual } from 'lodash-es';

export default function isSameConfig(newConfig, oldConfig) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [property] of Object.entries(newConfig)) {
    let foundDifference = false;

    if (typeof oldConfig[property] === 'object') {
      // we want to use lodash for object comparison since JS sucks
      foundDifference = !isEqual(oldConfig[property], newConfig[property]);
    } else if (property.startsWith('s_')) {
      foundDifference = oldConfig[property] !== newConfig[property].toString();
    } else {
      foundDifference = oldConfig[property] !== newConfig[property];
    }

    if (foundDifference) return false;
  }

  return true;
}
