document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	initOrder();
})

const initOrder = () => {
	const initSelectGroup = (buttonSelector, inputSelector) => {
		const buttons = document.querySelectorAll(buttonSelector);
		const input = document.querySelector(inputSelector);

		if (!buttons.length || !input) return;

		buttons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				buttons.forEach(btn => btn.classList.remove('active'));
				button.classList.add('active');
				input.value = button.dataset.select || '';
			});
		});
	};

	initSelectGroup('.cart-left-button', '#delivery-method-input');

	initSelectGroup('.payment-button', '#payment-method-input');
};