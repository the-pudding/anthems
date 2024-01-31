import { writable } from "svelte/store";

export const currentPhraseI = writable(0);
export const currentStepI = writable(0);

export const playing = writable(undefined); // {id, phrase}
export const currentTime = writable(undefined);
