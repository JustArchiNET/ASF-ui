export default function composeVersionString(version) {
	return `${version.Major}.${version.Minor}.${version.Build}.${version.Revision}`;
}
