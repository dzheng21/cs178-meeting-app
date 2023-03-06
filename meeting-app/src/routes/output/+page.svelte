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

<style>
  button {
    border-radius: 15px;
    background: #3498db;
    border-color: #3498db;
    color: white;
    padding: 10px;
    padding-right: 16px;
    padding-left: 16px;
    transition: all 0.15s ease-out;
    margin-bottom: 15px;
    font-weight: 500;
    box-shadow: #3a9ff2bf 0 12px 15px -12px;
  }

  button:hover {
    cursor: pointer;
    background: #5dade2;
    border-color: #5dade2;
  }

  button:active {
    background: #2c81ba;
    border-color: #2c81ba;
    transform: translateY(2px);
    box-shadow: #3a9ff2bf 0 10px 8px -12px;
    transition: all 0.08s ease-in;
  }
</style>
