import "clsx";
import { B as BROWSER } from "./false.js";
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var array_from = Array.from;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
const noop = () => {
};
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}
const DERIVED = 1 << 1;
const EFFECT = 1 << 2;
const BLOCK_EFFECT = 1 << 4;
const BRANCH_EFFECT = 1 << 5;
const ROOT_EFFECT = 1 << 6;
const BOUNDARY_EFFECT = 1 << 7;
const UNOWNED = 1 << 8;
const DISCONNECTED = 1 << 9;
const CLEAN = 1 << 10;
const DIRTY = 1 << 11;
const MAYBE_DIRTY = 1 << 12;
const INERT = 1 << 13;
const DESTROYED = 1 << 14;
const EFFECT_RAN = 1 << 15;
const EFFECT_TRANSPARENT = 1 << 16;
const INSPECT_EFFECT = 1 << 17;
const HEAD_EFFECT = 1 << 18;
const EFFECT_PRESERVED = 1 << 19;
const USER_EFFECT = 1 << 20;
const REACTION_IS_UPDATING = 1 << 21;
const ASYNC = 1 << 22;
const ERROR_VALUE = 1 << 23;
const STATE_SYMBOL = Symbol("$state");
const LEGACY_PROPS = Symbol("legacy props");
const STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
const COMMENT_NODE = 8;
function lifecycle_outside_component(name) {
  {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
}
const HYDRATION_START = "[";
const HYDRATION_END = "]";
const HYDRATION_ERROR = {};
const UNINITIALIZED = Symbol();
var current_component = null;
function getContext(key) {
  const context_map = get_or_init_context_map();
  const result = (
    /** @type {T} */
    context_map.get(key)
  );
  return result;
}
function setContext(key, context) {
  get_or_init_context_map().set(key, context);
  return context;
}
function get_or_init_context_map(name) {
  if (current_component === null) {
    lifecycle_outside_component();
  }
  return current_component.c ??= new Map(get_parent_context(current_component) || void 0);
}
function push(fn) {
  current_component = { p: current_component, c: null, d: null };
}
function pop() {
  var component = (
    /** @type {Component} */
    current_component
  );
  var ondestroy = component.d;
  if (ondestroy) {
    on_destroy.push(...ondestroy);
  }
  current_component = component.p;
}
function get_parent_context(component_context) {
  let parent = component_context.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
const BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
class HeadPayload {
  /** @type {Set<{ hash: string; code: string }>} */
  css = /* @__PURE__ */ new Set();
  /** @type {string[]} */
  out = [];
  uid = () => "";
  title = "";
  constructor(css = /* @__PURE__ */ new Set(), out = [], title = "", uid = () => "") {
    this.css = css;
    this.out = out;
    this.title = title;
    this.uid = uid;
  }
}
class Payload {
  /** @type {Set<{ hash: string; code: string }>} */
  css = /* @__PURE__ */ new Set();
  /** @type {string[]} */
  out = [];
  uid = () => "";
  select_value = void 0;
  head = new HeadPayload();
  constructor(id_prefix = "") {
    this.uid = props_id_generator(id_prefix);
    this.head.uid = this.uid;
  }
}
function props_id_generator(prefix) {
  let uid = 1;
  return () => `${prefix}s${uid++}`;
}
function reset_elements() {
  return () => {
  };
}
let controller = null;
function abort() {
  controller?.abort(STALE_REACTION);
  controller = null;
}
let on_destroy = [];
function render(component, options = {}) {
  try {
    const payload = new Payload(options.idPrefix ? options.idPrefix + "-" : "");
    const prev_on_destroy = on_destroy;
    on_destroy = [];
    payload.out.push(BLOCK_OPEN);
    let reset_reset_element;
    if (BROWSER) ;
    if (options.context) {
      push();
      current_component.c = options.context;
    }
    component(payload, options.props ?? {}, {}, {});
    if (options.context) {
      pop();
    }
    if (reset_reset_element) {
      reset_reset_element();
    }
    payload.out.push(BLOCK_CLOSE);
    for (const cleanup of on_destroy) cleanup();
    on_destroy = prev_on_destroy;
    let head = payload.head.out.join("") + payload.head.title;
    for (const { hash, code } of payload.css) {
      head += `<style id="${hash}">${code}</style>`;
    }
    const body = payload.out.join("");
    return {
      head,
      html: body,
      body
    };
  } finally {
    abort();
  }
}
export {
  ASYNC as A,
  BOUNDARY_EFFECT as B,
  CLEAN as C,
  DERIVED as D,
  ERROR_VALUE as E,
  index_of as F,
  COMMENT_NODE as G,
  HYDRATION_ERROR as H,
  INERT as I,
  HYDRATION_START as J,
  HYDRATION_END as K,
  array_from as L,
  MAYBE_DIRTY as M,
  LEGACY_PROPS as N,
  render as O,
  push as P,
  setContext as Q,
  ROOT_EFFECT as R,
  STATE_SYMBOL as S,
  pop as T,
  UNOWNED as U,
  noop as V,
  getContext as W,
  safe_not_equal as X,
  EFFECT_RAN as a,
  EFFECT as b,
  BLOCK_EFFECT as c,
  define_property as d,
  DIRTY as e,
  deferred as f,
  BRANCH_EFFECT as g,
  DESTROYED as h,
  USER_EFFECT as i,
  equals as j,
  INSPECT_EFFECT as k,
  array_prototype as l,
  UNINITIALIZED as m,
  get_descriptor as n,
  object_prototype as o,
  get_prototype_of as p,
  is_array as q,
  run_all as r,
  safe_equals as s,
  is_extensible as t,
  EFFECT_PRESERVED as u,
  HEAD_EFFECT as v,
  EFFECT_TRANSPARENT as w,
  STALE_REACTION as x,
  DISCONNECTED as y,
  REACTION_IS_UPDATING as z
};
