const sPropertyRegex = /"s_(\w+)":\s*"(\d+)"/g;

function prepareModelForDownload(model) {
  return JSON.stringify(model, null, 2).replace(sPropertyRegex, '"$1":$2');
}

function handleDownload(data, prepareModel, name, extenstion) {
  const element = document.createElement('a');
  const config = (prepareModel) ? prepareModelForDownload(data) : data.join('\n');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(config)}`);
  element.setAttribute('download', `${name}.${extenstion}`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function downloadConfig(model, name) {
  handleDownload(model, true, name, 'json');
}

export function downloadLog(log) {
  handleDownload(log, false, 'log', 'txt');
}
