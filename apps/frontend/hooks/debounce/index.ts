import { DependencyList, EffectCallback, useEffect } from "react";

const debounce = (cb: (...args: unknown[]) => unknown, delay = 250) => {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: unknown[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			cb(...args);
		}, delay);
	};
};

const useDebounce = (
	effect: EffectCallback,
	deps: DependencyList,
	delay: number
) => {
	useEffect(debounce(effect, delay), deps);
};

export default useDebounce;
