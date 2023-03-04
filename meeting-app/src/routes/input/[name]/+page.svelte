<script>
  import Calendar from "./calendar.svelte";
  import { getAvailability } from "../../stores/groupStore.js";

  let innerWidth = 0;
  let innerHeight = 0;
  /** @type {import('./$types').PageData} */
  export let data;
  console.log("DATA" + data)
  let test = 0;
</script>


<h2>Hey, {data.name}!</h2>

<Calendar username={data.name} priorAvailability={getAvailability(data.name)}/>


