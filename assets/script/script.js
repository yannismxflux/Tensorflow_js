const onButton = document.querySelector("#on");
const offButton = document.querySelector("#off");
const liveView = document.querySelector("#liveView");
var isActive = false;
const result = document.querySelector(".detected");
var children = [];
const video = document.getElementById("webcam");
var model = undefined;
var loading = document.querySelector("#loading");

// Chargement de coco-ssd

cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  loading.style = "display:none!important";

  console.log("it's okay");
});

// Verif du support webcam
function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
if (getUserMediaSupported()) {
  onButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Fonction de detection d'objet

function predictWebcam() {
  // Now let's start classifying a frame in the stream.
  result.innerHTML =
    "<h3 class='title is-4 has-text-center'>Objets détectés</h3>";

  for (let i = 0; i < children.length; i++) {
    liveView.removeChild(children[i]);

  }
  children.splice(0);
  if (isActive) {
    model.detect(video).then(function (predictions) {
      // Remove any highlighting we did previous frame.

      for (let index = 0; index < predictions.length; index++) {
        if (predictions[index].score > 0.65) {
          let score = Math.round(parseFloat(predictions[index].score) * 100);
          let label = predictions[index].class;

          // Partie progress bar
          result.innerHTML +=
            `<p class="mb-2"><b>` +
            label +
            " " +
            score +
            "% " +
            `</b><progress class="progress is-success" value="` +
            score +
            `" max="100"></progress></p>`;

          // Partie Highlighter
          const highlighter = document.createElement("div");
          highlighter.setAttribute("class", "highlighter");
          highlighter.style =
            "left: " +
            predictions[index].bbox[0] +
            "px; top: " +
            predictions[index].bbox[1] +
            "px; width: " +
            predictions[index].bbox[2] +
            "px; height: " +
            predictions[index].bbox[3] +
            "px;";
          highlighter.innerHTML = "<p>" + label + " " + score + "%</p>";

          liveView.appendChild(highlighter);
          children.push(highlighter);
        }
      }
    });
    // Recursion de la fonction au rafraichissement de la fenetre

    window.requestAnimationFrame(predictWebcam);
  }
}

// Fonction "on" de la fonction

function enableCam(event) {
  // Only continue if the COCO-SSD has finished loading.
  if (!model) {
    return;
  }
  isActive = true;
  console.log("Camera on");
  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

// Fonction off

function cameraOff() {
  isActive = false;

  const tracks = video.srcObject.getTracks();
  
    tracks.forEach(function (track) {
      track.stop();
    });
    video.srcObject = null;
    console.log("Camera Off");
    result.innerHTML = "";
  }


offButton.addEventListener("click", cameraOff);
