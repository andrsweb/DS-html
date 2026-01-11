document.addEventListener('DOMContentLoaded', () => {
	initSort();
});

const initSort = () => {
	const sortButton = document.querySelector('[data-popover-toggle="sort"]');
	const sortPopover = document.querySelector('[data-popover="sort"]');

	if (!sortButton || !sortPopover) return;

	const sortValue = sortButton.querySelector('.sort-value');
	const sortItems = sortPopover.querySelectorAll('.popover-item');

	sortItems.forEach(item => {
		item.addEventListener('click', () => {
			if (sortValue) {
				sortValue.textContent = item.textContent;
			}

			sortItems.forEach(i => i.classList.remove('active'));
			item.classList.add('active');

			if (window.popoverManager) {
				window.popoverManager.closeAllPopovers();
			}
		});
	});
};
