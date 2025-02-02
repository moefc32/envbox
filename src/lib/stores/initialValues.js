import { writable } from 'svelte/store';

export const initialValues = writable({
    title: '',
    content: '',
});
