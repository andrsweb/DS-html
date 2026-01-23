import {initProductCards} from "./common/productCard.js";

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initTags();
    initSubmitForm();
});

const initFilters = () => {
    const radios = document.querySelectorAll('.category-aside input[type="checkbox"]');
    const inputs = document.querySelectorAll('.category-aside input[type="text"], .category-aside input[type="number"], .category-aside select');
    const resetBtn = document.querySelector('.js-reset-filters');

    if (!radios.length && !resetBtn) return;

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateProducts();
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            radios.forEach(radio => {
                radio.checked = false;
            });
        });
    }

    if (!inputs.length) {
        return;
    }

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateProducts(true);
        });
    });
};

const initTags = () => {
    const tagButtons = document.querySelectorAll('.category-links-items a');
    if (!tagButtons.length) return;

    tagButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            button.classList.toggle('active');
            updateProducts(true);
        });
    });
};

function initSubmitForm() {
    let filtersForm = document.getElementById('filters');
    if (!filtersForm) return;

    filtersForm.addEventListener('submit', function (e) {
        e.preventDefault();

        updateProducts();
    });
}

const updateProducts = (updateCount = false) => {
    const filtersForm = document.getElementById('filters');
    if (!filtersForm) return;


    const radios = filtersForm.querySelectorAll('input[type="checkbox"], input[type="radio"]'),
        inputs = filtersForm.querySelectorAll('input[type="text"], input[type="number"], select'),
        tagsBlock = document.querySelector('.category-links-items');

    let formData = new FormData(filtersForm);

    if (tagsBlock) {
        let tags = tagsBlock.querySelectorAll('.active');
        tags.forEach(tag => {
            formData.append('tags[]', tag.dataset.tag_term_slug);
        });
    }

    radios.forEach(radio => {
        if (radio.checked) {
            formData.append(radio.name, radio.value);
        }
    });

    inputs.forEach(input => {
        if (input.value) {
            formData.append(input.name, input.value);
        }
    });

    let categoryCards = document.querySelector('.category-cards'),
        productsBlock = categoryCards.querySelector('.category-cards-items'),
        productsCountBlock = document.getElementById('products_count'),
        filterSpans = filtersForm.querySelectorAll('.category-aside-inner span[data-products_count]');

    categoryCards.classList.add('loading');

    fetch(ajax_object.ajax_url, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                productsBlock.innerHTML = response.data.products_html;
                productsCountBlock.innerHTML = response.data.products_count;

                if (updateCount) {
                    filterSpans.forEach(span => {
                        let pa_id = span.dataset.products_count;
                        if (response.data.filters_count[pa_id] === undefined) {
                            span.innerHTML = '0';
                            return;
                        }

                        span.innerHTML = response.data.filters_count[pa_id];
                    });
                }
            }
            setTimeout(() => {
                initProductCards();
                categoryCards.classList.remove('loading');
            }, 500);
        })
        .catch(error => {
            console.log(error);
            categoryCards.classList.remove('loading');
        });
};