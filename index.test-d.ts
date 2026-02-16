import {expectType} from 'tsd';
import {
	disposableTimer,
	disposableInterval,
	disposableListener,
	disposableCallback,
	type Disposable,
} from './index.js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
expectType<Disposable>(disposableTimer(() => {}, 1000));
// eslint-disable-next-line @typescript-eslint/no-empty-function
expectType<Disposable>(disposableInterval(() => {}, 500));
expectType<Disposable>(disposableCallback(() => () => {})); // eslint-disable-line @typescript-eslint/no-empty-function

// Disposable has Symbol.dispose
// eslint-disable-next-line @typescript-eslint/no-empty-function
const timer = disposableTimer(() => {}, 100);
expectType<() => void>(timer[Symbol.dispose]);

// DisposableListener with EventTarget
const target = new EventTarget();
// eslint-disable-next-line @typescript-eslint/no-empty-function
expectType<Disposable>(disposableListener(target, 'click', () => {}));
// eslint-disable-next-line @typescript-eslint/no-empty-function
expectType<Disposable>(disposableListener(target, 'click', () => {}, {once: true}));
