import { expectType } from "tsd";
import {
  type Disposable,
  disposableCallback,
  disposableInterval,
  disposableListener,
  disposableTimer,
} from "./index.js";

const noop = () => {
  // Type-only callback.
};

expectType<Disposable>(disposableTimer(noop, 1000));
expectType<Disposable>(disposableInterval(noop, 500));
expectType<Disposable>(disposableCallback(() => noop));

// Disposable has Symbol.dispose
const timer = disposableTimer(noop, 100);
expectType<() => void>(timer[Symbol.dispose]);

// DisposableListener with EventTarget
const target = new EventTarget();
expectType<Disposable>(disposableListener(target, "click", noop));
expectType<Disposable>(
  disposableListener(target, "click", noop, { once: true })
);
