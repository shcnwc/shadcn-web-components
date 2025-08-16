import * as devalue from "devalue";
import { b as base64_encode, t as text_decoder, c as base64_decode } from "./utils.js";
let request_event = null;
let als;
import("node:async_hooks").then((hooks) => als = new hooks.AsyncLocalStorage()).catch(() => {
});
function getRequestEvent() {
  const event = request_event ?? als?.getStore();
  if (!event) {
    let message = "Can only read the current request event inside functions invoked during `handle`, such as server `load` functions, actions, endpoints, and other server hooks.";
    if (!als) {
      message += " In environments without `AsyncLocalStorage`, the event must be read synchronously, not after an `await`.";
    }
    throw new Error(message);
  }
  return event;
}
function with_event(event, fn) {
  try {
    request_event = event;
    return als ? als.run(event, fn) : fn();
  } finally {
    request_event = null;
  }
}
function validate_depends(route_id, dep) {
  const match = /^(moz-icon|view-source|jar):/.exec(dep);
  if (match) {
    console.warn(
      `${route_id}: Calling \`depends('${dep}')\` will throw an error in Firefox because \`${match[1]}\` is a special URI scheme`
    );
  }
}
const INVALIDATED_PARAM = "x-sveltekit-invalidated";
const TRAILING_SLASH_PARAM = "x-sveltekit-trailing-slash";
function stringify(data, transport) {
  const encoders = Object.fromEntries(Object.entries(transport).map(([k, v]) => [k, v.encode]));
  return devalue.stringify(data, encoders);
}
function stringify_remote_arg(value, transport) {
  if (value === void 0) return "";
  const json_string = stringify(value, transport);
  const bytes = new TextEncoder().encode(json_string);
  return base64_encode(bytes).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}
function parse_remote_arg(string, transport) {
  if (!string) return void 0;
  const json_string = text_decoder.decode(
    // no need to add back `=` characters, atob can handle it
    base64_decode(string.replaceAll("-", "+").replaceAll("_", "/"))
  );
  const decoders = Object.fromEntries(Object.entries(transport).map(([k, v]) => [k, v.decode]));
  return devalue.parse(json_string, decoders);
}
function create_remote_cache_key(id, payload) {
  return id + "/" + payload;
}
const EVENT_STATE = Symbol("remote");
function create_event_state(state, options) {
  return {
    prerendering: state.prerendering,
    transport: options.hooks.transport,
    handleValidationError: options.hooks.handleValidationError
  };
}
function get_event_state(event) {
  return event[EVENT_STATE];
}
export {
  EVENT_STATE as E,
  INVALIDATED_PARAM as I,
  TRAILING_SLASH_PARAM as T,
  getRequestEvent as a,
  create_remote_cache_key as b,
  create_event_state as c,
  stringify_remote_arg as d,
  get_event_state as g,
  parse_remote_arg as p,
  stringify as s,
  validate_depends as v,
  with_event as w
};
