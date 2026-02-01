class ProductCard {
    constructor(card) {
        this.card = card;
        this.numButtons = card.querySelectorAll('.card-nums button, .quantity-item');
        this.decrButton = card.querySelector('.decr');
        this.incrButton = card.querySelector('.incr');
        this.counterValue = card.querySelector('.value');
        this.newPrice = card.querySelector('.new-price') || card.querySelector('.single-info-price .price');
        this.oldPrice = card.querySelector('.old-price');
        this.buttonPrice = card.querySelector('.button.filled span:last-child');

        this.inputSeedsCount = card.querySelector('input[name="seeds_count"]');
        this.inputQuantity = card.querySelector('input[name="quantity"]');

        this.unitPrice = {
            old: parseInt(card.dataset.priceOld) || (this.oldPrice ? parseInt(this.oldPrice.textContent.replace(/\D/g, '')) : 0),
            new: parseInt(card.dataset.priceNew) || (this.newPrice ? parseInt(this.newPrice.textContent.replace(/\D/g, '')) : 0)
        };

        this.pricePerSeed = {...this.unitPrice};

        this.isSingleInfo = card.classList.contains('single-info');
        this.currentSeeds = 1;
        this.currentQuantity = 1;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updatePrice();
    }

    bindEvents() {
        this.numButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = button.querySelector('.quantity-x')?.textContent || button.textContent;
                const seeds = parseInt(text.replace(/\D/g, ''));
                this.switchSeedsCount(seeds, button);
            });
        });

        this.decrButton?.addEventListener('click', () => {
            if (this.currentQuantity > 1) {
                this.currentQuantity--;
                this.updateCounter();
                this.updatePrice();
            }
        });

        this.incrButton?.addEventListener('click', () => {
            if (this.currentQuantity < 99) {
                this.currentQuantity++;
                this.updateCounter();
                this.updatePrice();
            }
        });
    }

    switchSeedsCount(seeds, clickedButton) {
        this.currentSeeds = seeds;

        if (this.inputSeedsCount) {
            this.inputSeedsCount.value = seeds;
        }

        if (clickedButton) {
            if (clickedButton.classList.contains('quantity-item')) {
                const packNewPrice = clickedButton.querySelector('.price');
                const packOldPrice = clickedButton.querySelector('.old-price');

                if (packNewPrice) {
                    this.pricePerSeed.new = parseInt(packNewPrice.textContent.replace(/\D/g, ''));
                }
                if (packOldPrice) {
                    this.pricePerSeed.old = parseInt(packOldPrice.textContent.replace(/\D/g, ''));
                }
            } else {
                this.pricePerSeed.new = this.unitPrice.new * seeds;
                this.pricePerSeed.old = this.unitPrice.old * seeds;
            }
        }

        this.numButtons.forEach(btn => btn.classList.remove('active'));
        if (clickedButton) {
            clickedButton.classList.add('active');
        } else {
            const btn = Array.from(this.numButtons).find(b => parseInt((b.querySelector('.quantity-x')?.textContent || b.textContent).replace(/\D/g, '')) === seeds);
            btn?.classList.add('active');
        }

        this.updatePrice();
    }

    updateCounter() {
        if (this.counterValue) {
            this.counterValue.textContent = this.currentQuantity;
        }

        if (this.inputQuantity) {
            this.inputQuantity.value = this.currentQuantity;
        }

        if (this.decrButton) {
            this.decrButton.disabled = this.currentQuantity <= 1;
        }
        if (this.incrButton) {
            this.incrButton.disabled = this.currentQuantity >= 99;
        }
    }

    updatePrice() {
        const baseOld = this.pricePerSeed.old;
        const baseNew = this.pricePerSeed.new;

        const totalOld = baseOld * this.currentQuantity;
        const totalNew = baseNew * this.currentQuantity;

        if (this.oldPrice) {
            this.oldPrice.textContent = `${this.isSingleInfo ? baseOld : totalOld} р`;
        }
        if (this.newPrice) {
            this.newPrice.textContent = `${this.isSingleInfo ? baseNew : totalNew} р`;
        }

        if (this.buttonPrice) {
            this.buttonPrice.textContent = `${totalNew} р`;
        }
    }

    getState() {
        return {
            productId: this.card.dataset.productId,
            seeds: this.currentSeeds,
            quantity: this.currentQuantity,
            totalPrice: this.pricePerSeed.new * this.currentQuantity
        };
    }
}

const initProductCards = () => {
    const cards = document.querySelectorAll('.card, .single-info');
    const instances = [];

    cards.forEach(card => {
        instances.push(new ProductCard(card));
    });

    return instances;
};

export {ProductCard, initProductCards};
