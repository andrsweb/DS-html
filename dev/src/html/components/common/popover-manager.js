document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	initPopoverManager();
});

const initPopoverManager = () => {
	const closeAllPopovers = (currentPopover = null) => {
		const popovers = document.querySelectorAll('[data-popover].showed');
		const buttons = document.querySelectorAll('[data-popover-toggle].active');

		popovers.forEach(popover => {
			if (popover !== currentPopover) {
				popover.classList.remove('showed');
			}
		});

		buttons.forEach(button => {
			if (button !== currentPopover) {
				button.classList.remove('active');
			}
		});
	};

	const togglePopover = (button, popover) => {
		const isActive = button.classList.contains('active');
		
		if (isActive) {
			button.classList.remove('active');
			popover.classList.remove('showed');
		} else {
			closeAllPopovers(popover);
			button.classList.add('active');
			popover.classList.add('showed');
		}
	};

	const initPopover = (button) => {
		const popoverId = button.dataset.popoverToggle;
		const popover = document.querySelector(`[data-popover="${popoverId}"]`);

		if (!popover) return;

		button.addEventListener('click', (e) => {
			e.stopPropagation();
			togglePopover(button, popover);
		});

		popover.addEventListener('click', (e) => {
			e.stopPropagation();
		});

		document.addEventListener('click', (e) => {
			const isClickInside = popover.contains(e.target) || button.contains(e.target);
			if (!isClickInside) {
				button.classList.remove('active');
				popover.classList.remove('showed');
			}
		});
	};

	const buttons = document.querySelectorAll('[data-popover-toggle]');
	buttons.forEach(initPopover);

	window.popoverManager = {
		closeAllPopovers
	};
};