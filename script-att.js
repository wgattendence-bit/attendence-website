const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const API = "https://script.google.com/macros/s/AKfycbw5Z7WML1sgnU7zU_Rj0CzPNJ2VuELtFec6qmE9Q9MEEafEey9t1-zi62JpKTo3TRMXWw/exec";

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      scanQR();
    });
}

function scanQR() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    ctx.drawImage(video, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      document.getElementById("status").innerText = "Attendance marked for: " + code.data;

      // Send to server
      fetch(API, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: "name=" + encodeURIComponent(code.data)
      });

      return;
    }
  }
  requestAnimationFrame(scanQR);
}