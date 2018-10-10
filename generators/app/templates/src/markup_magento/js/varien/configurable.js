/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category    Varien
 * @package     js
 * @copyright   Copyright (c) 2014 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */
if (typeof Product === 'undefined') {
  var Product = {};
}

/** ************************** CONFIGURABLE PRODUCT ************************* */
Product.Config = Class.create();
Product.Config.prototype = {
  initialize(config) {
    this.config = config;
    this.taxConfig = this.config.taxConfig;
    if (config.containerId) {
      this.settings = $$(`#${config.containerId} ` + `.super-attribute-select`);
    } else {
      this.settings = $$('.super-attribute-select');
    }
    this.state = new Hash();
    this.priceTemplate = new Template(this.config.template);
    this.prices = config.prices;

    // Set default values from config
    if (config.defaultValues) {
      this.values = config.defaultValues;
    }

    // Overwrite defaults by url
    const separatorIndex = window.location.href.indexOf('#');
    if (separatorIndex != -1) {
      const paramsStr = window.location.href.substr(separatorIndex + 1);
      const urlValues = paramsStr.toQueryParams();
      if (!this.values) {
        this.values = {};
      }
      for (var i in urlValues) {
        this.values[i] = urlValues[i];
      }
    }

    // Overwrite defaults by inputs values if needed
    if (config.inputsInitialized) {
      this.values = {};
      this.settings.each(element => {
        if (element.value) {
          const attributeId = element.id.replace(/[a-z]*/, '');
          this.values[attributeId] = element.value;
        }
      });
    }

    // Put events to check select reloads
    this.settings.each(element => {
      Event.observe(element, 'change', this.configure.bind(this));
    });

    // fill state
    this.settings.each(element => {
      const attributeId = element.id.replace(/[a-z]*/, '');
      if (attributeId && this.config.attributes[attributeId]) {
        element.config = this.config.attributes[attributeId];
        element.attributeId = attributeId;
        this.state[attributeId] = false;
      }
    });

    // Init settings dropdown
    const childSettings = [];
    for (var i = this.settings.length - 1; i >= 0; i--) {
      const prevSetting = this.settings[i - 1] ? this.settings[i - 1] : false;
      const nextSetting = this.settings[i + 1] ? this.settings[i + 1] : false;
      if (i == 0) {
        this.fillSelect(this.settings[i]);
      } else {
        this.settings[i].disabled = true;
      }
      $(this.settings[i]).childSettings = childSettings.clone();
      $(this.settings[i]).prevSetting = prevSetting;
      $(this.settings[i]).nextSetting = nextSetting;
      childSettings.push(this.settings[i]);
    }

    // Set values to inputs
    this.configureForValues();
    document.observe('dom:loaded', this.configureForValues.bind(this));
  },

  configureForValues() {
    if (this.values) {
      this.settings.each(element => {
        const attributeId = element.attributeId;
        element.value = typeof this.values[attributeId] === 'undefined' ? '' : this.values[attributeId];
        this.configureElement(element);
      });
    }
  },

  configure(event) {
    const element = Event.element(event);
    this.configureElement(element);
  },

  configureElement(element) {
    this.reloadOptionLabels(element);
    if (element.value) {
      this.state[element.config.id] = element.value;
      if (element.nextSetting) {
        element.nextSetting.disabled = false;
        this.fillSelect(element.nextSetting);
        this.resetChildren(element.nextSetting);
      }
    } else {
      this.resetChildren(element);
    }
    this.reloadPrice();
  },

  reloadOptionLabels(element) {
    let selectedPrice;
    if (element.options[element.selectedIndex].config && !this.config.stablePrices) {
      selectedPrice = parseFloat(element.options[element.selectedIndex].config.price);
    } else {
      selectedPrice = 0;
    }
    for (let i = 0; i < element.options.length; i++) {
      if (element.options[i].config) {
        element.options[i].text = this.getOptionLabel(
          element.options[i].config,
          element.options[i].config.price - selectedPrice
        );
      }
    }
  },

  resetChildren(element) {
    if (element.childSettings) {
      for (let i = 0; i < element.childSettings.length; i++) {
        element.childSettings[i].selectedIndex = 0;
        element.childSettings[i].disabled = true;
        if (element.config) {
          this.state[element.config.id] = false;
        }
      }
    }
  },

  fillSelect(element) {
    const attributeId = element.id.replace(/[a-z]*/, '');
    const options = this.getAttributeOptions(attributeId);
    this.clearSelect(element);
    element.options[0] = new Option('', '');
    element.options[0].innerHTML = this.config.chooseText;

    let prevConfig = false;
    if (element.prevSetting) {
      prevConfig = element.prevSetting.options[element.prevSetting.selectedIndex];
    }

    if (options) {
      let index = 1;
      for (let i = 0; i < options.length; i++) {
        let allowedProducts = [];
        if (prevConfig) {
          for (let j = 0; j < options[i].products.length; j++) {
            if (
              prevConfig.config.allowedProducts &&
              prevConfig.config.allowedProducts.indexOf(options[i].products[j]) > -1
            ) {
              allowedProducts.push(options[i].products[j]);
            }
          }
        } else {
          allowedProducts = options[i].products.clone();
        }

        if (allowedProducts.size() > 0) {
          options[i].allowedProducts = allowedProducts;
          element.options[index] = new Option(this.getOptionLabel(options[i], options[i].price), options[i].id);
          if (typeof options[i].price !== 'undefined') {
            element.options[index].setAttribute('price', options[i].price);
          }
          element.options[index].config = options[i];
          index++;
        }
      }
    }
  },

  getOptionLabel(option, price) {
    var price = parseFloat(price);
    if (this.taxConfig.includeTax) {
      var tax = (price / (100 + this.taxConfig.defaultTax)) * this.taxConfig.defaultTax;
      var excl = price - tax;
      var incl = excl * (1 + this.taxConfig.currentTax / 100);
    } else {
      var tax = price * (this.taxConfig.currentTax / 100);
      var excl = price;
      var incl = excl + tax;
    }

    if (this.taxConfig.showIncludeTax || this.taxConfig.showBothPrices) {
      price = incl;
    } else {
      price = excl;
    }

    let str = option.label;
    if (price) {
      if (this.taxConfig.showBothPrices) {
        str += ` ${this.formatPrice(excl, true)} (${this.formatPrice(price, true)} ${this.taxConfig.inclTaxTitle})`;
      } else {
        str += ` ${this.formatPrice(price, true)}`;
      }
    }
    return str;
  },

  formatPrice(price, showSign) {
    let str = '';
    price = parseFloat(price);
    if (showSign) {
      if (price < 0) {
        str += '-';
        price = -price;
      } else {
        str += '+';
      }
    }

    const roundedPrice = (Math.round(price * 100) / 100).toString();

    if (this.prices && this.prices[roundedPrice]) {
      str += this.prices[roundedPrice];
    } else {
      str += this.priceTemplate.evaluate({ price: price.toFixed(2) });
    }
    return str;
  },

  clearSelect(element) {
    for (let i = element.options.length - 1; i >= 0; i--) {
      element.remove(i);
    }
  },

  getAttributeOptions(attributeId) {
    if (this.config.attributes[attributeId]) {
      return this.config.attributes[attributeId].options;
    }
  },

  reloadPrice() {
    if (this.config.disablePriceReload) {
      return;
    }
    let price = 0;
    let oldPrice = 0;
    for (let i = this.settings.length - 1; i >= 0; i--) {
      const selected = this.settings[i].options[this.settings[i].selectedIndex];
      if (selected.config) {
        price += parseFloat(selected.config.price);
        oldPrice += parseFloat(selected.config.oldPrice);
      }
    }

    optionsPrice.changePrice('config', { price, oldPrice });
    optionsPrice.reload();

    return price;

    if ($(`product-price-${this.config.productId}`)) {
      $(`product-price-${this.config.productId}`).innerHTML = price;
    }
    this.reloadOldPrice();
  },

  reloadOldPrice() {
    if (this.config.disablePriceReload) {
      return;
    }
    if ($(`old-price-${this.config.productId}`)) {
      let price = parseFloat(this.config.oldPrice);
      for (let i = this.settings.length - 1; i >= 0; i--) {
        const selected = this.settings[i].options[this.settings[i].selectedIndex];
        if (selected.config) {
          price += parseFloat(selected.config.price);
        }
      }
      if (price < 0) price = 0;
      price = this.formatPrice(price);

      if ($(`old-price-${this.config.productId}`)) {
        $(`old-price-${this.config.productId}`).innerHTML = price;
      }
    }
  }
};
