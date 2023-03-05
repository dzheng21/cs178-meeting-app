<script>
  import { get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { Grid, Column, Row, Button } from "carbon-components-svelte";
  import { groupStore } from "../stores/groupStore.js";
  import Calendar from "../calendar.svelte";

  const data = get(groupStore);
  console.log("Data currently is:", data);

  const backToHome = () => {
    goto("/");
  };
</script>

<Calendar input={false} username={null} priorAvailability={data} />

<Button on:click={backToHome}>Back to home</Button>
