const onButton = document.querySelector("#on");
const offButton = document.querySelector("#off");
offButton.addEventListener("click",cameraOff)

const video = document.getElementById('webcam');
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





function enableCam(event) {
  // Only continue if the COCO-SSD has finished loading.
  if (!model) {
    return;
  }

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
function cameraOff()
{
    const tracks = video.srcObject.getTracks();
    tracks.forEach(function(track){
        track.stop();
    });
    video.srcObject = null;
    console.log("Camera Off");
    camIsOn = false;
}


