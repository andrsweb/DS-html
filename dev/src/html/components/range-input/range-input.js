import noUiSlider from 'nouislider';

document.addEventListener('DOMContentLoaded', () => {
	initRangeInputs();
});

const initRangeInputs = () => {
	const rangeInputs = document.querySelectorAll('.range-input');
	const resetBtn = document.querySelector('.js-reset-filters');

	rangeInputs.forEach(container => {
		const wrapper = container.querySelector('.range-wrapper');
		const inputMin = container.querySelector('.range-input-value:first-child input');
		const inputMax = container.querySelector('.range-input-value:last-child input');

		if (!wrapper || !inputMin || !inputMax) return;

		const id = wrapper.dataset.id;
		const min = parseFloat(wrapper.dataset.min) || 0;
		const max = parseFloat(wrapper.dataset.max) || 100;
		const step = parseFloat(wrapper.dataset.step) || 1;
		const unit = wrapper.dataset.unit || '';

		let startValues = [min, max];
		const saved = localStorage.getItem(`range-${id}`);
		if (saved) {
			try {
				startValues = JSON.parse(saved);
			} catch (e) {
				console.error('Error parsing range data from localStorage', e);
			}
		}

		if (wrapper.noUiSlider) {
			wrapper.noUiSlider.destroy();
		}

		noUiSlider.create(wrapper, {
			start: startValues,
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

		wrapper.noUiSlider.on('change', (values) => {
			localStorage.setItem(`range-${id}`, JSON.stringify(values.map(v => parseFloat(v))));
			const event = new Event('change');
			inputMax.dispatchEvent(event);
		});

		if (resetBtn) {
			resetBtn.addEventListener('click', () => {
				wrapper.noUiSlider.set([min, max]);
				localStorage.removeItem(`range-${id}`);
			});
		}
	});
}
