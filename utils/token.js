function encodeData(data) {
	const json = JSON.stringify(data);
	const buffer = Buffer.from(json, 'utf-8');
	const base64 = buffer.toString('base64');
	return base64;
}

function decodeData(token) {
	const buffer = Buffer.from(token, 'base64');
	const json = buffer.toString('utf-8');
	const data = JSON.parse(json);
	return data;
}

module.exports = {
    encodeData,
    decodeData
}