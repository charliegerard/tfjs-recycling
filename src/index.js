
// // ref: https://github.com/tensorflow/tfjs-converter/blob/master/demo/mobilenet/mobilenet.js
// // ref: https://github.com/tensorflow/tfjs-examples/blob/master/webcam-transfer-learning/index.js

// import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
// // import {loadFrozenModel} from '@tensorflow/tfjs-converter';
import {find} from 'lodash';

import {IMAGENET_CLASSES} from './data/imagenet_classes';
import {Webcam} from './webcam';
import {isMobile} from './utils';
import {yellowBinItems} from './data/yellowBinList';
import {redBinItems} from './data/redBinList';

window.onload = async () => {
  const confirmationButtons = document.getElementById('confirmation-buttons');
  const classificationDiv = document.getElementById('recycling-classification');
  const doneButton = document.getElementById('next');
  const model = await mobilenet.load();

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

  const guessButton = document.getElementById('guess-button');
  guessButton.classList.remove('blinking');
  guessButton.innerText = 'What do I do with this?';

  guessButton.onclick = () => runPredictions();

  const runPredictions = async() => {
    hideElement([classificationDiv, guessButton])

    let webcam = document.getElementsByTagName('video')[0];

    let predictions = await model.classify(webcam);

    resultDiv.innerText = '';
    resultDiv.innerHTML = `Is it a ${predictions[0].className.split(',')[0]}?`

    classifyItem(predictions[0].className.split(',')[0])
  }

  const classifyItem = item => {
    const yellowItemFound = find(yellowBinItems, yellowBinItem => item === yellowBinItem);
    const redItemFound = find(redBinItems, redBinItem => item === redBinItem);

    if(yellowItemFound){
      displayButtons('yellow')
    } else if(redItemFound) {
      displayButtons('red')
    } else {
      console.log("Mmmm, I don't seem to know yet how to classify that but...")
      console.log("Is it made of soft plastic, aluminium, paper, glass or cardboard?") // => yellow bin
      console.log("If not, better put it in the red bin") // => red bin
    }
  }

  const displayButtons = color => {
    showElement([confirmationButtons, resultDiv])

    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');
    yesButton.onclick = () => displayClassification(color);

    noButton.onclick = () => runPredictions();
  }

  const displayClassification = color => {
    showClassification();

    switch(color){
      case "yellow":
        classificationDiv.innerHTML = `It is recyclable! Throw it in the ${color} bin! 🎉`;
        hideElement([confirmationButtons, resultDiv])
        break;
      default:
        break;
    }
  }

  const showClassification = () => {
    showElement([classificationDiv, doneButton]);

    doneButton.onclick = () => {
      showElement(guessButton)
      hideElement([classificationDiv, doneButton])
    }
  }

  const hideElement = (element) => {
    return element.length ? element.map(e => e.style.display = 'none') : element.style.display = 'none';
  }

  const showElement = (element) => {
    return element.length ? element.map(e => screen.style.display = 'block') : element.style.display = 'block';
  }

};


