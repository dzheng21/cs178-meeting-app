import { get, writable } from 'svelte/store';

// Stores availability data for the entire group
// Format: groupStore[day][block][location] = Set of names
// Example: groupStore[0][0][0] = Set of names of people who are available on Monday, 8:00-8:15, and in location 0
// There are 7 days, 96 blocks, and 6 possible locations/states for each individual
export const groupStore = writable(Array(7).fill(Array(96).fill(Array(6).fill(new Set()))));
export let userAvailabilityDict = {};
export let maxAvailableInPerson = 0;
export let maxAvailableVirtual = 0;

// Update method for groupStore
export const updateStore = (name, availabilityStore) => {
    // console.log("something", typeof availabilityStore);
    // console.log("asdasdf", Object.keys(availabilityStore))
    // console.log(availabilityStore)
    console.log("what", get(groupStore), " asdf ");
    userAvailabilityDict[name] = availabilityStore;
    groupStore.update((gs) => {
        console.log(gs);
        const blocksFilled = Object.keys(availabilityStore);
        blocksFilled.forEach((k) => {
            console.log("k: ", k)
            const day = parseInt(k[0]);
            const block = parseInt(k.slice(2));
            // const location = availabilityStore[k];
            const location = 0;
            console.log('day, block, location: ', day, block, location);
            if (gs[day][block][location] !== undefined) {
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
            }
        });
        console.log("Updated groupStore: ", name, groupStore);
        return gs;
    });  
}

export const getAvailability = (name) => {
    return userAvailabilityDict[name];
}
