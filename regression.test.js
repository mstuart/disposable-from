import test from "ava";
import { disposableListener } from "./index.js";

test("listener removal keeps the capture value used during registration", (t) => {
  const listeners = new Map();
  const target = {
    addEventListener(_event, listener, options) {
      listeners.set(listener, Boolean(options.capture));
    },
    removeEventListener(_event, listener, options) {
      const capture =
        typeof options === "boolean" ? options : Boolean(options.capture);
      if (listeners.get(listener) === capture) {
        listeners.delete(listener);
      }
    },
  };
  const registrationOptions = { capture: true };
  const callback = () => undefined;
  const disposable = disposableListener(
    target,
    "event",
    callback,
    registrationOptions
  );
  registrationOptions.capture = false;
  disposable[Symbol.dispose]();
  t.false(listeners.has(callback));
});

test("a captured EventTarget listener is removed after its options change", (t) => {
  const target = new EventTarget();
  const options = { capture: true };
  let calls = 0;
  const disposable = disposableListener(
    target,
    "event",
    () => {
      calls += 1;
    },
    options
  );
  options.capture = false;
  disposable[Symbol.dispose]();
  target.dispatchEvent(new Event("event"));
  t.is(calls, 0);
});
