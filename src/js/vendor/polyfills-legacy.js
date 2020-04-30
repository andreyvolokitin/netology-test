/* eslint-disable */
import 'core-js/es/map';
import 'core-js/es/set';
import 'raf/polyfill';

import 'es6-promise/auto';
import 'es6-object-assign/auto';
import 'whatwg-fetch';
import FastClick from 'fastclick';

import browser from '../util/browser';

if ('addEventListener' in document && !(parseInt(browser.isAndroid, 10) >= 4)) {
  // in android 4.4 FastClick and material ui doesn't play well together
  document.addEventListener(
    'DOMContentLoaded',
    function () {
      FastClick.attach(document.body);
    },
    false
  );
}

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
