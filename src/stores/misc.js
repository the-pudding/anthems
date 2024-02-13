import { writable } from "svelte/store";

export const loaded = writable(false);
export const entered = writable(false);
export const inTitle = writable(true);
export const inIntro = writable(false);
export const locked = writable(true);

export const currentSlideI = writable(0);
export const currentPhraseI = writable(0);
export const currentStepI = writable(0);

export const soundOn = writable(true);
export const userMuted = writable(false);
export const playing = writable(undefined);
export const currentTime = writable(undefined);
export const audioCanPlay = writable(false);

export const ios = writable(false);
