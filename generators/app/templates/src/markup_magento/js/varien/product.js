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

/** ******************* IMAGE ZOOMER ********************** */

Product.Zoom = Class.create();
/**
 * Image zoom control
 *
 * @author      Magento Core Team <core@magentocommerce.com>
 */
Product.Zoom.prototype = {
  initialize(imageEl, trackEl, handleEl, zoomInEl, zoomOutEl, hintEl) {
    this.containerEl = $(imageEl).parentNode;
    this.imageEl = $(imageEl);
    this.handleEl = $(handleEl);
    this.trackEl = $(trackEl);
    this.hintEl = $(hintEl);

    this.containerDim = Element.getDimensions(this.containerEl);
    this.imageDim = Element.getDimensions(this.imageEl);

    this.imageDim.ratio = this.imageDim.width / this.imageDim.height;

    this.floorZoom = 1;

    if (this.imageDim.width > this.imageDim.height) {
      this.ceilingZoom = this.imageDim.width / this.containerDim.width;
    } else {
      this.ceilingZoom = this.imageDim.height / this.containerDim.height;
    }

    if (this.imageDim.width <= this.containerDim.width && this.imageDim.height <= this.containerDim.height) {
      this.trackEl.up().hide();
      this.hintEl.hide();
      this.containerEl.removeClassName('product-image-zoom');
      return;
    }

    this.imageX = 0;
    this.imageY = 0;
    this.imageZoom = 1;

    this.sliderSpeed = 0;
    this.sliderAccel = 0;
    this.zoomBtnPressed = false;

    this.showFull = false;

    this.selects = document.getElementsByTagName('select');

    this.draggable = new Draggable(imageEl, {
      starteffect: false,
      reverteffect: false,
      endeffect: false,
      snap: this.contain.bind(this)
    });

    this.slider = new Control.Slider(handleEl, trackEl, {
      axis: 'horizontal',
      minimum: 0,
      maximum: Element.getDimensions(this.trackEl).width,
      alignX: 0,
      increment: 1,
      sliderValue: 0,
      onSlide: this.scale.bind(this),
      onChange: this.scale.bind(this)
    });

    this.scale(0);

    Event.observe(this.imageEl, 'dblclick', this.toggleFull.bind(this));

    Event.observe($(zoomInEl), 'mousedown', this.startZoomIn.bind(this));
    Event.observe($(zoomInEl), 'mouseup', this.stopZooming.bind(this));
    Event.observe($(zoomInEl), 'mouseout', this.stopZooming.bind(this));

    Event.observe($(zoomOutEl), 'mousedown', this.startZoomOut.bind(this));
    Event.observe($(zoomOutEl), 'mouseup', this.stopZooming.bind(this));
    Event.observe($(zoomOutEl), 'mouseout', this.stopZooming.bind(this));
  },

  toggleFull() {
    this.showFull = !this.showFull;

    // Hide selects for IE6 only
    if (typeof document.body.style.maxHeight === 'undefined') {
      for (i = 0; i < this.selects.length; i++) {
        this.selects[i].style.visibility = this.showFull ? 'hidden' : 'visible';
      }
    }
    val_scale = !this.showFull ? this.slider.value : 1;
    this.scale(val_scale);

    this.trackEl.style.visibility = this.showFull ? 'hidden' : 'visible';
    this.containerEl.style.overflow = this.showFull ? 'visible' : 'hidden';
    this.containerEl.style.zIndex = this.showFull ? '1000' : '9';

    return this;
  },

  scale(v) {
    const centerX = ((this.containerDim.width * (1 - this.imageZoom)) / 2 - this.imageX) / this.imageZoom;
    const centerY = ((this.containerDim.height * (1 - this.imageZoom)) / 2 - this.imageY) / this.imageZoom;
    const overSize = this.imageDim.width > this.containerDim.width || this.imageDim.height > this.containerDim.height;

    this.imageZoom = this.floorZoom + v * (this.ceilingZoom - this.floorZoom);

    if (overSize) {
      if (this.imageDim.width > this.imageDim.height) {
        this.imageEl.style.width = `${this.imageZoom * this.containerDim.width}px`;
      } else {
        this.imageEl.style.height = `${this.imageZoom * this.containerDim.height}px`;
      }
      if (this.containerDim.ratio) {
        if (this.imageDim.width > this.imageDim.height) {
          this.imageEl.style.height = `${this.imageZoom * this.containerDim.width * this.containerDim.ratio}px`; // for safari
        } else {
          this.imageEl.style.width = `${this.imageZoom * this.containerDim.height * this.containerDim.ratio}px`; // for safari
        }
      }
    } else {
      this.slider.setDisabled();
    }

    this.imageX = (this.containerDim.width * (1 - this.imageZoom)) / 2 - centerX * this.imageZoom;
    this.imageY = (this.containerDim.height * (1 - this.imageZoom)) / 2 - centerY * this.imageZoom;

    this.contain(this.imageX, this.imageY, this.draggable);

    return true;
  },

  startZoomIn() {
    if (!this.slider.disabled) {
      this.zoomBtnPressed = true;
      this.sliderAccel = 0.002;
      this.periodicalZoom();
      this.zoomer = new PeriodicalExecuter(this.periodicalZoom.bind(this), 0.05);
    }
    return this;
  },

  startZoomOut() {
    if (!this.slider.disabled) {
      this.zoomBtnPressed = true;
      this.sliderAccel = -0.002;
      this.periodicalZoom();
      this.zoomer = new PeriodicalExecuter(this.periodicalZoom.bind(this), 0.05);
    }
    return this;
  },

  stopZooming() {
    if (!this.zoomer || this.sliderSpeed == 0) {
      return;
    }
    this.zoomBtnPressed = false;
    this.sliderAccel = 0;
  },

  periodicalZoom() {
    if (!this.zoomer) {
      return this;
    }

    if (this.zoomBtnPressed) {
      this.sliderSpeed += this.sliderAccel;
    } else {
      this.sliderSpeed /= 1.5;
      if (Math.abs(this.sliderSpeed) < 0.001) {
        this.sliderSpeed = 0;
        this.zoomer.stop();
        this.zoomer = null;
      }
    }
    this.slider.value += this.sliderSpeed;

    this.slider.setValue(this.slider.value);
    this.scale(this.slider.value);

    return this;
  },

  contain(x, y, draggable) {
    const dim = Element.getDimensions(draggable.element);

    const xMin = 0;

    const xMax = this.containerDim.width - dim.width;
    const yMin = 0;

    const yMax = this.containerDim.height - dim.height;

    x = x > xMin ? xMin : x;
    x = x < xMax ? xMax : x;
    y = y > yMin ? yMin : y;
    y = y < yMax ? yMax : y;

    if (this.containerDim.width > dim.width) {
      x = this.containerDim.width / 2 - dim.width / 2;
    }

    if (this.containerDim.height > dim.height) {
      y = this.containerDim.height / 2 - dim.height / 2;
    }

    this.imageX = x;
    this.imageY = y;

    this.imageEl.style.left = `${this.imageX}px`;
    this.imageEl.style.top = `${this.imageY}px`;

    return [x, y];
  }
};

