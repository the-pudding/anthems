import { writable } from "svelte/store";

export const soundOn = writable(true);
export const ready = writable(true);

export const currentPhraseI = writable(0);
export const currentStepI = writable(0);

export const playing = writable(undefined); // {id, phrase}
export const currentTime = writable(undefined);

export const locked = writable(true);
