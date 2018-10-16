const sPropertyRegex = /"s_(\w+)":\s*"(\d+)"/g;

export default function prepareModelToDownload(model) {
	return JSON.stringify(model, null, 2).replace(sPropertyRegex, '"$1":$2');
}
