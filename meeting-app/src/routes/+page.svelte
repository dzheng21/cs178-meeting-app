<script>
  import InputForm from "./form.svelte";

  let username = "";
  let submitted = false;

  const enterAvailability = () => {
    console.log(username);
  };

  const viewResults = () => {
    console.log("Hello working");
  };
</script>

<div class="form-window">
    <h1>Welcome to MeetHunter</h1>
    <h4>Please enter your name below to start.</h4>

    <div style="height: 3em;" />

    <InputForm bind:username bind:submitted />

    <div class="spacer">or</div>
    <div>
        <button kind="secondary" type="submit" onclick="location.href = '\output'">View Results</button>
    </div>
</div>

<style>
    .spacer {
        margin-top: 10px;
        margin-bottom: 14px;
        color: #34495e;
    }

    button {
        font-size: 16px;
        margin: 0;
        background: #1abc9c;
        box-shadow: #32d977bf 0 12px 15px -12px;
    }

    button:hover {
        background: #48c9b0;
    }

    button:active {
        background: #16a085;
        box-shadow: #32d977bf 0 10px 8px -12px;
    }

    h1 {
        font-weight: 700;
        line-height: 1.1;
        margin-bottom: 15px;
        color: #2c3e50;
    }

    h4 {
        font-size: 16px;
        color: #34495e;
    }

    .form-window {
        text-align: center;
        background: #ecf0f1;
        border: 2px solid #bdc3c7;
        padding: 40px;
        border-radius: 50px;
        max-width: 500px;
        width: 90%;
        position: absolute;
        top: 40%;
        transform: translate(-50%, -50%);
        left: 50%;
        box-shadow: 0px 0 12px #00000014;
    }
</style>
