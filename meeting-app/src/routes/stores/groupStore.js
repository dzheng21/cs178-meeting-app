import { get, writable } from 'svelte/store';

const groupStoreInit = () => {
    // create a 7 x 96 x 6 array of empty sets using loops
    const gs = new Array(7);
    for (let i = 0; i < 7; i++) {
        gs[i] = new Array(96);
    }
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 96; j++) {
            gs[i][j] = new Array(6);
        }
    }
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 96; j++) {
            for (let k = 0; k < 6; k++) {
                gs[i][j][k] = new Set();
            }
        }
    }
    return gs;
};

// Stores availability data for the entire group
// Format: groupStore[day][block][location] = Set of names
// Example: groupStore[0][0][0] = Set of names of people who are available on Monday, 8:00-8:15, and in location 0
// There are 7 days, 96 blocks, and 6 possible locations/states for each individual

// export const groupStore = writable(Array(7).fill(Array(96).fill(Array(6).fill([]))));
export const groupStore = writable(groupStoreInit());

export let userAvailabilityDict = {};
export let maxAvailableInPerson = 0;
export let maxAvailableVirtual = 0;

// Update method for groupStore
export const updateStore = (name, availabilityStore) => {
    userAvailabilityDict[name] = availabilityStore;
    groupStore.update((gs) => {
        const blocksFilled = Object.keys(availabilityStore);
        blocksFilled.forEach((k) => {
            const day = parseInt(k[0]);
            const block = parseInt(k.slice(2));
            const key = day + "_" + block;

            // TODO: Change const location = 0 hardcoding to true location/state value [integer]
            const location = availabilityStore[key];
            
            gs[day][block][location].add(name);

            if(gs[day][block][0].size > maxAvailableVirtual) {
                maxAvailableVirtual = gs[day][block][0].size
            }
            let availableInPerson = 0;
            
            for(let i = 1; i < 5; i++) {
                availableInPerson += gs[day][block][i].size;
            }
            if(availableInPerson > maxAvailableInPerson) {
                availableInPerson = maxAvailableInPerson;
            }
        });
        return gs;
    });
    console.log("Updated groupStore: ", name, get(groupStore));
}

export const getAvailability = (name) => {
    return userAvailabilityDict[name];
}
