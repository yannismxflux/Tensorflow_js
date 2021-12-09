const onButton = document.querySelector("#on");
const offButton = document.querySelector("#off");
offButton.addEventListener("click", cameraOff);
const liveView = document.querySelector("#liveView");
var isActive = false;
const result = document.querySelector(".detected");
var children = [];
const video = document.getElementById("webcam");
var model = undefined;

cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  // Show demo section now model is ready to use.
});

function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
if (getUserMediaSupported()) {
  onButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");

}

function predictWebcam() {
  // Now let's start classifying a frame in the stream.
  result.innerHTML = "<h3>Objets détectés</h3>";
 
  
  if (isActive) {
    model.detect(video).then(function (predictions) {
      // Remove any highlighting we did previous frame.
      for (let i = 0; i < children.length; i++) {
        liveView.removeChild(children[i]);
      }
      children.splice(0);
      for (let index = 0; index < predictions.length; index++) {
        if (predictions[index].score > 0.65) {
          let score = Math.round(parseFloat(predictions[index].score) * 100);
          let label = predictions[index].class;
          result.innerHTML +=
            `<p class="mb-2"><b>` +
            label +
            " " +
            score +
            "% " +
            `</b><progress class="progress is-success" value="` +
            score +
            `" max="100"></progress></p>`;


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
            highlighter.innerHTML="<p>"+label+"</p>"

          liveView.appendChild(highlighter);
          children.push(highlighter)
         
          
          
        } else {
          result.innerHTML="";
        }
      }
    });
     window.requestAnimationFrame(predictWebcam);
  }
  
  
}

function enableCam(event) {
  // Only continue if the COCO-SSD has finished loading.
  if (!model) {
    return;
  }
  isActive = true;
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
function cameraOff() {
  isActive = false;  
  const tracks = video.srcObject.getTracks();
  tracks.forEach(function (track) {
    track.stop();
  });
  video.srcObject = null;
  console.log("Camera Off");
}
