import gulp from 'gulp';
import fg from 'fast-glob';
import fs from 'fs/promises';
import {w3cHtmlValidator} from 'w3c-html-validator';
import gulpStylelint from 'gulp-stylelint-esm';
import {paths} from '../config/paths.js';

const {src} = gulp;

function stylelintSummaryFormatter(results) {
	let messagesCount = 0;
	let hasErrors = false;

	for (const result of results) {
		const warnings = Array.isArray(result.warnings) ? result.warnings : [];
		messagesCount += warnings.length;
		if (warnings.some((warning) => warning.severity === 'error')) {
			hasErrors = true;
		}
	}

	const status = hasErrors ? 'fail' : 'pass';
	return `SCSS validation: ${status} (messages: ${messagesCount})`;
}

function createStylelintOptions(failAfterError) {
	return {
		failAfterError,
		reporters: [
			{
				formatter: 'string',
				console: true
			},
			{
				formatter: stylelintSummaryFormatter,
				console: true
			}
		]
	};
}

async function runHtmlValidation(failAfterError) {
	const files = await fg(`${paths.root}/**/*.html`);

	if (!files.length) {
		return;
	}

	let hasErrors = false;

	for (const filename of files) {
		try {
			const fileContent = await fs.readFile(filename, 'utf8');
			
			if (!fileContent.trim()) {
				console.log(`HTML validation skipped for ${filename} - empty file`);
				continue;
			}
			
			let attempts = 0;
			const maxAttempts = 3;
			let results = null;
			
			while (attempts < maxAttempts && !results) {
				try {
					results = await w3cHtmlValidator.validate({
						filename,
						output: 'json'
					});
				} catch (attemptError) {
					attempts++;
					if (attemptError.message.includes('429') || attemptError.message.includes('Too Many Requests')) {
						if (attempts < maxAttempts) {
							const delay = 2000 * attempts;
							console.log(`Rate limit hit, retrying ${filename} in ${delay/1000}s... (attempt ${attempts}/${maxAttempts})`);
							await new Promise(resolve => setTimeout(resolve, delay));
							continue;
						} else {
							console.log(`HTML validation skipped for ${filename} - W3C API rate limit reached after ${maxAttempts} attempts`);
							continue;
						}
					}
					throw attemptError;
				}
			}

			if (results && !results.validates) {
				hasErrors = true;
			}

			if (results) {
				w3cHtmlValidator.reporter(results, {
					title: filename
				});
			}
		} catch (error) {
			if (error.message.includes('400') || error.message.includes('No input document')) {
				console.log(`⚠️  HTML validation skipped for ${filename} - W3C API error`);
				continue;
			}
			throw error;
		}

		await new Promise(resolve => setTimeout(resolve, 3000));
	}

	if (failAfterError && hasErrors) {
		throw new Error('HTML validation failed');
	}
}

export async function validateHtml() {
	await runHtmlValidation(true);
}

export function validateStyles() {
	return src(['dev/src/**/*.scss'], {allowEmpty: true}).pipe(
		gulpStylelint(createStylelintOptions(true))
	);
}

export async function validate() {
	const errors = [];

	try {
		await validateHtml();
	} catch (error) {
		errors.push(error);
	}

	// SCSS linting disabled
	/*
	try {
		await new Promise((resolve, reject) => {
			const stream = validateStyles();
			stream.on('end', resolve);
			stream.on('error', reject);
		});
	} catch (error) {
		errors.push(error);
	}
	*/

	if (errors.length) {
		throw new Error('Validation failed');
	}
}
