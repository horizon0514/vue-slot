const path = require('path');
const fs = require('fs');

function reWriteJson() {
	const pkgJson = require(path.resolve(__dirname, '../packages/core/package.json'));
	pkgJson.module = './vue-slot.es.js';
	fs.writeFile(path.resolve(__dirname, '../dist/package.json'), JSON.stringify(pkgJson, null, 2), (err) => {
		if (err) {
			console.log(err);
		}
	});
}

reWriteJson();
