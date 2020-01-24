/* eslint-disable */

import 'custom-event-polyfill';
import './resizeHandler';
import './detectTouch';
import './events';
import './vh';

export const HTML = document.documentElement;
export const BODY = document.body;

// "jQuery like" ready function:
// Usage:
//
// import ready from 'Utils/global';
// ready(() => init());

export default Document.prototype.ready = fn => {
  if (fn && typeof fn === 'function') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        return fn();
      }
    });
  }
};

export const wrap = (el, wrapper) => {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
};

export const unwrap = content => {
  for (let i = 0; i < content.length; i++) {
    const el = content[i];
    const parent = el.parentNode;

    if (parent.parentNode) parent.outerHTML = el.innerHTML;
  }
};

// Wrap wrapper around nodes
// Just pass a collection of nodes, and a wrapper element
export const wrapAll = (nodes, wrapper) => {
  // Cache the current parent and previous sibling of the first node.
  var parent = nodes[0].parentNode;
  var previousSibling = nodes[0].previousSibling;

  // Place each node in wrapper.
  //  - If nodes is an array, we must increment the index we grab from
  //    after each loop.
  //  - If nodes is a NodeList, each node is automatically removed from
  //    the NodeList when it is removed from its parent with appendChild.
  for (var i = 0; nodes.length - i; wrapper.firstChild === nodes[0] && i++) {
    wrapper.appendChild(nodes[i]);
  }

  // Place the wrapper just after the cached previousSibling,
  // or if that is null, just before the first child.
  var nextSibling = previousSibling ? previousSibling.nextSibling : parent.firstChild;
  parent.insertBefore(wrapper, nextSibling);

  return wrapper;
};


// Clamp a value to fit within a specific range
// clamp(variable, 5, 10) => if variable less then 5 - it will take a value of 5, otherwise if more then 10, it will take value of 10
export const clamp = (val, min = 0, max = 1) => Math.max(min, Math.min(max, val));

// Maps a number's relative placement within one range to the equivalent position in another range.
// For example, given the range of 0 to 100, 50 would be halfway between so if it were mapped to a range of // 0 to 500, it would be 250 (because that's halfway between that range).
// Think of it like ratios.
//
// Params:
// {value}: Number - The value that should be mapped (typically it's between inMin and inMax)
// {min1}: Number - The lower bound of the initial range to map from
// {max1}: Number - The upper bound of the initial range to map from
// {min2}: Number - The lower bound of the range to map to
// {max}: Number - The upper bound of the range to map to
//
// Returns: the mapped number
export const map = (value, min1, max1, min2, max2) => min2 + ((max2 - min2) * (value - min1)) / (max1 - min1);


// Return randomly shuffled array
// Params:
// {arr}: Array - array to shuffle
//
// Returns: shuffled array
export const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());


// Publish custom event
// Params:
//
// {eventName}: String - the name of custom event. Better to use as a variable or constant not to mess names
// {data}: Object - custom event information, e.g. node element, whatever. Accessible via event
// {once}: Bool - trigger only once or every time when called
// Exmaple:
//
// import {ev} from 'Utils/global';
//
// const eventName = 'PopupToggle';
//
// popup.on('click', () => {
//    ev(eventName, {
//      popup: this,
//    })
// })
//
// document.addEventListener(eventName, event => {
//   // this is data that we pass into custom event
//   const eventData = event.e.detail;
//   const popupInstance = eventData.popup;
// })
//

export const ev = (eventName, data, target = document, once = false) => {
  const e = new CustomEvent(eventName, {detail: data}, {once});
  target.dispatchEvent(e);
};

// emulate delay, async function
// Params:
// {ms}: Number - value to await (in milliseconds);
// return: Promise
export const delay = ms => new Promise(res => setTimeout(ms, res));
