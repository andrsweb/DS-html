document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	initSearchTest();
	showMobileSearch();
});

const initSearchTest = () => {
	const searchInputs = document.querySelectorAll('.search-show');

	if (!searchInputs.length) return;

	searchInputs.forEach(searchInput => {
		let searchResults = searchInput.closest('.modal-wrapper')?.querySelector('.search-result')
			|| searchInput.closest('.header')?.querySelector('.search-result');

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
}; //Удалить потом его. Просто для вёрстки

const showMobileSearch = () => {
	const button = document.querySelector('.header-action.m');
	const headerSearch = document.querySelector('.header-search');

	if (!button || !headerSearch) return;

	button.addEventListener('click', (e) => {
		e.stopPropagation();

		if (button.classList.contains('active')) {
			button.classList.remove('active');
			headerSearch.classList.remove('showed');
		} else {
			window.popoverManager.closeAllPopovers(headerSearch);
			button.classList.add('active');
			headerSearch.classList.add('showed');
		}
	});

	document.addEventListener('click', (e) => {
		const isClickInside = headerSearch.contains(e.target) || button.contains(e.target);
		if (!isClickInside) {
			headerSearch.classList.remove('showed');
			button.classList.remove('active');
		}
	});
};