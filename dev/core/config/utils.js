import notify from 'gulp-notify';
import path from 'path';
import {pathToFileURL} from 'url';
import fs from 'fs';

export function createErrorHandler(taskName) {
	return function handleError(err) {
		const parts = [];
		if (err.file) {
			const location = [err.line, err.column].filter(Boolean).join(':');
			const filePath = location ? `${err.file}:${location}` : err.file;
			parts.push(filePath);
		}
		if (err.message) {
			parts.push(err.message.toString());
		}
		const message = parts.join('\n');
		notify.onError({
			title: taskName,
			message,
			sound: false
		})(err);
		this.emit('end');
	};
}

export const sassAliasImporter = {
	findFileUrl(url) {
		if (!url.startsWith('@/')) {
			return null;
		}

		const absolutePath = path.resolve('dev/src', url.slice(2));
		return pathToFileURL(absolutePath);
	}
};

export function ensureDir(dirPath) {
	fs.mkdirSync(dirPath, {recursive: true});
}
