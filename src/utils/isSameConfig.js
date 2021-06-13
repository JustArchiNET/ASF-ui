import { isEqual } from 'lodash-es';

export default function isSameConfig(newConfig, oldConfig) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [property] of Object.entries(newConfig)) {
    const foundDifference = !isEqual(oldConfig[property], newConfig[property]);
    if (foundDifference) return false;
  }

  Object.keys(oldConfig).forEach(key => {
    if (key.startsWith('s_')) delete oldConfig[key.substr(2)];
  });

  // we want to see if we have some default values set
  // eslint-disable-next-line no-restricted-syntax
  for (const [property] of Object.entries(oldConfig)) {
    const foundDifference = !isEqual(oldConfig[property], newConfig[property]);
    if (foundDifference) return false;
  }

  return true;
}
