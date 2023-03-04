import { writable } from 'svelte/store';

// Stores availability data for the entire group
// Format: groupStore[day][block][location] = Set of names
// Example: groupStore[0][0][0] = Set of names of people who are available on Monday, 8:00-8:15, and in location 0
// There are 7 days, 96 blocks, and 6 possible locations/states for each individual
export const groupStore = writable(() => {
    days = new Array(7);
    for (d in days) {
        d = new Array(96);
        for (b in blocks) {
            // Stores all the 6 possible states of each person, as defined in constants.js
            b = new Array(6);
            for (states in b) {
                states = new Set();
            }
        }
    }
});

// Update method for groupStore
export const updateStore = (name, availabilityStore) => {
    groupStore.update(() => {
        for (k in availabilityStore.keys()) {
            day = parseInt(k[0]);
            block = parseInt(k.slice(2));
            location = availabilityStore.get(k);
            groupStore[day][block][location].add(name);
        }
        return groupStore;
    });   
}
