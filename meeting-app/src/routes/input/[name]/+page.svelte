<script>
  import Calendar from "../../calendar.svelte";
  import { getAvailability } from "../../stores/groupStore.js";

  let innerWidth = 0;
  let innerHeight = 0;
  /** @type {import('./$types').PageData} */
  export let data;
  console.log("DATA" + data)
  let test = 0;
</script>


<h2>Hey, <span class="name">{data.name}!</span></h2>

<Calendar username={data.name} priorAvailability={getAvailability(data.name)} input={true}/>

<style>
  h2 {
    font-size: 40px;
    text-align: center;
    color: #2c3e50;
    font-weight: 700;
    margin-top: 5vh;
  }

  .name {
    color: #1abc9c;
    font-weight: 900;
  }
</style>