export const initGiftModal = () => {
    const modal = document.querySelector('.gift-modal');
    if (!modal || modal.dataset.init) return;
    modal.dataset.init = 'true';

    const state = {
        tabs: {}
    };

    const tabButtons = modal.querySelectorAll('.modal-tab-button');
    tabButtons.forEach(btn => {
        const tabId = btn.dataset.tab;
        const limitStr = btn.querySelector('.all')?.textContent;
        const limit = parseInt(limitStr) || 10;
        state.tabs[tabId] = {
            items: {},
            limit: limit
        };
    });

    const updateModalUI = () => {
        tabButtons.forEach(btn => {
            const tabId = btn.dataset.tab;
            const currentEl = btn.querySelector('.current');
            const tabState = state.tabs[tabId];

            const currentSum = Object.values(tabState.items)
                .reduce((sum, item) => sum + item.quantity, 0);

            if (currentEl) currentEl.textContent = currentSum;
        });

        const modalChosenWrapper = modal.querySelector('.choosen-wrapper');
        const modalChosenItems = modal.querySelector('.choosen-items');

        const allSelected = [];
        Object.values(state.tabs).forEach(tab => {
            Object.entries(tab.items).forEach(([id, item]) => {
                if (item.quantity > 0) {
                    allSelected.push(item);
                }
            });
        });

        if (allSelected.length > 0) {
            modalChosenWrapper?.classList.add('active');
            if (modalChosenItems) {
                modalChosenItems.innerHTML = allSelected.map(item => `
                    <div class="choosen-item">
                        <p>${item.name}</p>
                        <span>${item.quantity} шт.</span>
                    </div>
                `).join('');
            }
        } else {
            modalChosenWrapper?.classList.remove('active');
            if (modalChosenItems) modalChosenItems.innerHTML = '';
        }
    };

    const syncToMainCart = () => {
        const cartWrapper = document.getElementById('cart-selected-gifts');
        if (!cartWrapper) return;

        const cartItemsList = cartWrapper.querySelector('.choosen-items');

        const allSelected = [];
        Object.values(state.tabs).forEach(tab => {
            Object.values(tab.items).forEach(item => {
                if (item.quantity > 0) allSelected.push(item);
            });
        });

        if (allSelected.length > 0) {
            cartWrapper.classList.add('active');
            if (cartItemsList) {
                cartItemsList.innerHTML = allSelected.map(item => `
                    <div class="choosen-item">
                        <p>${item.name}</p>
                        <span>${item.quantity} шт.</span>
                    </div>
                `).join('');
            }
        } else {
            cartWrapper.classList.remove('active');
            if (cartItemsList) cartItemsList.innerHTML = '';
        }
    };

    modal.addEventListener('click', (e) => {
        const target = e.target;

        const incr = target.closest('.incr');
        const decr = target.closest('.decr');

        if (incr || decr) {
            e.preventDefault();
            e.stopPropagation();

            const card = (incr || decr).closest('.modal-tab-card');
            if (!card) return;

            const id = card.dataset.id;
            const name = card.dataset.name;
            const tabContent = card.closest('.tab-content');
            const tabId = tabContent ? tabContent.dataset.tab : null;

            if (!tabId || !state.tabs[tabId]) return;

            const tabState = state.tabs[tabId];
            if (!tabState.items[id]) {
                tabState.items[id] = { name, quantity: 0 };
            }

            if (incr) {
                const currentTabSum = Object.values(tabState.items)
                    .reduce((sum, item) => sum + item.quantity, 0);

                if (currentTabSum < tabState.limit) {
                    tabState.items[id].quantity++;
                }
            } else if (decr) {
                if (tabState.items[id].quantity > 0) {
                    tabState.items[id].quantity--;
                }
            }

            const valueEl = card.querySelector('.value');
            if (valueEl) valueEl.textContent = tabState.items[id].quantity;
            updateModalUI();
        }

        const resetBtn = target.closest('button');
        if (resetBtn && resetBtn.textContent.trim() === 'Сбросить') {
            e.preventDefault();
            Object.values(state.tabs).forEach(tab => {
                Object.keys(tab.items).forEach(id => {
                    tab.items[id].quantity = 0;
                });
            });
            modal.querySelectorAll('.modal-tab-card .value').forEach(v => v.textContent = '0');
            updateModalUI();
        }

        if (resetBtn && resetBtn.textContent.trim() === 'Подтвердить') {
            e.preventDefault();
            syncToMainCart();

            const closeBtn = modal.querySelector('[data-modal-close]');
            if (closeBtn) {
                closeBtn.click();
            } else {
                const modalWrapper = modal.closest('.modal-wrapper');
                if (modalWrapper) modalWrapper.classList.remove('modal-wrapper-active');
            }
        }
    });

    modal.querySelectorAll('.modal-tab-card .value').forEach(v => v.textContent = '0');
    updateModalUI();
};
