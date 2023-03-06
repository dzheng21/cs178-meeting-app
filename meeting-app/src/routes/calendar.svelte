<script>
  import { onMount } from "svelte";
  import Submitter from "./input/[name]/submitter.svelte";
  import { groupStore, maxAvailableInPerson, maxAvailableVirtual } from "./stores/groupStore.js";
  import { get } from "svelte/store";

  import {
    PossibleLocations,
    AvailabilityEnum,
    LocationColorMap,
    StringToLocationInteger,
    virtualColor,
    inPersonColor,
  } from "./input/[name]/constants.js";

  let innerWidth;
  let innerHeight;
  let mode = "inPerson"
  export let username;
  export let priorAvailability;
  export let input;

  let availabilityStore = {};
  if (priorAvailability != null) {
    availabilityStore = priorAvailability;
  }

  console.log("PRIOR:" + Object.keys(availabilityStore));

  onMount(() => {
    window.addEventListener("resize", resizeEvent);
    colorIn();
    // Auto scrolls to 9am
    document.getElementById("0_35").scrollIntoView();
    responsiveText(innerWidth);
    if (innerWidth <= 640) {
      hourMargin = 5;
    }
  });

  function changeViewMode() {
    mode = document.getElementById("viewMode").options[document.getElementById("viewMode").selectedIndex].value;
    clearColors();
    colorIn();
  }

  function clearColors() {
    for(let i = 0; i < daysOfTheWeek.length; i++) {
      console.log("DAY: " + i)
      for(let j = 0; j < timeArray.length; j++) {
        console.log("TIME: " + j)
        document.getElementById(i + "_" + j).style.background = "none";
      }
    }
  }

  const data = get(groupStore);
  function colorIn() {
    if (input) {
      for (let id in availabilityStore) {
        document.getElementById(id).style.background =
          LocationColorMap[availabilityStore[id]];
      }
    } else {

      // iterate through data with indices
      for (let day = 0; day < data.length; day++) {
        for (let block = 0; block < data[day].length; block++) {
          for (let state = 0; state < data[day][block].length; state++) {
            const set = data[day][block][state];
            if (set.size != 0) {
              // console.log("Set at ", day + "_" + block, "is ", set);
              let id = day + "_" + block;
              if(mode == "inPerson") {
                let opacityIncrement = 1 / maxAvailableInPerson;
                if(state > 0) {
                  document.getElementById(id).style.background = LocationColorMap[state];
                  document.getElementById(id).style.opacity = opacityIncrement * set.size;
                }
              } else {
                let opacityIncrement = 1 / maxAvailableVirtual;
                if(state == 0) {
                  document.getElementById(id).style.background = LocationColorMap[state];
                  document.getElementById(id).style.opacity = opacityIncrement * set.size;
                }
              }
            }
          }
        }
      }
    }
  }

  let hourMargin = 10;

  function resizeEvent() {
    disableSelection();
    responsiveText(innerWidth);

    if (innerWidth <= 640) {
      hourMargin = 5;
    } else {
      hourMargin = 10;
    }
  }

  // Options for date format
  let options = {
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
    // timeZone: "Australia/Sydney",
    // timeZoneName: "short",
  };

  // Date Formatter with options
  let dateFormatter = new Intl.DateTimeFormat("en-US", options);

  // Variables to keep track of selction
  let dragging = false;
  let selecting = true;
  let startID = "";
  let selectionArray = [];

  // UI Colors
  let selectColor = "rgba(26, 188, 156,0.5)";
  let selectBorder = "#1abc9c";
  let deleteColor = "rgba(231, 76, 60,0.5)";
  let deleteBorder = "#e74c3c";
  // const virtualColor = "rgb(52, 152, 219)";
  // const inPersonColor = "rgb(46, 204, 113)";

  // Create an array Dates filled with 15 minute time increments
  let timeArray = new Array();
  for (let i = 0; i < 96; i++) {
    let newDate = new Date(1970, 6, 4, 0, 0, 0, 0);
    newDate.setMinutes(newDate.getMinutes() + 15 * i);

    timeArray.push(newDate);
  }

  // Create a 2D array with rows being hours and columns being dates at 15 minute increments
  let timeArrayHours = new Array();
  let tempArray = new Array();
  for (let i = 0; i < 96; i++) {
    tempArray.push(timeArray[i]);

    if (tempArray.length == 4) {
      timeArrayHours.push(tempArray);
      tempArray = [];
    }
  }

  let daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let daysOfTheWeekShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Called when a time cell is clicked
  function registerStart(e, id) {
    // Hide unecessary elements if they are present
    deleteElement("endTime");
    document.getElementById("tooltip").style.opacity = "0";
    document.getElementById("tooltip").style.transform = "scale(0)";

    dragging = true;
    startID = id;
    selectionArray.push(id);
    selectionArray.push(id);
    // If cell already selected, deselect
    if (
      document.getElementById(id).style.background == virtualColor ||
      document.getElementById(id).style.background == inPersonColor
    ) {
      selecting = false;
    } else {
      selecting = true;
    }

    document.getElementById(id).style.fontSize = "0";

    registerMove(e, id);
  }

  function registerMove(e, id) {
    if (dragging) {
      selectionArray[0] = startID;
      selectionArray[1] = id;

      // If start and end selection are at the same time
      if (
        getTimeCodeFromID(selectionArray[0]) ===
        getTimeCodeFromID(selectionArray[1])
      ) {
        deleteElement("endTime");
        showTime(selectionArray[1], "startTime");
      } else if (selectionArray[0] !== selectionArray[1]) {
        // If
        if (
          parseInt(selectionArray[0].slice(2)) >
          parseInt(selectionArray[1].slice(2))
        ) {
          showTime(selectionArray[1], "startTime");
          showTime(selectionArray[0], "endTime");
        } else {
          showTime(selectionArray[0], "startTime");
          showTime(selectionArray[1], "endTime");
        }
      } else {
        deleteElement("startTime");
        deleteElement("endTime");
      }

      let currentWeek = parseInt(id.charAt(0));
      let startWeek = parseInt(startID.charAt(0));
      if (currentWeek < startWeek) {
        let temp = currentWeek;
        currentWeek = startWeek;
        startWeek = temp;
      }

      let currentTime = parseInt(id.slice(2));
      let startTime = parseInt(startID.slice(2));
      if (currentTime < startTime) {
        let temp = currentTime;
        currentTime = startTime;
        startTime = temp;
      }

      let numberOfGaps = 0;
      for (let i = startTime; i <= currentTime; i++) {
        if (timeArray[i].getMinutes() == 0 && i != 0 && i != startTime) {
          numberOfGaps++;
        }
      }

      let numberOfGapsFromStart = 0;
      for (let i = 0; i <= startTime; i++) {
        if (timeArray[i].getMinutes() == 0 && i != 0) {
          numberOfGapsFromStart++;
        }
      }

      // console.log("START: " + startWeek + "_" + startTime);
      // console.log("END: " + currentWeek + "_" + currentTime);

      let selection = document.getElementById("selection");
      if (innerWidth <= 640) {
        selection.style.left =
          document.getElementById("sidebar").getBoundingClientRect().width +
          0 +
          document.getElementById("Sunday").getBoundingClientRect().width *
            startWeek +
          "px";

        selection.style.top =
          startTime *
            document.getElementById(id).getBoundingClientRect().height +
          numberOfGapsFromStart * hourMargin +
          "px";

        selection.style.width =
          document.getElementById("Sunday").getBoundingClientRect().width *
            (currentWeek - startWeek + 1) -
          0 +
          "px";

        selection.style.height =
          document.getElementById(id).getBoundingClientRect().height *
            (currentTime - startTime + 1) +
          numberOfGaps * hourMargin +
          5 +
          "px";
      } else {
        selection.style.left =
          document.getElementById("sidebar").getBoundingClientRect().width +
          2 +
          document.getElementById("Sunday").getBoundingClientRect().width *
            startWeek +
          "px";

        selection.style.top =
          startTime *
            document.getElementById(id).getBoundingClientRect().height +
          2 +
          numberOfGapsFromStart * hourMargin +
          "px";

        selection.style.width =
          document.getElementById("Sunday").getBoundingClientRect().width *
            (currentWeek - startWeek + 1) -
          4 +
          "px";

        selection.style.height =
          document.getElementById(id).getBoundingClientRect().height *
            (currentTime - startTime + 1) +
          numberOfGaps * hourMargin +
          6 +
          "px";
      }

      selection.style.display = "block";
      if (selecting) {
        selection.style.background = selectColor;
        selection.style.boxShadow = "0 0 10px 3px #32d97733";
        selection.style.border = "2px solid " + selectBorder;
      } else {
        selection.style.background = deleteColor;
        selection.style.boxShadow = "0 0 10px 3px #f2513f40";
        selection.style.border = "2px solid " + deleteBorder;
      }

      document.getElementById("tipText").style.opacity = "1";
      document.getElementById("tipText").style.transform = "scale(1)";
      let newEndTime = new Date();
      newEndTime.setTime(timeArray[currentTime]);
      if (startWeek == currentWeek) {
        document.getElementById("tipText").innerHTML =
          daysOfTheWeek[startWeek] +
          " " +
          dateFormatter.format(timeArray[startTime]) +
          " &#8212; " +
          dateFormatter.format(
            newEndTime.setMinutes(timeArray[currentTime].getMinutes() + 15)
          ) +
          " Selected";
      } else {
        document.getElementById("tipText").innerHTML =
          daysOfTheWeek[startWeek] +
          " " +
          dateFormatter.format(timeArray[startTime]) +
          " &#8212; " +
          daysOfTheWeek[currentWeek] +
          " " +
          dateFormatter.format(
            newEndTime.setMinutes(timeArray[currentTime].getMinutes() + 15)
          ) +
          " Selected";
      }
      if (selecting) {
        document.getElementById("tipText").style.color = "#1abc9c";
      } else {
        document.getElementById("tipText").style.color = "#e74c3c";
      }
    }
  }

  function registerEnd(e) {
    if (selecting && dragging) {
      let currentWeek = parseInt(selectionArray[1].charAt(0));
      let startWeek = parseInt(selectionArray[0].charAt(0));
      if (currentWeek < startWeek) {
        let temp = currentWeek;
        currentWeek = startWeek;
        startWeek = temp;
      }

      let selectionRect = document
        .getElementById("selection")
        .getBoundingClientRect();
      let selectionHeight = document.getElementById("selection").offsetHeight;
      let selectionWidth = document.getElementById("selection").offsetWidth;
      let tooltip = document.getElementById("tooltip");

      if (currentWeek - startWeek > 2) {
        // tooltip.style.display = "block";
        tooltip.style.opacity = "1";
        tooltip.style.transformOrigin = "center center";
        tooltip.style.transform = "scale(1)";

        tooltip.classList.remove("left-tail");
        tooltip.classList.remove("right-tail");
        tooltip.style.left =
          selectionRect.left +
          selectionWidth / 2 -
          tooltip.offsetWidth / 2 +
          "px";
        tooltip.style.top =
          selectionRect.top +
          selectionHeight / 2 -
          tooltip.offsetHeight / 2 +
          "px";
      } else {
        if (currentWeek > 3) {
          tooltip.style.opacity = "1";
          tooltip.style.transformOrigin = "center right";
          tooltip.style.transform = "scale(1)";
          tooltip.classList.add("right-tail");
          tooltip.classList.remove("left-tail");
          tooltip.style.left =
            selectionRect.left - tooltip.offsetWidth - 5 + "px";
          tooltip.style.top =
            selectionRect.top +
            selectionHeight / 2 -
            tooltip.offsetHeight / 2 +
            "px";
        } else {
          tooltip.style.opacity = "1";
          tooltip.style.transformOrigin = "center left";
          tooltip.style.transform = "scale(1)";
          tooltip.classList.add("left-tail");
          tooltip.classList.remove("right-tail");
          tooltip.style.left = selectionRect.left + selectionWidth + 5 + "px";
          tooltip.style.top =
            selectionRect.top +
            selectionHeight / 2 -
            tooltip.offsetHeight / 2 +
            "px";
        }
      }
    } else if (!selecting) {
      confirmSelection(e, "none");
    }

    dragging = false;
  }

  function getTimeCodeFromID(id) {
    return parseInt(id.slice(2));
  }

  function getWeekNumberFromID(id) {
    return parseInt(id.charAt(0));
  }

  // Called when selection is confirmed
  function confirmSelection(e, color) {
    deleteElement("startTime");
    deleteElement("endTime");
    document.getElementById("tipText").style.opacity = "0";
    document.getElementById("tipText").style.transform = "scale(0)";

    let currentWeek = getWeekNumberFromID(selectionArray[1]);
    let startWeek = getWeekNumberFromID(selectionArray[0]);
    if (currentWeek < startWeek) {
      let temp = currentWeek;
      currentWeek = startWeek;
      startWeek = temp;
    }

    let currentTime = getTimeCodeFromID(selectionArray[1]);
    let startTime = getTimeCodeFromID(selectionArray[0]);
    if (currentTime < startTime) {
      let temp = currentTime;
      currentTime = startTime;
      startTime = temp;
    }

    if (document.getElementById("selection").offsetWidth > 0) {
      for (let i = startWeek; i <= currentWeek; i++) {
        for (let j = startTime; j <= currentTime; j++) {
          if (selecting) {
            // Add code that captures selection data HERE
            document.getElementById(i + "_" + j).style.background = color;
            if (color == inPersonColor) {
              document.getElementById(i + "_" + j).style.boxShadow =
                "0 0 8px 2px #32d97759";
            } else {
              document.getElementById(i + "_" + j).style.boxShadow =
                "0 0 8px 2px #3796e659";
            }
            // TODO: Reflect this in the JS array for availability.
            availabilityStore[i + "_" + j] = StringToLocationInteger(color);
          } else {
            // Add code that captures deselction data HERE
            document.getElementById(i + "_" + j).style.background = "none";
            document.getElementById(i + "_" + j).style.boxShadow = "none";

            // TODO: Reflect this in the JS array for availability.
            delete availabilityStore[i + "_" + j];
          }
        }
      }
    }

    document.getElementById("selection").style.display = "none";
    document.getElementById("tooltip").style.opacity = "0";
    document.getElementById("tooltip").style.transform = "scale(0)";
  }

  // Add time overlay for selection
  function showTime(id, newID) {
    deleteElement(newID);

    let date = new Date();
    date.setTime(timeArray[getTimeCodeFromID(id)]);
    date.setMinutes(date.getMinutes() + 15);
    let timeText = dateFormatter.format(date);

    let time = document.createElement("div");
    time.id = newID;
    time.classList.add("selection-time");
    let startTimeDiv = document.getElementById(id);
    if (newID == "endTime") {
      time.innerText = timeText;
      time.style.position = "absolute";
      time.style.width = "100%";
      time.style.textAlign = "right";
      time.style.bottom = "0";
    } else {
      time.innerText = startTimeDiv.innerText;
    }

    time.style.color = "#ecf0f1";
    time.style.zIndex = 12;

    document.getElementById("selection").appendChild(time);
  }

  function registerMouseOver(e, id) {
    if (!dragging) {
      document.getElementById(id).style.fontSize = "12px";
      if (
        document.getElementById(id).style.background == inPersonColor ||
        document.getElementById(id).style.background == virtualColor
      ) {
        document.getElementById(id).style.color = "white";
      } else {
        document.getElementById(id).style.color = "#2c3e50";
      }
    }

    let timeCode = getTimeCodeFromID(id);
    let hour = "h" + (timeCode - (timeCode % 4));
    if (hour != "h0") {
      document.getElementById(hour).style.background = "#1abc9c";
      document.getElementById(hour).style.boxShadow =
        "0 10px 10px -8px #1ed9b359";
      document.getElementById(hour).style.transform = "scale(1.05)";
    }

    if(!input) {
      let tipText = document.getElementById("tipText");
      tipText.style.opacity = "1";
      tipText.style.transform = "scale(1)";

      let text = ""
      let state = 0;
      if (mode == "inPerson") {
        state = 1;
      }

      const arr = Array.from(data[getWeekNumberFromID(id)][getTimeCodeFromID(id)][state]);
      for (let i = 0; i < arr.length; i++) {
        if(i == 0) {
          text += arr[i];
        } else {
          text += ", " + arr[i];
        }
      }

      if(arr.length == 1) {
        text += " is available at this time"
      } else if(arr.length != 0) {
        text += " are available at this time"
      }    

      if(text == "") {
        tipText.innerText = "No one is available at this time";
      } else {
        tipText.innerText = text;
      }
    }
  }

  function registerLeave(e, id) {
    if(!input) {
      document.getElementById("tipText").style.opacity = "0";
    document.getElementById("tipText").style.transform = "scale(0)";
    }
    document.getElementById(id).style.fontSize = "0px";

    let timeCode = getTimeCodeFromID(id);
    let hour = "h" + (timeCode - (timeCode % 4));
    if (hour != "h0") {
      document.getElementById(hour).style.background = "#2c3e50";
      document.getElementById(hour).style.boxShadow = "none";
      document.getElementById(hour).style.transform = "scale(1)";
    }
  }

  function registerMouseOverDay(e, id) {
    document.getElementById(id).style.background = "#1abc9c";
    document.getElementById(id).style.boxShadow = "0 10px 10px -8px #1ed9b359";
    document.getElementById(id).style.transform = "scale(1.05)";
  }

  function registerMouseOutOfDay(e, id) {
    document.getElementById(id).style.background = "#2c3e50";
    document.getElementById(id).style.boxShadow = "none";
    document.getElementById(id).style.transform = "scale(1)";
  }

  function disableSelection() {
    selectionArray = [];
    dragging = false;
    document.getElementById("tooltip").style.opacity = "0";
    document.getElementById("tooltip").style.transform = "scale(0)";
    document.getElementById("selection").style.display = "none";
    document.getElementById("tipText").style.opacity = "0";
    document.getElementById("tipText").style.transform = "scale(0)";
    deleteElement("startTime");
    deleteElement("endTime");
  }

  function deleteElement(id) {
    var element = document.getElementById(id);
    if (typeof element != "undefined" && element != null) {
      element.remove();
    }
  }

  function responsiveText(windowWidth) {
    if (windowWidth <= 800) {
      document.getElementById("hiddenTime").innerText = "12 PM";
      let options = { hour: "numeric" };
      let shortTimeFormatter = new Intl.DateTimeFormat("en-US", options);
      let times = document.getElementsByClassName("cal-time visible");

      for (let i = 0; i < times.length; i++) {
        times[i].innerText = shortTimeFormatter.format(
          timeArray[times[i].id.slice(1)]
        );
      }
    } else {
      document.getElementById("hiddenTime").innerText = "12:00 PM";
      let times = document.getElementsByClassName("cal-time visible");

      for (let i = 0; i < times.length; i++) {
        times[i].innerText = dateFormatter.format(
          timeArray[times[i].id.slice(1)]
        );
      }
    }

    if (windowWidth <= 1000) {
      let weekHeads = document.getElementsByClassName("cal-day textHeading");
      for (let i = 0; i < weekHeads.length; i++) {
        weekHeads[i].innerText = daysOfTheWeekShort[weekHeads[i].id];
      }
    } else {
      let weekHeads = document.getElementsByClassName("cal-day textHeading");
      for (let i = 0; i < weekHeads.length; i++) {
        weekHeads[i].innerText = daysOfTheWeek[weekHeads[i].id];
      }
    }
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<main on:mouseup={input ? (event) => registerEnd(event) : null}>
  <div id="tooltip">
    <div class="tooltip-header">
      <h3>Confirm Selection</h3>
      <a class="close" on:click={disableSelection} />
    </div>
    <div class="tooltip-body">
      <ul>
        <li>
          <button
            class="inPerson"
            on:click={(event) => confirmSelection(event, inPersonColor)}
            >Available</button
          >
        </li>
        <li>
          <button
            class="virtual"
            on:click={(event) => confirmSelection(event, virtualColor)}
            >Only Available Virtually</button
          >
        </li>
      </ul>
    </div>
  </div>
  {#if input}
    <label>TimeZone</label>
    <select>
      <option value="rigatoni" disabled>Rigatoni</option>
      <option value="dave">Dave</option>
      <option value="pumpernickel">Pumpernickel</option>
      <option value="reeses">Reeses</option>
    </select>
  {:else}
    <label>Meeting Type</label>
    <select on:change={changeViewMode} id="viewMode">
      <option value="inPerson">In Person</option>
      <option value="virtual">Virtual</option>
    </select>
  {/if}
  <div class="col">
    <div class="row" id="tipText">Nothing Selected</div>
    <div class="row">
      <div id="calendar" class="col">
        <div class="cal week" style="height: 65vh;">
          <div class="cal-header cal-with-scroll">
            <div class="cal-sidebar">
              <div class="cal-hidden-times">
                <div class="hour">
                  <div class="cal-time" id="hiddenTime">12:00 PM</div>
                </div>
              </div>
            </div>
            <div class="cal-days">
              {#each daysOfTheWeek as day, i}
                <div class="cal-day textHeading" id={i}>{day}</div>
              {/each}
            </div>
            <div class="cal-hidden-scroll" />
          </div>
          <div class="cal-body">
            <div class="cal-content">
              <div class="cal-sidebar" id="sidebar">
                {#each timeArrayHours as hourArray, k}
                  <div class="hour">
                    {#each hourArray as time, j}
                      {#if time.getHours() == 0}
                        <div class="cal-time" />
                      {:else if time.getMinutes() == 0}
                        <div class="cal-time visible" id={"h" + (j + k * 4)}>
                          {dateFormatter.format(time)}
                        </div>
                      {:else}
                        <div class="cal-time" />
                      {/if}
                    {/each}
                  </div>
                {/each}
              </div>
              <div class="cal-days" id="weekWrapper">
                <div id="selection" />
                {#each daysOfTheWeek as day, i}
                  <div
                    class="cal-day"
                    id={day}
                    on:mouseover={(event) => registerMouseOverDay(event, i)}
                    on:mouseout={(event) => registerMouseOutOfDay(event, i)}
                  >
                    {#each timeArrayHours as hourArray, k}
                      <div class="hour">
                        {#each hourArray as time, j}
                          {@const id = i + "_" + (j + k * 4)}
                          <div
                            class="cal-time"
                            {id}
                            on:mousedown={input
                              ? (event) => registerStart(event, id)
                              : null}
                            on:touchstart={input
                              ? (event) => registerStart(event, id)
                              : null}
                            on:mousemove={input
                              ? (event) => registerMove(event, id)
                              : null}
                            on:mouseout={(event) => registerLeave(event, id)}
                            on:touchmove={input
                              ? (event) => registerMove(event, id)
                              : null}
                            on:mouseover={(event) =>
                              registerMouseOver(event, id)}
                          >
                            {dateFormatter.format(time)}
                          </div>
                        {/each}
                      </div>
                    {/each}
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>
        <div class="legend">
          <span>
            <div class="inPersonColor" />
            Available
          </span>
          <span>
            <div class="virtualColor" />
            Available Only Virtually
          </span>
        </div>
      </span>
      {#if input}
        <span>
          <Submitter availability={availabilityStore} {username} />
        </span>
      {/if}
    </div>
  </div>
</main>

<style>
  /* GENERAL STYLES */
  .col {
    flex: 1 1 0%;
    min-width: 0;
    max-width: 100%;
    text-align: center;
    margin-right: 30px;
    margin-left: 30px;
  }

  .row {
    display: flex;
  }

  /* LEGEND STYLES */
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

  .virtualColor {
    background: #3498db;
    box-shadow: rgb(55 150 230 / 50%) 0px 0px 5px 0px;
  }

  /* SELECTION TEXT STYLE */
  #tipText {
    opacity: 0;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 20px;
    padding: 20px 25px;
    background: #34495e;
    display: inline-block;
    border-radius: 20px;
    border: 2px solid #2c3e50;
    box-shadow: 0 0 16px #34495e80;
    font-weight: 500;
    color: #ecf0f1;
    transition: all 0.15s cubic-bezier(0.17, 0.67, 0.34, 1.13);
    font-size: 16px;
    transform: scale(0);
    font-weight: 600;
  }

  /* TOOLTIP STYLES */
  #tooltip {
    background: #ffffff;
    border: 2px solid #ebedef;
    border-radius: 15px;
    box-shadow: 0px 0 12px #00000059;
    position: absolute;
    z-index: 10;
    opacity: 0;
    transform: scale(0);
    transition: opacity 0.08s ease-out,
      transform 0.15s cubic-bezier(0.17, 0.67, 0.15, 1.07);
    text-align: center;
  }

  .tooltip-header {
    border-bottom: 2px solid #ebedef;
    text-align: left;
    padding: 20px;
    padding-top: 15px;
    padding-left: 14px;
    padding-bottom: 10px;
    color: #2c3e50;
  }

  .tooltip-header h3 {
    margin: 0;
    margin-bottom: 5px;
    font-size: 18px;
    font-weight: 700;
    color: #2c3e50;
  }

  .close {
    position: absolute;
    right: 15px;
    top: 5px;
    width: 32px;
    height: 32px;
    opacity: 0.3;
    margin-bottom: 25px;
    transition: all 0.15s ease-out;
  }

  .close:hover {
    opacity: 1;
    cursor: pointer;
  }

  .close:before,
  .close:after {
    position: absolute;
    left: 20px;
    top: 12px;
    content: " ";
    height: 20px;
    width: 4px;
    background-color: #e74c3c;
    border-radius: 20px;
  }

  .close:before {
    transform: rotate(45deg);
  }

  .close:after {
    transform: rotate(-45deg);
  }

  .close:active:before,
  .close:active:after {
    background-color: #c44133;
  }

  .tooltip-body {
    padding: 20px;
    padding-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 0;
    margin-top: 0px;
  }

  button.inPerson {
    background: #2ecc71;
    border-color: #2ecc71;
    box-shadow: #32d977bf 0 12px 15px -12px;
  }

  button.inPerson:hover {
    background: #58d68d;
    border-color: #58d68d;
  }

  button.inPerson:active {
    background: #27ad60;
    border-color: #27ad60;
    box-shadow: #32d977bf 0 10px 8px -12px;
  }

  /* BUTTON STYLES */
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

  /* SELECTION STYLES */
  #selection {
    position: absolute;
    pointer-events: none;
    z-index: 9;
    border-radius: 13px;
    transition: all 0.08s ease-out;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
    cursor: pointer;
  }

  #selection div {
    cursor: pointer;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  #endTime {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: right;
  }

  #startTime,
  #endTime {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  /* CALENDAR STYLES */
  #calendar {
    background: #34495e;
    padding: 30px;
    padding-right: 40px;
    border-radius: 50px;
    margin: 0 auto;
    color: white;
    max-width: 1000px;
    box-shadow: 0 0 16px #34495e80;
    border: 2px solid #2c3e50;
  }

  @media (max-width: 1000px) {
    #calendar {
      /* border-radius: 0; */
      padding: 15px;
      padding-right: 20px;
      /* border: none; */
    }
  }

  @media (max-width: 750px) {
    #calendar {
      border-radius: 0;
      padding: 10px;
      padding-right: 10px;
      border: none;
    }

    .col {
      margin: 0;
    }
  }

  .cal {
    display: flex;
    flex-direction: column;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .cal-header {
    display: flex;
    flex-shrink: 0;
    border-radius: 25px 25px 0 0;
  }

  .cal-day.textHeading {
    font-size: 16px;
    height: 40px;
    font-weight: 700;
    background: #2c3e50;
    border-radius: 16px;
    margin: 10px;
    margin-top: 0;
    margin-bottom: 10px;
    transition: transform 0.15s cubic-bezier(0.17, 0.67, 0.19, 1.9),
      box-shadow 0.15s ease-out, background 0.15s ease-out;
    font-size: 18px;
  }

  .cal-header,
  .cal-body,
  .cal-days,
  .cal-day {
    border: none;
  }

  .cal-header .cal-days {
    border: none;
  }

  .cal-hidden-times {
    visibility: hidden;
    overflow-y: hidden;
    height: 0;
  }

  .cal-hidden-times .hour .cal-time {
    font-weight: 500;
    padding: 0 8px;
  }

  .cal-body {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 15px;
  }

  .cal-content {
    display: flex;
  }

  .cal-sidebar {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: -22.5px;
  }

  .cal-sidebar .hour {
    margin: 0;
    padding: 5px;
    background: none;
    border-radius: 0;
  }

  .cal-sidebar .hour .cal-time {
    height: 12px;
    line-height: 12px;
  }

  .cal-sidebar .hour .cal-time.visible {
    background: #2c3e50;
    border-radius: 12px;
    text-align: center;
    padding-right: 8px;
    color: #ecf0f1;
    font-weight: 500;
    font-size: 16px;
    height: 28px;
    line-height: 28px;
    transition: transform 0.15s cubic-bezier(0.17, 0.67, 0.19, 1.9),
      box-shadow 0.15s ease-out, background 0.15s ease-out;
  }

  .cal-sidebar .hour .cal-time {
    text-align: right;
  }

  .cal-sidebar .hour .cal-time:after {
    border-color: transparent;
  }

  #weekWrapper {
    border: none;
  }

  .cal-days,
  .cal-day {
    flex: 1 1 0;
    min-width: 0;
    max-width: 100%;
  }

  .cal-days {
    display: flex;
  }

  .cal-day {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .cal-day .hour {
    box-shadow: 0 0 10px #00000014;
  }

  .cal-day .cal-time {
    font-size: 0;
    padding-left: 5px;
  }

  .hour {
    border-radius: 10px;
    pointer-events: none;
    margin: 5px;
    overflow: hidden;
    position: relative;
    background: #ecf0f1;
  }

  @media (max-width: 640px) {
    .hour {
      margin: 2.5px;
    }

    .cal-sidebar .hour {
      padding: 2.5px;
    }

    .cal-sidebar .hour .cal-time.visible,
    .cal-hidden-times .cal-time {
      font-size: 12px;
    }

    .cal-day.textHeading {
      font-size: 14px;
      margin: 5px;
    }
  }

  @media (max-width: 450px) {
    .cal-day.textHeading {
      margin: 2.5px;
    }
    .cal-header {
      margin-bottom: 8px;
    }
    #calendar {
      padding-left: 4px;
      padding-right: 5px;
      padding-bottom: 0;
    }
  }

  @media (max-width: 400px) {
    .cal-day.textHeading {
      margin: 0px;
      border-radius: 0;
      border-right: 1px solid #34495e;
      transform: scale(1) !important;
    }

    .cal-header .cal-days .textHeading:first-child {
      border-radius: 15px 0 0 15px;
    }

    .cal-header .cal-days .textHeading:last-child {
      border-radius: 0 15px 15px 0;
      border: none;
    }
  }

  .hour .cal-time {
    cursor: pointer;
    transition: all 0.15s ease-out;
  }

  .hour .cal-time:not(:first-child):after {
    content: "";
    position: absolute;
    width: 100%;
    border-bottom: 2.5px solid #34495e;
    pointer-events: none;
    transform: translateY(-50%);
    left: 0;
    z-index: 8;
    opacity: 0.2;
  }

  .hour .cal-time:nth-child(odd):after {
    border-bottom-style: dotted;
  }

  .cal-time {
    position: relative;
    line-height: 16px;
    padding-left: 8px;
    white-space: nowrap;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    pointer-events: auto;
    color: #34495e;
    text-align: left;
    height: 16px;
  }
</style>
