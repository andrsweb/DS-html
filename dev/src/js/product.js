document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    initProductVariationButtons();
    initSingleAddToCart();
});

const initProductVariationButtons = () => {
    const buttons = document.querySelectorAll('.quantity-items .quantity-item');
    let variationInput = document.querySelector('input[name="variation_id"]');

    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const variationId = button.dataset.variationId;
            if (variationInput) {
                variationInput.value = variationId;
            }
        });
    });
}

const initSingleAddToCart = () => {
    let singleProductForm = document.querySelector('form[name="product_form"]');
    if (!singleProductForm) return;

    singleProductForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(singleProductForm);
        const productId = formData.get('product_id');
        const quantity = formData.get('quantity') || 1;
        const variationId = formData.get('variation_id');

        console.log('Add to cart:', {
            productId,
            variationId,
            quantity
        });
    });
}