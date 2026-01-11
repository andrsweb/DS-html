document.addEventListener('DOMContentLoaded', () => {
	initCategoryLinks()
})

const initCategoryLinks = () => {
	const categoryLinks = document.querySelectorAll('.category-links')

	categoryLinks.forEach(container => {
		const button = container.querySelector('.show-more')
		if (!button) return

		button.addEventListener('click', () => {
			const isOpened = container.classList.toggle('opened')
			const textNode = button.childNodes[0]

			if (isOpened) {
				textNode.textContent = 'Скрыть '
			} else {
				textNode.textContent = 'Показать ещё '
			}
		})
	})
}
