import gulp from 'gulp';
import {browserSync} from '../config/server.js';
import {paths} from '../config/paths.js';
import {html} from './html.js';
import {styles} from './styles.js';
import {scripts} from './scripts.js';
import {staticAssets, images, fonts} from './assets.js';
import {lintStylesDev, lintHtmlDev} from './validate.js';
import {skipLint} from '../config/env.js';

const {watch, series} = gulp;

export function serve() {
	browserSync.init({
		server: {
			baseDir: paths.root
		},
		port: 3000,
		open: true,
		notify: true
	});

	if (skipLint) {
		watch(paths.html.watch, html);
		watch(paths.styles.watch, styles);
	} else {
		watch(paths.html.watch, series(html, lintHtmlDev));
		watch(paths.styles.watch, series(lintStylesDev, styles));
	}
	watch(paths.scripts.watch, scripts);
	watch(paths.static.src, staticAssets);
	watch(paths.images.src, images);
	watch(paths.fonts.src, fonts);
}
