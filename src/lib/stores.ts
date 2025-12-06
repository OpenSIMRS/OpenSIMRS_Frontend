import { writable } from "svelte/store";
import type { GetAuthMe } from "$lib/types";

export const TitlePageStore = writable<string>('');

export const UserDataStore = writable<GetAuthMe | null>(null);