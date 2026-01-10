import noUiSlider from 'nouislider';

document.addEventListener('DOMContentLoaded', () => {
	initRangeInputs();
});

const initRangeInputs = () => {
	const rangeInputs = document.querySelectorAll('.range-input');

	rangeInputs.forEach(container => {
		const wrapper = container.querySelector('.range-wrapper');
		const inputMin = container.querySelector('.range-input-value:first-child input');
		const inputMax = container.querySelector('.range-input-value:last-child input');

		if (!wrapper || !inputMin || !inputMax) return;

		const min = parseFloat(wrapper.dataset.min) || 0;
		const max = parseFloat(wrapper.dataset.max) || 100;
		const step = parseFloat(wrapper.dataset.step) || 1;
		const unit = wrapper.dataset.unit || '';

		if (wrapper.noUiSlider) {
			wrapper.noUiSlider.destroy();
		}

		noUiSlider.create(wrapper, {
			start: [min, max],
			connect: true,
			step: step,
			range: {
				'min': min,
				'max': max
			}
		});

		wrapper.noUiSlider.on('update', (values, handle) => {
			const value = Math.round(parseFloat(values[handle]));
			if (handle === 0) {
				inputMin.value = value + unit;
			} else {
				inputMax.value = value + unit;
			}
		});
	});
}
