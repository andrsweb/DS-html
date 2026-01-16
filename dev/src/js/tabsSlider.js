import Swiper from 'swiper';

class TabsSlider {
    constructor(container) {
        this.container = container;
        this.tabButtons = container.querySelectorAll('.tab-buttons button');
        this.tabContents = container.querySelectorAll('.tab-content');
        this.navigationPrev = container.querySelector('.swiper-prev');
        this.navigationNext = container.querySelector('.swiper-next');
        this.swipers = new Map();
        this.currentActiveTab = null;

        this.init();
    }

    init() {
        this.findActiveTab();
        this.initSwipers();
        this.bindEvents();
        this.bindNavigation();
    }

    findActiveTab() {
        const activeButton = this.container.querySelector('.tab-buttons button.active');
        this.currentActiveTab = activeButton ? activeButton.dataset.tab : 'autoflowering';
    }

    initSwipers() {
        this.tabContents.forEach(tabContent => {
            const tabName = tabContent.dataset.tab;
            const swiperEl = tabContent.querySelector('.swiper-cards');

            if (swiperEl) {
                const swiper = new Swiper(swiperEl, {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    breakpoints: {
                        480: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                        1200: {
                            slidesPerView: 3,
                            spaceBetween: 35,
                        },
                    },
                });

                this.swipers.set(tabName, swiper);

                if (tabName !== this.currentActiveTab) {
                    swiper.disable();
                }
            }
        });
    }

    bindEvents() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                if (targetTab !== this.currentActiveTab) {
                    this.switchTab(targetTab);
                }
            });
        });
    }

    bindNavigation() {
        if (this.navigationPrev) {
            this.navigationPrev.addEventListener('click', () => {
                const activeSwiper = this.swipers.get(this.currentActiveTab);
                if (activeSwiper) {
                    activeSwiper.slidePrev();
                }
            });
        }

        if (this.navigationNext) {
            this.navigationNext.addEventListener('click', () => {
                const activeSwiper = this.swipers.get(this.currentActiveTab);
                if (activeSwiper) {
                    activeSwiper.slideNext();
                }
            });
        }
    }

    switchTab(targetTab) {
        const activeButton = this.container.querySelector('.tab-buttons button.active');
        const activeContent = this.container.querySelector('.tab-content.active');
        const targetButton = this.container.querySelector(`.tab-buttons button[data-tab="${targetTab}"]`);
        const targetContent = this.container.querySelector(`.tab-content[data-tab="${targetTab}"]`);

        if (!targetButton || !targetContent || targetTab === this.currentActiveTab) return;

        activeButton?.classList.remove('active');
        activeContent?.classList.remove('active');

        targetButton.classList.add('active');
        targetContent.classList.add('active');

        this.updateSwipers(this.currentActiveTab, targetTab);
        this.currentActiveTab = targetTab;
    }

    updateSwipers(oldTab, newTab) {
        const oldSwiper = this.swipers.get(oldTab);
        const newSwiper = this.swipers.get(newTab);

        if (oldSwiper) {
            oldSwiper.disable();
        }

        if (newSwiper) {
            newSwiper.enable();
            newSwiper.update();
        }
    }

    destroy() {
        this.swipers.forEach(swiper => swiper.destroy());
        this.swipers.clear();
    }
}

const initTabsSliders = () => {
    const sliders = document.querySelectorAll('.cards-slider');
    const instances = [];

    sliders.forEach(slider => {
        instances.push(new TabsSlider(slider));
    });

    return instances;
};

export { TabsSlider, initTabsSliders };
