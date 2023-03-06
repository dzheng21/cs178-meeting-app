<script>
  import { get } from "svelte/store";
  import { groupStore } from "../stores/groupStore.js";
  import Calendar from "../calendar.svelte";

  const data = get(groupStore);

  const backToHome = () => {
    goto("/");
  };
</script>

<Calendar input={false} username={null} priorAvailability={null} />
