import ImageRecognition from './ImageRecognition.js';
import {hideElement, showElement} from './utils/utils.js';
import find from 'lodash/find';
import {yellowBinItems} from './data/yellowBinList';
import {redBinItems} from './data/redBinList';

import './App.css';

export default class App{
  constructor(){
    this.confirmationButtons = document.getElementById('confirmation-buttons');
    this.classificationDiv = document.getElementById('recycling-classification');
    this.doneButton = document.getElementById('next');
    this.resultDiv = document.getElementById('result');
    this.guessButton = document.getElementById('guess-button');
    this.startButton = document.getElementsByClassName('start-button')[0];
    this.introBlock = document.getElementsByClassName('intro')[0];
    this.feedSection = document.getElementsByClassName('feed')[0];
    this.recognitionFeature = new ImageRecognition();
  }

  init = () => {
    this.recognitionFeature.loadModel()
      .then(() => {
        this.startButton.classList.remove('blinking');
        this.startButton.innerText = 'Start';
        this.startButton.onclick = () => this.start();
      })
  }

  start(){
    hideElement(this.introBlock);
    showElement(this.feedSection);

    this.recognitionFeature.initiateWebcam()
      .then(() => {
        this.guessButton.classList.remove('blinking');
        this.guessButton.innerText = 'Is this recyclable?';
        this.guessButton.onclick = () => {
          this.predict();
        };
      }).catch(() => {
        hideElement(this.guessButton);
        this.resultDiv.innerHTML = `Webcam not available. This demo requires webcam access.`;
      })
  }

  predict = () => {
    this.recognitionFeature.runPredictions()
    .then((predictionsResult) => {
      if(predictionsResult.length){
        this.resultDiv.innerText = '';
        this.resultDiv.innerHTML = `Is it a ${predictionsResult[0].class.split(',')[0]}?`;
        hideElement([this.classificationDiv, this.guessButton]);

        this.classifyItem(predictionsResult[0].class.split(',')[0]);
      }
    });
  }

  classifyItem = item => {
    const yellowItemFound = find(yellowBinItems, yellowBinItem => item === yellowBinItem);
    const redItemFound = find(redBinItems, redBinItem => item === redBinItem);

    if(yellowItemFound){
      this.displayButtons('yellow')
    } else if(redItemFound) {
      this.displayButtons('red')
    } else {
      this.displayButtons('none')
    }
  }

  displayButtons = color => {
    showElement([this.confirmationButtons, this.resultDiv])

    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');

    yesButton.onclick = () => this.displayClassification(color);
    noButton.onclick = () => this.predict();
  }

  displayClassification = color => {
    this.showClassification();
    let content;

    switch(color){
      case "yellow":
        content = `It is recyclable! Throw it in the ${color} bin! 🎉`;
        this.showFinalMessage(content);
        break;
      case "red":
        content = `It is not recyclable 😢Throw it in the ${color} bin.`;
        this.showFinalMessage(content);
        break;
      case "none":
        content = `Mmmm, I don't seem to know yet how to classify that but...\n
        Is it made of soft plastic, aluminium, paper, glass or cardboard?`;
        this.displayLastButtons();
        break;
      default:
        break;
    }

    this.resultDiv.innerHTML = content;
  }

  displayLastButtons = () => {
    showElement([this.confirmationButtons, this.resultDiv])

    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');

    yesButton.onclick = () => this.showFinalMessage("You can probably throw it in the yellow bin!! 🎉");
    noButton.onclick = () => this.showFinalMessage("Mmmm... better put it in the red bin");
  }

  showFinalMessage = content => {
    this.resultDiv.innerHTML = content;
    hideElement(this.confirmationButtons)
    showElement(this.doneButton)

    this.doneButton.onclick = () => {
      showElement(this.guessButton)
      hideElement([this.classificationDiv, this.doneButton, this.resultDiv])
    }
  }

  showClassification = () => {
    showElement(this.classificationDiv);
  }
}
