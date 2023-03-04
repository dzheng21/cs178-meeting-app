<script>
  import { goto } from "$app/navigation";

  export let username = "";
  export let submitted = false;

  const handleSubmit = () => {
    console.log(username);
    submitted = true;
  };
</script>

<form on:submit={(e) => {
  e.preventDefault();
  console.log("submit", e);
  handleSubmit();
  goto("/input/" + username);
}}>
  <input bind:value={username}
  placeholder="Enter a username..."
  required />
  <button type="submit">Enter</button>
</form>

<style>
  input {
    background: white;
    border: 2px solid #bdc3c7;
    padding: 14px;
    border-radius: 16px;
    font-size: 16px;
    color: #2c3e50;
    display: block;
    margin: 0 auto;
    margin-bottom: 15px;
    transition: all 0.15s ease-out;
    height: 50px;
    width: 60%;
  }

  @media (max-width: 400px) {
    input {
      width: 75%;
    }
  }

  input:focus, input:focus-visible {
    border: 2px solid #1abc9c;
    outline: none;
    box-shadow: 0 0 10px 3px #32d97733;
  }

  button {
    font-size: 18px;
    margin: 0;
  }
</style>
