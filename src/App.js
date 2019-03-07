import ImageRecognition from './ImageRecognition.js';
import {hideElement, showElement} from './utils.js';
import {find} from 'lodash';
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
    this.recognitionFeature.loadModel();
    this.startButton.onclick = () => this.start();
  }

  start(){
    hideElement(this.introBlock);
    showElement(this.feedSection);

    this.recognitionFeature.initiateWebcam()
      .then(() => {
        this.guessButton.classList.remove('blinking');
        this.guessButton.innerText = 'What do I do with this?';
        this.guessButton.onclick = () => {
          this.recognitionFeature.runPredictions()
            .then((predictionsResult) => {
              if(predictionsResult){
                this.resultDiv.innerText = '';
                this.resultDiv.innerHTML = `Is it a ${predictionsResult[0].className.split(',')[0]}?`;

                this.classifyItem(predictionsResult[0].className.split(',')[0]);
              }
            });

          hideElement([classificationDiv, guessButton])
        };
      })
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
    noButton.onclick = () => this.recognitionFeature.runPredictions();
  }

  displayClassification = color => {
    this.showClassification();
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
        this.displayLastButtons();
        break;
      default:
        break;
    }
    this.classificationDiv.innerHTML = content;
    // hideElement([confirmationButtons, resultDiv]);
  }

  displayLastButtons = () => {
    showElement([confirmationButtons, resultDiv])

    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');

    yesButton.onclick = () => this.classificationDiv.innerHTML = "You can probably throw it in the yello bin!!";
    noButton.onclick = () => this.classificationDiv.innerHTML = "Mmmm... better put it in the red bin";
  }

  showClassification = () => {
    showElement(this.classificationDiv);

    // doneButton.onclick = () => {
    //   showElement(guessButton)
    //   hideElement([classificationDiv, doneButton])
    // }
  }
}
