import 'custom-event-polyfill';
import touchevents from './detectTouch';
import './resizeHandler';
import './vh';

export const HTML = document.documentElement;
export const BODY = document.body;
export const BREAKPOINTS = {
  xs: 0,
  phone: 600,
  tablet: 768,
  desktop: 960,
  laptop: 1280,
  widescreen: 1440,
};

/* 
  Breakpoints utility function
  @params: point - {number} - breakpoint to check, e.g. BREAKPOINTS.tablet
  @params: desktopFirst - {boolean} - if you need desktop first

  @return: boolean

  Usage

  import 2 itilities 
  import {BREAKPOINTS, breakpoint} from 'Utils/global';

  window.addEventListener('resize', () => {
    if (breakpoint(BREAKPOINTS.desktop)) {
      console.log('IS DESKTOP')
    } else {
      console.log('IS MOBILE')
    }
  })
*/ 
export const breakpoint = (point, desktopFirst = false) => {
  if (desktopFirst) {
    return window.innerWidth < point;
  }

  return window.innerWidth >= point;
};

/* 
  Detect touchevents
  @params: {obj} - window
  @return: boolean
*/
export const isTouch = (obj = window) => touchevents(obj);

/* 
  "jQuery like" ready function:
  Usage:

  import ready from 'Utils/global';
  ready(() => init());
*/

export default Document.prototype.ready = fn => {
  if (fn && typeof fn === 'function') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        return fn();
      }
    });
  }
};


/*
  Utility function for native wrap:
  @params: el - NodeElement - element that we need to wrap
  @params: wrapper - NodeElement - parent for element to wrap

  @return: void;
*/
export const wrap = (el, wrapper) => {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
};

/*
  Utility function for native wrap of nodeList:
  @params: nodes - NodeList[] - an array of elements to wrap
  @params: wrapper - NodeElement - parent for nodes to wrap

  @return: void;
*/

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

/*
  Publish custom event
  Params:

  {eventName}: String - the name of custom event. Better to use as a variable or constant not to mess names
  {data}: Object - custom event information, e.g. node element, whatever. Accessible via event
  {once}: Bool - trigger only once or every time when called
  Exmaple:

  import {ev} from 'Utils/global';

  const eventName = 'PopupToggle';

  popup.on('click', () => {
    ev(eventName, {
      popup: this,
    })
  })

  document.addEventListener(eventName, event => {
    // this is data that we pass into custom event
    const eventData = event.detail;
    const popupInstance = eventData.popup;
  })
*/

export const ev = (eventName, data, target = document) => {
  const e = new CustomEvent(eventName, {detail: data});
  target.dispatchEvent(e);
};
