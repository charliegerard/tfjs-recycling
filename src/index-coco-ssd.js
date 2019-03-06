import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

let model, stream, videoElement, predictions;

window.onload = () => {
  init()
}

const init = async () => {
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user"
      },
      audio: false
    });

    videoElement = document.getElementsByTagName('video')[0]
    model = await cocoSsd.load();
    videoElement.srcObject = stream;
    predictFrame();

  } catch(err){
    console.log(err)
  }
}

const predictFrame = async () => {
  predictions = await model.detect(videoElement);
  drawPredictions(predictions);
  console.log('here??', predictions[0])
  //recursive call
  predictFrame();
};

const drawPredictions = predictions => {
  let canvasElement = document.getElementsByTagName('canvas')[0];
  const ctx = canvasElement.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";
  predictions.forEach(prediction => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    const width = prediction.bbox[2];
    const height = prediction.bbox[3];
    // Draw prediction box.
    ctx.strokeStyle = "#fa00ff";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);
    // Draw text box.
    ctx.fillStyle = "#fa00ff";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    // Draw text.
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);
  });
};
