import './modal';

import {disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';

document.addEventListener("DOMContentLoaded", () => {
	"use strict";
		initBurgerMenu();
});

const initBurgerMenu = () => {
	const header = document.querySelector('.header');
	const burger = header ? header.querySelector('.header-burger') : null;
	const nav = header ? header.querySelector('.header-nav') : null;
	const headerInner = header ? header.querySelector('.header-inner') : null;
	const search = header ? header.querySelector('.header-search') : null;

	if (!header || !burger || !nav || !headerInner || !search) return;

	const resetSubmenuHeight = (menuItem) => {
		const subMenu = menuItem.querySelector('.sub-menu');
		if (subMenu) {
			subMenu.style.height = '';
		}
	};

	const moveSearchToMenu = () => {
		if (!nav.contains(search)) {
			nav.prepend(search);
		}
	};

	const moveSearchToHeader = () => {
		if (!headerInner.contains(search)) {
			headerInner.insertBefore(search, headerInner.firstChild);
		}
	};

	const closeMenu = () => {
		header.classList.remove('menu-open');
		burger.setAttribute('aria-expanded', 'false');
		moveSearchToHeader();
		enableBodyScroll(nav);
	};

	const openMenu = () => {
		header.classList.add('menu-open');
		burger.setAttribute('aria-expanded', 'true');
		moveSearchToMenu();
		disableBodyScroll(nav);
	};

	const toggleMenu = () => {
		header.classList.contains('menu-open') ? closeMenu() : openMenu();
	};

	burger.addEventListener('click', toggleMenu);

	nav.addEventListener('click', (event) => {
		const target = event.target;

		if (!target || !(target instanceof Element)) {
			return;
		}

		if (target.closest('a')) {
			const link = target.closest('a');
			const parentItem = link.closest('.menu-item-has-children');

			if (parentItem && window.innerWidth < 992) {
				event.preventDefault();
				const isCurrentlyOpen = parentItem.classList.contains('sub-open');

				parentItem.closest('.menu').querySelectorAll('.menu-item-has-children.sub-open').forEach(openItem => {
					if (openItem !== parentItem) {
						openItem.classList.remove('sub-open');
						const subMenu = openItem.querySelector('.sub-menu');
						if (subMenu) {
							subMenu.style.height = '0';
						}
					}
				});

				if (isCurrentlyOpen) {
					parentItem.classList.remove('sub-open');
					const subMenu = parentItem.querySelector('.sub-menu');
					if (subMenu) {
						subMenu.style.height = '0';
					}
				} else {
					parentItem.classList.add('sub-open');
					const subMenu = parentItem.querySelector('.sub-menu');
					if (subMenu) {
						const menuItems = subMenu.querySelectorAll('.menu-item');
						let totalHeight = 0;
						menuItems.forEach(item => {
							totalHeight += item.offsetHeight;
						});
						const gap = 4;
						const totalGap = gap * (menuItems.length - 1);
						subMenu.style.height = `${totalHeight + totalGap}px`;
					}
				}
			} else {
				closeMenu();
			}
		}
	});

	const mediaQuery = window.matchMedia('(min-width: 992px)');

	const handleMediaChange = (event) => {
		if (event.matches) {
			closeMenu();
			document.querySelectorAll('.menu-item-has-children.sub-open').forEach(item => {
				item.classList.remove('sub-open');
			});
			document.querySelectorAll('.menu-item-has-children .sub-menu').forEach(subMenu => {
				subMenu.style.height = '';
			});
			clearAllBodyScrollLocks();
		}
	};

	mediaQuery.addEventListener('change', handleMediaChange);
}