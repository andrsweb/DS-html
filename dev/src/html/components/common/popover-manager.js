const closeAllPopovers = (currentPopover = null) => {
	const popovers = document.querySelectorAll('.search-result.showed, .header-search.showed, .shopping-cart.opened');
	const buttons = document.querySelectorAll('.header-action.active, #call-cart.active');

	popovers.forEach(popover => {
		if (popover !== currentPopover) {
			popover.classList.remove('showed', 'opened');
		}
	});

	buttons.forEach(button => {
		if (button !== currentPopover) {
			button.classList.remove('active');
		}
	});
};

window.popoverManager = {
	closeAllPopovers
};