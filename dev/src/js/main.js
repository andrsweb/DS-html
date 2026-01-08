import './common/common';
import '../html/components/common/popover-manager';
import './tabsSlider';
import '../html/components/popovers/shopping-cart/shopping-cart';
import '../html/components/cart-card/cart-card';
import { initOrder } from '../html/sections/shopping-cart-order/cart-inner/order';

document.addEventListener('DOMContentLoaded', () => {
    initOrder();
});

import '../html/components/popovers/search-result/search-result';
import './dropdown';
import './popover';