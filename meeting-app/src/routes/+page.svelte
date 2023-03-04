<script>
  import { Content, Grid, Row, Column, Button } from "carbon-components-svelte";

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

<Content>
  <Grid style="padding-top: 7em;">
    <Row>
      <Column style="text-align: center;">
        <h1>Welcome to MeetHunter</h1>
        <h4>Please enter your name below to start.</h4>
        <div style="height: 3em;" />
        <InputForm bind:username bind:submitted />
      </Column>
    </Row>
    <Row><div style="height: 20em;" /></Row>
    <Row>
      <Column style="text-align: center;">
        <div>
          <Button
            style="background-color: green;"
            kind="secondary"
            type="submit"
            onclick="location.href = '\output'"
          >
            View Results
          </Button>
        </div>
      </Column>
    </Row>
  </Grid>
</Content>
