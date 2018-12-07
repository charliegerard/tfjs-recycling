
// ref: https://github.com/tensorflow/tfjs-converter/blob/master/demo/mobilenet/mobilenet.js
// ref: https://github.com/tensorflow/tfjs-examples/blob/master/webcam-transfer-learning/index.js

import * as tf from '@tensorflow/tfjs-core';
import {loadFrozenModel} from '@tensorflow/tfjs-converter';
import {find} from 'lodash';

import {IMAGENET_CLASSES} from './imagenet_classes';
import {Webcam} from './webcam';
import {isMobile} from './utils';
import {yellowBinItems} from './yellowBinList';

const MODEL_PATH_PREFIX = 'https://storage.googleapis.com/tfjs-models/savedmodel/';
const MODEL_FILENAME = 'mobilenet_v1_1.0_224/optimized_model.pb';
const WEIGHTS_FILENAME = 'mobilenet_v1_1.0_224/weights_manifest.json';
const INPUT_NODE_NAME = 'input';
const OUTPUT_NODE_NAME = 'MobilenetV1/Predictions/Reshape_1';

window.onload = async () => {
  const confirmationButtons = document.getElementById('confirmation-buttons');
  const classificationDiv = document.getElementById('recycling-classification');
  const doneButton = document.getElementById('next');

  const model = await loadFrozenModel(
      MODEL_PATH_PREFIX + MODEL_FILENAME,
      MODEL_PATH_PREFIX + WEIGHTS_FILENAME);

  const webcam = new Webcam(document.getElementById('webcam'));
  const resultDiv = document.getElementById('result');
  try {
    // If on mobile, use the back camera. Otherwise, flip the playback video.
    const facingMode = isMobile() ? 'environment' : 'user';
    if (!isMobile()) {
      webcam.webcamElement.classList.add('flip-horizontally');
    }
    await webcam.setup({'video': {facingMode: facingMode}, 'audio': false});
    console.log('WebCam sccessfully initialized');
  } catch (e) {
    resultDiv.innerHTML =
        'WebCam not available.<br/>' +
        'This demo requires WebCam access with this browser.';
    return;
  }

  // Warm up the model. This uploads weights to the GPU and compiles the WebGL
  // programs so the subsequent execution will be quick.
  tf.tidy(() => {
    const input = webcam.capture();
    model.execute({[INPUT_NODE_NAME]: input}, OUTPUT_NODE_NAME);
  });

  const guessButton = document.getElementById('guess-button');
  guessButton.classList.remove('blinking');
  guessButton.innerText = 'What do I do with this?';

  guessButton.onclick = () => runPredictions();

  const runPredictions = () => {
    hideClassification();
    hideMainButton();
    const predictions = tf.tidy(() => {
      const input = webcam.capture();
      const output = model.execute({[INPUT_NODE_NAME]: input}, OUTPUT_NODE_NAME);
      return output.dataSync();
    });

    let predictionList = [];
    for (let i = 0; i < predictions.length; i++) {
      predictionList.push({label: IMAGENET_CLASSES[i], value: predictions[i]});
    }
    predictionList = predictionList.sort((a, b) => {return b.value - a.value;});
    resultDiv.innerText = '';
    resultDiv.innerHTML = `Is it a ${predictionList[0].label.split(',')[0]}?`

    classifyItem(predictionList[0].label.split(',')[0])
  }

  const classifyItem = item => {
    const yellowItemFound = find(yellowBinItems, yellowBinItem => item === yellowBinItem);
    if(yellowItemFound){
      displayButtons('yellow')
    } else {
      displayButtons()
    }
  }

  const displayButtons = color => {
    showPredictionAndButtons();

    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');
    yesButton.onclick = () => displayClassification(color);

    noButton.onclick = () => runPredictions();
  }

  const displayClassification = color => {
    showClassification();
    if(color === "yellow"){
      classificationDiv.innerHTML = `It is recyclable! Throw it in the ${color} bin! 🎉`
      hidePredictionAndButtons()
    }
  }

  const hidePredictionAndButtons = () => {
    confirmationButtons.style.display = 'none';
    resultDiv.style.display = 'none';
  }

  const hideClassification = () => {
    classificationDiv.style.display = 'none';
  }

  const showPredictionAndButtons = () => {
    confirmationButtons.style.display = 'block';
    resultDiv.style.display = 'block';
  }

  const showClassification = () => {
    classificationDiv.style.display = 'block';
    doneButton.style.display = 'block';

    doneButton.onclick = () => {
      showMainButton();
      hideClassification();
      hideDoneButton();
    }
  }

  const hideMainButton = () => {
    guessButton.style.display = 'none';
  }

  const showMainButton = () => {
    guessButton.style.display = 'block';
  }

  const hideDoneButton = () => {
    doneButton.style.display = 'none';
  }
};
