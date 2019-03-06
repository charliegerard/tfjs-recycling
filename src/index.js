
// ref: https://github.com/tensorflow/tfjs-converter/blob/master/demo/mobilenet/mobilenet.js
// ref: https://github.com/tensorflow/tfjs-examples/blob/master/webcam-transfer-learning/index.js

import 'babel-polyfill';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {find} from 'lodash';
import ImageRecognition from './ImageRecognition.js';
import './App.css';

import {yellowBinItems} from './data/yellowBinList';
import {redBinItems} from './data/redBinList';

window.onload = async () => {
  const confirmationButtons = document.getElementById('confirmation-buttons');
  const classificationDiv = document.getElementById('recycling-classification');
  const doneButton = document.getElementById('next');
  const model = await mobilenet.load();

  const resultDiv = document.getElementById('result');

  const guessButton = document.getElementById('guess-button');
  guessButton.classList.remove('blinking');
  guessButton.innerText = 'What do I do with this?';

  guessButton.onclick = () => ImageRecognition.runPredictions();

  const displayButtons = color => {
    showElement([confirmationButtons, resultDiv])

    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');

    yesButton.onclick = () => displayClassification(color);
    noButton.onclick = () => runPredictions();
  }

  const displayClassification = color => {
    showClassification();
    let content;

    switch(color){
      case "yellow":
        content = `It is recyclable! Throw it in the ${color} bin! 🎉`;
        hideElement([confirmationButtons, resultDiv]);
        break;
      case "red":
        content = `It is not recyclable 😢Throw it in the ${color} bin.`;
        hideElement([confirmationButtons, resultDiv]);
        break;
      case "none":
        content = `Mmmm, I don't seem to know yet how to classify that but...\n
        Is it made of soft plastic, aluminium, paper, glass or cardboard?`;
        displayLastButtons();
        break;
      default:
        break;
    }
    classificationDiv.innerHTML = content;
    // hideElement([confirmationButtons, resultDiv]);
  }

  const displayLastButtons = () => {
    showElement([confirmationButtons, resultDiv])

    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');

    yesButton.onclick = () => classificationDiv.innerHTML = "You can probably throw it in the yello bin!!";
    noButton.onclick = () => classificationDiv.innerHTML = "Mmmm... better put it in the red bin";
  }

  const showClassification = () => {
    showElement(classificationDiv);

    // doneButton.onclick = () => {
    //   showElement(guessButton)
    //   hideElement([classificationDiv, doneButton])
    // }
  }

  const hideElement = (element) => {
    return element.length ? element.map(e => e.style.display = 'none') : element.style.display = 'none';
  }

  const showElement = (element) => {
    return element.length ? element.map(e => e.style.display = 'block') : element.style.display = 'block';
  }
};


