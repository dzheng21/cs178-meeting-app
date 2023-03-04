<script>
  import { get } from "svelte/store";
  import { Grid, Column, Row, Button } from "carbon-components-svelte";
  import { groupStore } from "../stores/groupStore.js";

  const data = get(groupStore);
</script>

<Grid>
  <Row>
    <Column>
      <h1>Output</h1>
      {#each data as day}
        <h3>{day.length}</h3>
        <p>{day}</p>
      {/each}
    </Column>
  </Row>
</Grid>

<Button onclick="location.href = '/'">Back to home</Button>
