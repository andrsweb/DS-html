export class Tabs {
    constructor(container) {
        this.container = container;
        this.buttons = container.querySelectorAll('[data-tab-btn]');
        this.contents = container.querySelectorAll('[data-tab-content]');
        this.init();
    }

    init() {
        if (!this.buttons.length || !this.contents.length) return;

        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.dataset.tabBtn;
                this.switchTab(targetId);
            });
        });
    }

    switchTab(targetId) {
        this.buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tabBtn === targetId);
        });

        this.contents.forEach(content => {
            content.classList.toggle('active', content.dataset.tabContent === targetId);
        });
    }
}

export const initTabs = () => {
    const tabGroups = document.querySelectorAll('[data-tabs]');
    tabGroups.forEach(group => new Tabs(group));
};
