document.addEventListener('DOMContentLoaded', () => {
    initFilters();
});

const initFilters = () => {
    const radios = document.querySelectorAll('.category-aside input[type="radio"]');
    const resetBtn = document.querySelector('.js-reset-filters');

    if (!radios.length && !resetBtn) return;

    radios.forEach(radio => {
        const savedValue = localStorage.getItem(`filter-radio-${radio.name}`);
        if (savedValue === radio.id) {
            radio.checked = true;
        }
    });

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                localStorage.setItem(`filter-radio-${radio.name}`, radio.id);
            }
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const groups = {};
            radios.forEach(radio => {
                if (!groups[radio.name]) {
                    groups[radio.name] = [];
                }
                groups[radio.name].push(radio);
            });

            Object.keys(groups).forEach(name => {
                const group = groups[name];
                if (group.length > 0) {
                    group[0].checked = true;
                    localStorage.removeItem(`filter-radio-${name}`);
                }
            });
        });
    }
};
