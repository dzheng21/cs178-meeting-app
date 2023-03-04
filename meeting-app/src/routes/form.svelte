<script>
  import { goto } from "$app/navigation";

  import { FluidForm, TextInput, Button } from "carbon-components-svelte";

  export let username = "";
  export let submitted = false;

  const handleSubmit = () => {
    console.log(username);
    submitted = true;
  };
</script>

<FluidForm
  on:submit={(e) => {
    e.preventDefault();
    console.log("submit", e);
    handleSubmit();
    goto("/input/" + username);
  }}
  style="margin: auto auto; width: 75%;"
>
  <TextInput
    bind:value={username}
    labelText="User name"
    placeholder="Enter user name..."
    required
  />
  <br />
  <div class="buttonBox">
    <Button type="submit">Enter</Button>
  </div>
</FluidForm>

<style>
  .buttonBox {
    display: flex;
    justify-content: center;
  }
</style>
