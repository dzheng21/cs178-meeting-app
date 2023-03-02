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
  <Grid>
    <Row>
      <Column>
        <h1>Welcome to MeetHunter</h1>
        <h4>Please enter your name below to start.</h4>
        <br />
        <InputForm bind:username bind:submitted />
      </Column>
    </Row>
    <Row>
      <Column>
        <Button
          kind="secondary"
          type="submit"
          onclick="location.href = '\output'"
        >
          View Results
        </Button>
      </Column>
    </Row>
  </Grid>
</Content>
