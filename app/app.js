/*
Here are the main functions of the app 
*/
document.addEventListener("DOMContentLoaded", function () {
  console.log("Starting Crestron interface...");

  initializeCrestron();
});

function initializeCrestron() {

  if (typeof window.CrComLib === "undefined") {
    console.error("CrComLib not found!");
    return; 
  }


  console.log("CrComLib loaded:", window.CrComLib.version);

  const statusElement = document.getElementById("connection-status");

  window.CrComLib.subscribeState(
    "b",
    "Csig.CONNECTED_STATE",
    function (connected) {
      updateConnectionStatus(connected, statusElement);

      if (connected) {
        console.log("Connected to Crestron");
      } else {
        console.log("Connecting to Crestron...");
      }
    }
  );

  const buttons = document.querySelectorAll(".control-btn");

  buttons.forEach(function (button) {
    const joinNumber = button.getAttribute("data-join");

    console.log("Setting up Button with Join " + joinNumber);

    button.addEventListener("mousedown", function () {
      handleButtonPress(joinNumber, true, button);
    });

    button.addEventListener("mouseup", function () {
      handleButtonPress(joinNumber, false, button);
    });

    button.addEventListener("touchstart", function (e) {
      e.preventDefault(); 
      handleButtonPress(joinNumber, true, button);
    });

    button.addEventListener("touchend", function (e) {
      e.preventDefault(); 
      handleButtonPress(joinNumber, false, button);
    });
  });

  console.log("Crestron interface ready");
}

function handleButtonPress(joinNumber, isPressed, buttonElement) {
  console.log(
    "Join " + joinNumber + ": " + (isPressed ? "PRESSED" : "RELEASED")
  );

  if (window.CrComLib && window.CrComLib.publishEvent) {
    window.CrComLib.publishEvent("b", "Dig." + joinNumber, isPressed);
    console.log("Sent to Crestron: Dig." + joinNumber + " = " + isPressed);
  }

  if (isPressed) {
    // Button is being pressed
    buttonElement.classList.add("pressed");
  } else {
    buttonElement.classList.remove("pressed");
  }
}

function updateConnectionStatus(isConnected, statusElement) {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = isConnected
    ? "Connected to Crestron"
    : "Connecting to Crestron...";
  statusElement.classList.toggle("is-connected", Boolean(isConnected));
}
