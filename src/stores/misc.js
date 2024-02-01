import { writable } from "svelte/store";

export const soundOn = writable(false);
export const ready = writable(false);

export const currentPhraseI = writable(0);
export const currentStepI = writable(0);

export const playing = writable(undefined); // {id, phrase}
export const currentTime = writable(undefined);
