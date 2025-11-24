class ProductCard {
    constructor(card) {
        this.card = card;
        this.numButtons = card.querySelectorAll('.card-nums button');
        this.decrButton = card.querySelector('.decr');
        this.incrButton = card.querySelector('.incr');
        this.counterValue = card.querySelector('.card-counter-value');
        this.newPrice = card.querySelector('.new-price');
        this.oldPrice = card.querySelector('.old-price');
        
        this.pricePerSeed = {
            old: parseInt(card.dataset.priceOld) || 1200,
            new: parseInt(card.dataset.priceNew) || 1500
        };
        
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
            button.addEventListener('click', () => {
                const seeds = parseInt(button.textContent);
                this.switchSeedsCount(seeds);
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
    
    switchSeedsCount(seeds) {
        this.currentSeeds = seeds;
        
        this.numButtons.forEach(btn => btn.classList.remove('active'));
        this.card.querySelector(`.card-nums button:nth-child(${seeds})`).classList.add('active');
        
        this.updatePrice();
    }
    
    updateCounter() {
        if (this.counterValue) {
            this.counterValue.textContent = this.currentQuantity;
        }
        
        if (this.decrButton) {
            this.decrButton.disabled = this.currentQuantity <= 1;
        }
        if (this.incrButton) {
            this.incrButton.disabled = this.currentQuantity >= 99;
        }
    }
    
    updatePrice() {
        const totalOld = this.pricePerSeed.old * this.currentSeeds * this.currentQuantity;
        const totalNew = this.pricePerSeed.new * this.currentSeeds * this.currentQuantity;
        
        if (this.oldPrice) {
            this.oldPrice.textContent = `${totalOld} р`;
        }
        if (this.newPrice) {
            this.newPrice.textContent = `${totalNew} р`;
        }
    }
    
    getState() {
        return {
            productId: this.card.dataset.productId,
            seeds: this.currentSeeds,        
            quantity: this.currentQuantity,
            totalPrice: this.pricePerSeed.new * this.currentSeeds * this.currentQuantity
        };
    }
}

const initProductCards = () => {
    const cards = document.querySelectorAll('.card');
    const instances = [];
    
    cards.forEach(card => {
        instances.push(new ProductCard(card));
    });
    
    return instances;
};

export { ProductCard, initProductCards };
