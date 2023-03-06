<script>
  import { goto } from "$app/navigation";
  import { updateStore } from "../../stores/groupStore.js";
  import { Button } from "carbon-components-svelte";

  function submitAvailability(username, availability) {
    // Timer (end and save)

    // Update store with values for each section
    updateStore(username, availability);
    console.log("Submit completed", username, availability);

    // Redirect to main page
    goto("/");
  }

  export let availability = {};
  export let username = "";
</script>

<div style="margin-top: 15px; margin-right: auto; margin-left: auto;">
  <button on:click={submitAvailability(username, availability)}>
    Submit Availability
  </button>
</div>

<style>
  button {
    font-size: 18px;
    padding: 15px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 20px;
  }

  .legend {
    text-align: center;
    margin: 0 auto;
    margin-top: 25px;
    padding: 20px 25px;
    background: white;
    display: inline-block;
    border-radius: 20px;
    border: 2px solid #ecf0f1;
    box-shadow: 0px 0 12px #00000014;
    color: #2c3e50;
  }

  .legend span {
    display: inline;

    line-height: 15px;
  }

  .legend span:not(:last-child) {
    margin-right: 20px;
  }

  .legend div {
    width: 15px;
    height: 15px;
    display: inline-block;
    border-radius: 4px;
    margin-right: 2px;
  }

  .inPersonColor {
    background: #2ecc71;
    box-shadow: rgb(50 217 119 / 50%) 0px 0px 5px 0px;
  }
</style>
