document.addEventListener('DOMContentLoaded', () => {
	'use strict';
})

const initOrder = () => {
	const deliveryButtons = document.querySelectorAll('.cart-left-button');
	const deliveryInput = document.getElementById('delivery-method-input');

	if (!deliveryButtons || !deliveryInput) return;

	deliveryButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			deliveryButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');
			deliveryInput.value = button.dataset.select || '';
		});
	});
};

export { initOrder };
