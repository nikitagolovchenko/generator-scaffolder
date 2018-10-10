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
 * @category    Mage
 * @package     js
 * @copyright   Copyright (c) 2014 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */
// old school cookie functions grabbed off the web

if (!window.Mage) var Mage = {};

Mage.Cookies = {};
Mage.Cookies.expires = null;
Mage.Cookies.path = '/';
Mage.Cookies.domain = null;
Mage.Cookies.secure = false;
Mage.Cookies.set = function(name, value) {
  const argv = arguments;
  const argc = arguments.length;
  const expires = argc > 2 ? argv[2] : Mage.Cookies.expires;
  const path = argc > 3 ? argv[3] : Mage.Cookies.path;
  const domain = argc > 4 ? argv[4] : Mage.Cookies.domain;
  const secure = argc > 5 ? argv[5] : Mage.Cookies.secure;
  document.cookie = `${name}=${escape(value)}${expires == null ? '' : `; expires=${expires.toGMTString()}`}${
    path == null ? '' : `; path=${path}`
  }${domain == null ? '' : `; domain=${domain}`}${secure == true ? '; secure' : ''}`;
};

Mage.Cookies.get = function(name) {
  const arg = `${name}=`;
  const alen = arg.length;
  const clen = document.cookie.length;
  let i = 0;
  let j = 0;
  while (i < clen) {
    j = i + alen;
    if (document.cookie.substring(i, j) == arg) return Mage.Cookies.getCookieVal(j);
    i = document.cookie.indexOf(' ', i) + 1;
    if (i == 0) break;
  }
  return null;
};

Mage.Cookies.clear = function(name) {
  if (Mage.Cookies.get(name)) {
    document.cookie = `${name}=` + `; expires=Thu, 01-Jan-70 00:00:01 GMT`;
  }
};

Mage.Cookies.getCookieVal = function(offset) {
  let endstr = document.cookie.indexOf(';', offset);
  if (endstr == -1) {
    endstr = document.cookie.length;
  }
  return unescape(document.cookie.substring(offset, endstr));
};