/** ************************** CONFIGURABLE PRODUCT ************************* */
Product.Config = Class.create();
Product.Config.prototype = {
  initialize(config) {
    this.config = config;
    this.taxConfig = this.config.taxConfig;
    this.settings = $$('.super-attribute-select');
    this.state = new Hash();
    this.priceTemplate = new Template(this.config.template);
    this.prices = config.prices;

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

    // Set default values - from config and overwrite them by url values
    if (config.defaultValues) {
      this.values = config.defaultValues;
    }

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
    //      Calculator.updatePrice();
  },

  reloadOptionLabels(element) {
    let selectedPrice;
    if (element.options[element.selectedIndex].config) {
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
    if ($(`old-price-${this.config.productId}`)) {
      let price = parseFloat(this.config.oldPrice);
      for (let i = this.settings.length - 1; i >= 0; i--) {
        const selected = this.settings[i].options[this.settings[i].selectedIndex];
        if (selected.config) {
          const parsedOldPrice = parseFloat(selected.config.oldPrice);
          price += isNaN(parsedOldPrice) ? 0 : parsedOldPrice;
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

/** ************************** SUPER PRODUCTS ******************************* */

Product.Super = {};
Product.Super.Configurable = Class.create();

Product.Super.Configurable.prototype = {
  initialize(container, observeCss, updateUrl, updatePriceUrl, priceContainerId) {
    this.container = $(container);
    this.observeCss = observeCss;
    this.updateUrl = updateUrl;
    this.updatePriceUrl = updatePriceUrl;
    this.priceContainerId = priceContainerId;
    this.registerObservers();
  },
  registerObservers() {
    const elements = this.container.getElementsByClassName(this.observeCss);
    elements.each(element => {
      Event.observe(element, 'change', this.update.bindAsEventListener(this));
    });
    return this;
  },
  update(event) {
    const elements = this.container.getElementsByClassName(this.observeCss);
    const parameters = Form.serializeElements(elements, true);

    new Ajax.Updater(this.container, `${this.updateUrl}?ajax=1`, {
      parameters,
      onComplete: this.registerObservers.bind(this)
    });
    const priceContainer = $(this.priceContainerId);
    if (priceContainer) {
      new Ajax.Updater(priceContainer, `${this.updatePriceUrl}?ajax=1`, {
        parameters
      });
    }
  }
};

/** ************************** PRICE RELOADER ******************************* */
Product.OptionsPrice = Class.create();
Product.OptionsPrice.prototype = {
  initialize(config) {
    this.productId = config.productId;
    this.priceFormat = config.priceFormat;
    this.includeTax = config.includeTax;
    this.defaultTax = config.defaultTax;
    this.currentTax = config.currentTax;
    this.productPrice = config.productPrice;
    this.showIncludeTax = config.showIncludeTax;
    this.showBothPrices = config.showBothPrices;
    this.productOldPrice = config.productOldPrice;
    this.priceInclTax = config.priceInclTax;
    this.priceExclTax = config.priceExclTax;
    this.skipCalculate = config.skipCalculate; /** @deprecated after 1.5.1.0 */
    this.duplicateIdSuffix = config.idSuffix;
    this.specialTaxPrice = config.specialTaxPrice;
    this.tierPrices = config.tierPrices;
    this.tierPricesInclTax = config.tierPricesInclTax;

    this.oldPlusDisposition = config.oldPlusDisposition;
    this.plusDisposition = config.plusDisposition;
    this.plusDispositionTax = config.plusDispositionTax;

    this.oldMinusDisposition = config.oldMinusDisposition;
    this.minusDisposition = config.minusDisposition;

    this.exclDisposition = config.exclDisposition;

    this.optionPrices = {};
    this.customPrices = {};
    this.containers = {};

    this.displayZeroPrice = true;

    this.initPrices();
  },

  setDuplicateIdSuffix(idSuffix) {
    this.duplicateIdSuffix = idSuffix;
  },

  initPrices() {
    this.containers[0] = `product-price-${this.productId}`;
    this.containers[1] = `bundle-price-${this.productId}`;
    this.containers[2] = `price-including-tax-${this.productId}`;
    this.containers[3] = `price-excluding-tax-${this.productId}`;
    this.containers[4] = `old-price-${this.productId}`;
  },

  changePrice(key, price) {
    this.optionPrices[key] = price;
  },

  addCustomPrices(key, price) {
    this.customPrices[key] = price;
  },
  getOptionPrices() {
    let price = 0;
    let nonTaxable = 0;
    let oldPrice = 0;
    let priceInclTax = 0;
    const currentTax = this.currentTax;
    $H(this.optionPrices).each(pair => {
      if (typeof pair.value.price !== 'undefined' && typeof pair.value.oldPrice !== 'undefined') {
        price += parseFloat(pair.value.price);
        oldPrice += parseFloat(pair.value.oldPrice);
      } else if (pair.key == 'nontaxable') {
        nonTaxable = pair.value;
      } else if (pair.key == 'priceInclTax') {
        priceInclTax += pair.value;
      } else if (pair.key == 'optionsPriceInclTax') {
        priceInclTax += (pair.value * (100 + currentTax)) / 100;
      } else {
        price += parseFloat(pair.value);
        oldPrice += parseFloat(pair.value);
      }
    });
    const result = [price, nonTaxable, oldPrice, priceInclTax];
    return result;
  },

  reload() {
    let price;
    let formattedPrice;
    let optionPrices = this.getOptionPrices();
    const nonTaxable = optionPrices[1];
    const optionOldPrice = optionPrices[2];
    const priceInclTax = optionPrices[3];
    optionPrices = optionPrices[0];

    $H(this.containers).each(pair => {
      let _productPrice;
      let _plusDisposition;
      let _minusDisposition;
      let _priceInclTax;
      if ($(pair.value)) {
        if (pair.value == `old-price-${this.productId}` && this.productOldPrice != this.productPrice) {
          _productPrice = this.productOldPrice;
          _plusDisposition = this.oldPlusDisposition;
          _minusDisposition = this.oldMinusDisposition;
        } else {
          _productPrice = this.productPrice;
          _plusDisposition = this.plusDisposition;
          _minusDisposition = this.minusDisposition;
        }
        _priceInclTax = priceInclTax;

        if (pair.value == `old-price-${this.productId}` && optionOldPrice !== undefined) {
          price = optionOldPrice + parseFloat(_productPrice);
        } else if (
          this.specialTaxPrice == 'true' &&
          this.priceInclTax !== undefined &&
          this.priceExclTax !== undefined
        ) {
          price = optionPrices + parseFloat(this.priceExclTax);
          _priceInclTax += this.priceInclTax;
        } else {
          price = optionPrices + parseFloat(_productPrice);
          _priceInclTax += (parseFloat(_productPrice) * (100 + this.currentTax)) / 100;
        }

        if (this.specialTaxPrice == 'true') {
          var excl = price;
          var incl = _priceInclTax;
        } else if (this.includeTax == 'true') {
          // tax = tax included into product price by admin
          var tax = (price / (100 + this.defaultTax)) * this.defaultTax;
          var excl = price - tax;
          var incl = excl * (1 + this.currentTax / 100);
        } else {
          var tax = price * (this.currentTax / 100);
          var excl = price;
          var incl = excl + tax;
        }

        let subPrice = 0;
        let subPriceincludeTax = 0;
        Object.values(this.customPrices).each(el => {
          if (el.excludeTax && el.includeTax) {
            subPrice += parseFloat(el.excludeTax);
            subPriceincludeTax += parseFloat(el.includeTax);
          } else {
            subPrice += parseFloat(el.price);
            subPriceincludeTax += parseFloat(el.price);
          }
        });
        excl += subPrice;
        incl += subPriceincludeTax;

        if (typeof this.exclDisposition === 'undefined') {
          excl += parseFloat(_plusDisposition);
        }

        incl += parseFloat(_plusDisposition) + parseFloat(this.plusDispositionTax);
        excl -= parseFloat(_minusDisposition);
        incl -= parseFloat(_minusDisposition);

        // adding nontaxlable part of options
        excl += parseFloat(nonTaxable);
        incl += parseFloat(nonTaxable);

        if (pair.value == `price-including-tax-${this.productId}`) {
          price = incl;
        } else if (pair.value == `price-excluding-tax-${this.productId}`) {
          price = excl;
        } else if (pair.value == `old-price-${this.productId}`) {
          if (this.showIncludeTax || this.showBothPrices) {
            price = incl;
          } else {
            price = excl;
          }
        } else if (this.showIncludeTax) {
          price = incl;
        } else {
          price = excl;
        }

        if (price < 0) price = 0;

        if (price > 0 || this.displayZeroPrice) {
          formattedPrice = this.formatPrice(price);
        } else {
          formattedPrice = '';
        }

        if ($(pair.value).select('.price')[0]) {
          $(pair.value).select('.price')[0].innerHTML = formattedPrice;
          if ($(pair.value + this.duplicateIdSuffix) && $(pair.value + this.duplicateIdSuffix).select('.price')[0]) {
            $(pair.value + this.duplicateIdSuffix).select('.price')[0].innerHTML = formattedPrice;
          }
        } else {
          $(pair.value).innerHTML = formattedPrice;
          if ($(pair.value + this.duplicateIdSuffix)) {
            $(pair.value + this.duplicateIdSuffix).innerHTML = formattedPrice;
          }
        }
      }
    });

    if (typeof skipTierPricePercentUpdate === 'undefined' && typeof this.tierPrices !== 'undefined') {
      for (var i = 0; i < this.tierPrices.length; i++) {
        $$('.benefit').each(function(el) {
          const parsePrice = function(html) {
            const format = this.priceFormat;
            const decimalSymbol = format.decimalSymbol === undefined ? ',' : format.decimalSymbol;
            const regexStr = `[^0-9-${decimalSymbol}]`;
            // remove all characters except number and decimal symbol
            html = html.replace(new RegExp(regexStr, 'g'), '');
            html = html.replace(decimalSymbol, '.');
            return parseFloat(html);
          }.bind(this);

          const updateTierPriceInfo = function(priceEl, tierPriceDiff, tierPriceEl, benefitEl) {
            if (typeof tierPriceEl === 'undefined') {
              // tierPrice is not shown, e.g., MAP, no need to update the tier price info
              return;
            }
            const price = parsePrice(priceEl.innerHTML);
            const tierPrice = price + tierPriceDiff;

            tierPriceEl.innerHTML = this.formatPrice(tierPrice);

            const $percent = Selector.findChildElements(benefitEl, [`.percent.tier-${i}`]);
            $percent.each(el => {
              el.innerHTML = Math.ceil(100 - (100 / price) * tierPrice);
            });
          }.bind(this);

          const tierPriceElArray = $$(`.tier-price.tier-${i} .price`);
          if (this.showBothPrices) {
            const containerExclTax = $(this.containers[3]);
            var tierPriceExclTaxDiff = this.tierPrices[i];
            var tierPriceExclTaxEl = tierPriceElArray[0];
            updateTierPriceInfo(containerExclTax, tierPriceExclTaxDiff, tierPriceExclTaxEl, el);
            const containerInclTax = $(this.containers[2]);
            var tierPriceInclTaxDiff = this.tierPricesInclTax[i];
            var tierPriceInclTaxEl = tierPriceElArray[1];
            updateTierPriceInfo(containerInclTax, tierPriceInclTaxDiff, tierPriceInclTaxEl, el);
          } else if (this.showIncludeTax) {
            var container = $(this.containers[0]);
            var tierPriceInclTaxDiff = this.tierPricesInclTax[i];
            var tierPriceInclTaxEl = tierPriceElArray[0];
            updateTierPriceInfo(container, tierPriceInclTaxDiff, tierPriceInclTaxEl, el);
          } else {
            var container = $(this.containers[0]);
            var tierPriceExclTaxDiff = this.tierPrices[i];
            var tierPriceExclTaxEl = tierPriceElArray[0];
            updateTierPriceInfo(container, tierPriceExclTaxDiff, tierPriceExclTaxEl, el);
          }
        }, this);
      }
    }
  },
  formatPrice(price) {
    return formatCurrency(price, this.priceFormat);
  }
};
