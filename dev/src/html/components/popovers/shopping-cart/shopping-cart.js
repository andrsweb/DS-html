document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	shoppingCartActions();
});

const shoppingCartActions = () => {
	const cart = document.querySelector('.shopping-cart');

	if (!cart) return;

	const updateTotals = () => {
		const parsePrice = (txt) => Number(txt.replace(/\D/g, '')) || 0;
		let total = 0;

		cart.querySelectorAll('.shopping-cart-card').forEach(card => {
			const priceText = card.querySelector('.shopping-cart-card-desc span')?.textContent || '0';
			const price = Number(priceText.replace(/\D/g, '')) || 0;
			const qty = Number(card.querySelector('.value')?.textContent) || 0;
			total += price * qty;
		});

		const totalElement = cart.querySelector('.shopping-cart-value');
		const discountElement = cart.querySelector('.shopping-cart-desc-item:nth-child(2) span');
		const deliveryElement = cart.querySelector('.shopping-cart-desc-item:nth-child(3) span');
		const finalElement = cart.querySelector('.shopping-cart-desc-bottom .shopping-cart-desc-item.bold span.shopping-cart-desc-title');

		if (totalElement) totalElement.textContent = `${total} р`;

		const discount = discountElement ? parsePrice(discountElement.textContent) : 0;
		const delivery = deliveryElement ? parsePrice(deliveryElement.textContent) : 0;
		const final = total - discount + delivery;

		if (finalElement) finalElement.textContent = `${final} р`;
	};

	cart.addEventListener('click', event => {
		const btn = event.target.closest('button');

		if (!btn) return;

		if (btn.classList.contains('s-incr') || btn.classList.contains('s-decr')) {
			const valueEl = btn.parentElement.querySelector('.value');

			if (!valueEl) return;

			let qty = Number(valueEl.textContent) || 0;
			qty += btn.classList.contains('s-incr') ? 1 : -1;

			if (qty < 1) qty = 1;

			valueEl.textContent = String(qty);

			updateTotals();
		}
	});

	updateTotals();
};
