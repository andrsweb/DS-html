document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    initReviewModal();
});

const initReviewModal = () => {
    const modal = document.querySelector('.review-modal');

    if (!modal) return;

    const form = modal.querySelector('#review-form');
    const starRating = modal.querySelector('.star-rating');
    const ratingInput = modal.querySelector('#review-rating');
    const fileInput = modal.querySelector('#review-images');
    const filePreview = modal.querySelector('.file-upload-preview');
    const fileUploadAdd = modal.querySelector('.file-upload-add');

    let selectedFiles = [];
    const maxFiles = 4;

    const updateAddButtonVisibility = () => {
        if (selectedFiles.length >= maxFiles) {
            fileUploadAdd.style.display = 'none';
        } else {
            fileUploadAdd.style.display = 'flex';
        }
    };

    if (starRating) {
        const stars = starRating.querySelectorAll('.star-btn');

        stars.forEach((star, index) => {
            star.addEventListener('click', (e) => {
                e.preventDefault();
                const value = parseInt(star.dataset.value);

                starRating.dataset.rating = value;
                ratingInput.value = value;

                stars.forEach((s, i) => {
                    if (i < value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

            files.forEach(file => {
                if (selectedFiles.length >= maxFiles) {
                    return;
                }

                if (!allowedFormats.includes(file.type)) {
                    alert('Разрешены только форматы: JPG, JPEG, PNG, WEBP');
                    return;
                }

                selectedFiles.push(file);

                const reader = new FileReader();
                reader.onload = (event) => {
                    const item = document.createElement('div');
                    item.className = 'file-upload-item';
                    item.innerHTML = `
						<img src="${event.target.result}" alt="Preview">
						<button type="button" class="remove-image" data-index="${selectedFiles.length - 1}"><img src="/img/delete.svg" alt="Удалить"></button>
					`;
                    filePreview.appendChild(item);

                    const removeBtn = item.querySelector('.remove-image');
                    removeBtn.addEventListener('click', (e) => {
                        e.preventDefault();

                        const index = parseInt(removeBtn.dataset.index);

                        selectedFiles.splice(index, 1);
                        item.remove();

                        filePreview.querySelectorAll('.remove-image').forEach((btn, i) => {
                            btn.dataset.index = i;
                        });

                        updateAddButtonVisibility();
                    });

                    updateAddButtonVisibility();
                };
                reader.readAsDataURL(file);
            });

            e.target.value = '';
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            selectedFiles.forEach((file, index) => {
                formData.append(`image_${index}`, file);
            });

            form.reset();
            selectedFiles = [];
            filePreview.innerHTML = '';
            starRating.dataset.rating = '0';
            ratingInput.value = '';

            const stars = starRating.querySelectorAll('.star-btn');

            stars.forEach(s => {
                s.classList.remove('active');
            });

            updateAddButtonVisibility();

            const closeBtn = modal.querySelector('[data-modal-close]');

            if (closeBtn) closeBtn.click();
        });
    }
};
