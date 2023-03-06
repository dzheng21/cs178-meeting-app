<script>
  import Calendar from "../../calendar.svelte";
  import { getAvailability } from "../../stores/groupStore.js";

  let innerWidth = 0;
  let innerHeight = 0;
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<Calendar
  username={data.name}
  priorAvailability={getAvailability(data.name)}
  input={true}
/>
