class StickyCartBar extends HTMLElement {
  constructor() {
    super();
    this.priceEle = this.querySelector('.sticky-bar__price');
  }

  connectedCallback() {
    // 订阅cartUpdate事件
    this.unsub = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source === 'sticky-cart-bar') return;
      this.refresh();
    });
  }

  disconnectedCallback() {
    if (this.unsub) this.unsub();
  }

  refresh() {
    // 改用 /cart.js 拿 JSON，不依赖 section 渲染
    fetch(`${window.routes.cart_url}.js`)
      .then(r => r.json())
      .then(cart => {
        console.log('cart:', cart.item_count, '件, 总价(分):', cart.total_price, '货币:', cart.currency);
        if (this.priceEle) {
          // total_price 是分为单位（5000 = $50.00），除以 100 转元
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: window.shopCurrency || cart.currency || 'USD'
          }).format(cart.total_price / 100);
          this.priceEle.textContent = formatted;
        }
        // 闪烁提示
        this.classList.add('is-flash');
        setTimeout(()=> {
          this.classList.remove('is-flash');
        }, 500);
      }).catch(err => console.log('Cart update failed', err));
  }
}

  customElements.define('sticky-cart-bar', StickyCartBar);
