document.addEventListener('DOMContentLoaded', () => {
    initReadMore();
});

const initReadMore = () => {
    const containers = document.querySelectorAll('.category-title');
    const LIMIT = 350;

    containers.forEach(container => {
        const textEl = container.querySelector('.category-title-info div');
        const button = container.querySelector('.read-more');

        if (!textEl || !button) return;

        const fullText = textEl.textContent.trim();

        if (fullText.length <= LIMIT) {
            button.classList.remove('is-visible');
            return;
        }

        const truncatedText = fullText.slice(0, LIMIT).trim() + '...';
        textEl.textContent = truncatedText;
        button.classList.add('is-visible');

        let isExpanded = false;

        button.addEventListener('click', () => {
            isExpanded = !isExpanded;

            if (isExpanded) {
                textEl.textContent = fullText;
                button.textContent = 'Свернуть';
            } else {
                textEl.textContent = truncatedText;
                button.textContent = 'Читать далее...';
            }
        });
    });
};
