const sPropertyRegex = /"s_(\w+)":\s*"(\d+)"/g;

function prepareModelToDownload(model) {
  return JSON.stringify(model, null, 2).replace(sPropertyRegex, '"$1":$2');
}

export default function downloadConfig(config, name) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(prepareModelToDownload(config))}`);
  element.setAttribute('download', `${name}.json`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
