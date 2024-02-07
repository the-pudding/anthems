import { writable } from "svelte/store";

export const loaded = writable(false);
export const entered = writable(false);
export const inTitle = writable(true);
export const inIntro = writable(true);
export const locked = writable(true);

export const currentSlideI = writable(0);
export const currentPhraseI = writable(0);
export const currentStepI = writable(0);

export const soundOn = writable(true);
export const playing = writable(undefined); // {id, phrase}
export const currentTime = writable(undefined);
