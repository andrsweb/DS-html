document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	shoppingCartCalc();
});

const shoppingCartCalc = () => {
	const FREE_SHIPPING_THRESHOLD = 6000;
	const SELECT_ALL_CHECKBOX = '.cart-left-top .checkbox input[type="checkbox"]';

	const parseNumber = (text) => {
		if (!text) return 0;

		const digits = text.match(/\d+/g);
		if (!digits) return 0;

		return Number(digits.join(''));
	};

	const formatCurrency = (value) => `${value} р`;

	const updateCartSummary = () => {
		let totalItems = 0;
		let totalPrice = 0;

		document.querySelectorAll('.shopping-cart-inner .cart-card').forEach((card) => {
			const checkbox = card.querySelector('input[type="checkbox"]');
			if (!checkbox || !checkbox.checked) return;

			const priceElement = card.querySelector('.cart-card-price .new-price') || card.querySelector('.cart-card-price span:last-child');
			const quantityElement = card.querySelector('.counter .value');

			const price = parseNumber(priceElement?.textContent);
			const quantity = parseNumber(quantityElement?.textContent) || 1;

			totalPrice += price * quantity;
			totalItems += quantity;
		});

		const right = document.querySelector('.cart-right-inner');
		if (!right) return;

		const rows = Array.from(right.querySelectorAll('.cart-right-inner-row'));
		const goodsRow = rows[0];
		const totalRow = rows.find((row) => row.classList.contains('bold'));
		const buttonPrice = right.querySelector('.button.filled span:last-child');
		const progressTrack = right.querySelector('.cart-right-inner-progress-track');
		const progressText = right.querySelector('.cart-right-inner-progress-wrapper p');

		if (goodsRow) {
			const label = goodsRow.querySelector('.cart-right-inner-label');
			const value = goodsRow.querySelector('.cart-right-inner-value');
			if (label) label.textContent = `Товары (${totalItems}):`;
			if (value) value.textContent = formatCurrency(totalPrice);
		}

		if (totalRow) {
			const totalValue = totalRow.querySelector('.cart-right-inner-value');
			if (totalValue) totalValue.textContent = formatCurrency(totalPrice);
		}

		if (buttonPrice) {
			buttonPrice.textContent = formatCurrency(totalPrice);
		}

		if (progressTrack) {
			const percent = totalPrice >= FREE_SHIPPING_THRESHOLD ? 100 : Math.max(0, Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100));
			progressTrack.style.width = `${percent}%`;

			if (totalPrice >= FREE_SHIPPING_THRESHOLD) {
				progressTrack.classList.add('free');
			} else {
				progressTrack.classList.remove('free');
			}
		}

		if (progressText) {
			if (totalPrice >= FREE_SHIPPING_THRESHOLD) {
				progressText.textContent = 'Бесплатная доставка';
				progressText.classList.add('free');
			} else {
				progressText.textContent = 'Бесплатная доставка при заказе от 6 000 р';
				progressText.classList.remove('free');
			}
		}
	};

	const syncSelectAllState = (section, selectAll) => {
		if (!selectAll) return;

		const boxes = Array.from(section.querySelectorAll('.cart-card input[type="checkbox"]'));

		if (!boxes.length) {
			selectAll.checked = false;
			selectAll.indeterminate = false;
			return;
		}

		const checkedCount = boxes.filter((box) => box.checked).length;

		selectAll.checked = checkedCount === boxes.length;
		selectAll.indeterminate = checkedCount > 0 && checkedCount < boxes.length;
	};

	const handleCounterClick = (event) => {
		const target = event.target;

		if (!target || target.nodeType !== 1) return false;

		const button = target.closest('.counter button');

		if (!button) return false;

		const counter = button.closest('.counter');

		if (!counter) return false;

		const valueElement = counter.querySelector('.value');

		if (!valueElement) return false;

		let quantity = parseNumber(valueElement.textContent) || 1;

		if (button.classList.contains('incr')) {
			quantity += 1;
		} else if (button.classList.contains('decr')) {
			quantity = Math.max(1, quantity - 1);
		} else {
			return false;
		}

		valueElement.textContent = String(quantity);

		return true;
	};

	const sections = Array.from(document.querySelectorAll('.shopping-cart-inner'));

	if (!sections.length) return;

	sections.forEach((section) => {
		const selectAll = section.querySelector(SELECT_ALL_CHECKBOX);

		if (selectAll) {
			selectAll.addEventListener('change', () => {
				const boxes = section.querySelectorAll('.cart-card input[type="checkbox"]');
				const shouldCheck = Boolean(selectAll.checked);

				boxes.forEach((box) => {
					box.checked = shouldCheck;
				});

				selectAll.indeterminate = false;
				syncSelectAllState(section, selectAll);
				updateCartSummary();
			});
		}

		section.addEventListener('change', (event) => {
			const target = event.target;

			if (!target || !target.matches('.cart-card input[type="checkbox"]')) return;

			syncSelectAllState(section, selectAll);
			updateCartSummary();
		});

		section.addEventListener('click', (event) => {
			
			if (!handleCounterClick(event)) return;
			updateCartSummary();
		});

		syncSelectAllState(section, selectAll);
	});

	updateCartSummary();
}