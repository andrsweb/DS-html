document.addEventListener('DOMContentLoaded', () => {
	'use strict'

	toogleDropdown()
})

const toogleDropdown = () => {
	const dropdowns = document.querySelectorAll('.dropdown')

	if (!dropdowns.length) return

	window.addEventListener('load', () => {
		dropdowns.forEach(dropdown => {
			if (dropdown.classList.contains('opened')) {
				setTimeout(() => {
					reCalculateDropdownHeight(dropdown)
				}, 500)
			}
		})
	})

	dropdowns.forEach(dropdown => {
		dropdown.addEventListener('click', (e) => {
			const dropdownOpen = dropdown.querySelector('.dropdown-open')

			if (!dropdownOpen) return

			if (e.target.closest('.dropdown-inner')) return

			if (!dropdown.classList.contains('opened')) {
				dropdown.classList.add('opened')
				reCalculateDropdownHeight(dropdown)
			}
			else {
				dropdown.classList.remove('opened')
				dropdownOpen.style.height = '0'
			}
		})
	})
}

window.addEventListener('resize', () => {
	const dropdowns = document.querySelectorAll('.dropdown.opened')

	if (!dropdowns.length) return

	dropdowns.forEach(dropdown => reCalculateDropdownHeight(dropdown))
})

export const reCalculateDropdownHeight = dropdown => {
	const dropdownOpen = dropdown.querySelector('.dropdown-open'),
		dropdownInner = dropdown.querySelector('.dropdown-inner')

	if (!dropdownOpen || !dropdownInner) return

	// Use scrollHeight for more accurate content measurement
	dropdownOpen.style.height = `${dropdownInner.scrollHeight}px`
}
