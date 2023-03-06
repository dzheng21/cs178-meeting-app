import { get, writable } from 'svelte/store';

// Stores times, key = username, values = time in miliseconds

export const timeStore = writable({});

// Update method for groupStore
export const saveToTimeStore = (name, time) => {
    timeStore.update((ts) => {
        ts[name] = time;
        return ts;
    });
    console.log("Updated groupStore: ", name, time, get(timeStore));
}

export const downloadTimeCSV = () => {
    // const csvContent = "data:text/csv;charset=utf-8,";
    const data = get(timeStore);
    const keys = Object.keys(data);
    const values = Object.values(data);
    let csv = '';
    csv += "username,time(ms)\n";
    for(let i = 0; i < keys.length; i++) {
        csv += keys[i] + "," + values[i] + "\n";
    }
    document.write(csv);
    var hiddenElement = document.createElement('a');  
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
    hiddenElement.target = '_blank';  
      
    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'cs178_t2a_times.csv';  
    hiddenElement.click();  
}
