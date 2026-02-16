import test from 'ava';
import {
	disposableTimer,
	disposableInterval,
	disposableListener,
	disposableCallback,
} from './index.js';

// DisposableTimer tests

test('disposableTimer creates a disposable', t => {
	const timer = disposableTimer(() => {}, 100_000);
	t.is(typeof timer[Symbol.dispose], 'function');
	timer[Symbol.dispose]();
});

test('disposableTimer clears timeout on dispose', t => {
	let called = false;
	const timer = disposableTimer(() => {
		called = true;
	}, 50);
	timer[Symbol.dispose]();
	return new Promise(resolve => {
		setTimeout(() => {
			t.false(called);
			resolve();
		}, 100);
	});
});

test('disposableTimer calls callback when not disposed', async t => {
	let called = false;
	disposableTimer(() => {
		called = true;
	}, 10);
	await new Promise(resolve => {
		setTimeout(resolve, 50);
	});
	t.true(called);
});

test('disposableTimer is safe to dispose multiple times', t => {
	const timer = disposableTimer(() => {}, 100_000);
	timer[Symbol.dispose]();
	t.notThrows(() => timer[Symbol.dispose]());
});

// DisposableInterval tests

test('disposableInterval creates a disposable', t => {
	const interval = disposableInterval(() => {}, 100_000);
	t.is(typeof interval[Symbol.dispose], 'function');
	interval[Symbol.dispose]();
});

test('disposableInterval clears interval on dispose', t => {
	let count = 0;
	const interval = disposableInterval(() => {
		count++;
	}, 10);

	return new Promise(resolve => {
		setTimeout(() => {
			interval[Symbol.dispose]();
			const countAtDispose = count;
			setTimeout(() => {
				t.is(count, countAtDispose);
				resolve();
			}, 50);
		}, 50);
	});
});

test('disposableInterval is safe to dispose multiple times', t => {
	const interval = disposableInterval(() => {}, 100_000);
	interval[Symbol.dispose]();
	t.notThrows(() => interval[Symbol.dispose]());
});

// DisposableListener tests

test('disposableListener adds a listener', t => {
	const target = new EventTarget();
	let called = false;
	const listener = disposableListener(target, 'test', () => {
		called = true;
	});
	target.dispatchEvent(new Event('test'));
	t.true(called);
	listener[Symbol.dispose]();
});

test('disposableListener removes listener on dispose', t => {
	const target = new EventTarget();
	let count = 0;
	const listener = disposableListener(target, 'test', () => {
		count++;
	});
	target.dispatchEvent(new Event('test'));
	t.is(count, 1);
	listener[Symbol.dispose]();
	target.dispatchEvent(new Event('test'));
	t.is(count, 1);
});

test('disposableListener is safe to dispose multiple times', t => {
	const target = new EventTarget();
	const listener = disposableListener(target, 'test', () => {});
	listener[Symbol.dispose]();
	t.notThrows(() => listener[Symbol.dispose]());
});

test('disposableListener passes options', t => {
	const target = new EventTarget();
	let count = 0;
	const listener = disposableListener(target, 'test', () => {
		count++;
	}, {once: true});
	target.dispatchEvent(new Event('test'));
	target.dispatchEvent(new Event('test'));
	t.is(count, 1);
	listener[Symbol.dispose]();
});

// DisposableCallback tests

test('disposableCallback runs setup immediately', t => {
	let setupRan = false;
	const resource = disposableCallback(() => {
		setupRan = true;
		return () => {};
	});
	t.true(setupRan);
	resource[Symbol.dispose]();
});

test('disposableCallback runs teardown on dispose', t => {
	let tornDown = false;
	const resource = disposableCallback(() => () => {
		tornDown = true;
	});
	t.false(tornDown);
	resource[Symbol.dispose]();
	t.true(tornDown);
});

test('disposableCallback is safe to dispose multiple times', t => {
	let teardownCount = 0;
	const resource = disposableCallback(() => () => {
		teardownCount++;
	});
	resource[Symbol.dispose]();
	resource[Symbol.dispose]();
	t.is(teardownCount, 1);
});

test('disposableCallback teardown is idempotent', t => {
	const calls = [];
	const resource = disposableCallback(() => {
		calls.push('setup');
		return () => {
			calls.push('teardown');
		};
	});
	resource[Symbol.dispose]();
	resource[Symbol.dispose]();
	resource[Symbol.dispose]();
	t.deepEqual(calls, ['setup', 'teardown']);
});

// Symbol.dispose property check

test('all functions return objects with Symbol.dispose', t => {
	const target = new EventTarget();
	const timer = disposableTimer(() => {}, 100_000);
	const interval = disposableInterval(() => {}, 100_000);
	const listener = disposableListener(target, 'test', () => {});
	const callback = disposableCallback(() => () => {});

	for (const disposable of [timer, interval, listener, callback]) {
		t.is(typeof disposable[Symbol.dispose], 'function');
	}

	timer[Symbol.dispose]();
	interval[Symbol.dispose]();
	listener[Symbol.dispose]();
	callback[Symbol.dispose]();
});
