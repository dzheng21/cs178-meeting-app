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

<h2>Output</h2>

<Calendar input={false} username={null} priorAvailability={null} />

<div class="footer-spacer"></div>
  <div class="footer">
    <button on:click={backToHome}>Back to Home</button>
  </div>
<style>
  button {
    font-size: 18px;
    padding: 15px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 20px;
  }

  h2 {
    font-size: 40px;
    text-align: center;
    color: #2c3e50;
    font-weight: 700;
    margin-top: 5vh;
  }

  /* FOOTER STYLES */
  .footer {
    width: 100%;
    text-align: center;
    background: #ecf0f1D9;
    position: fixed;
    bottom: 0;
    padding: 25px;
    border-top: 2px solid #bdc3c7;
    backdrop-filter: blur(15px) brightness(200%);
    z-index: 100;
  }

  .footer-spacer {
    width: 100%;
    height: 180px;
  }
</style>