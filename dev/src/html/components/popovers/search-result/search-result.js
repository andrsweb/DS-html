document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	const searchInputs = document.querySelectorAll('.search-show');

	if (!searchInputs.length) return;

	searchInputs.forEach(searchInput => {
		let searchResults = searchInput.closest('.header')?.querySelector('.search-result');

		if (!searchResults) return;

		searchInput.addEventListener('focus', () => {
			searchResults.classList.add('showed');
		});

		searchInput.addEventListener('click', (event) => {
			event.stopPropagation();
		});

		searchResults.addEventListener('click', (event) => {
			event.stopPropagation();
		});
	});

	document.addEventListener('click', () => {
		document.querySelectorAll('.search-result.showed').forEach(result => {
			result.classList.remove('showed');
		});
	});
});