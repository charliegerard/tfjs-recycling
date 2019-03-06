import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {IMAGENET_CLASSES} from './data/imagenet_classes';
import {Webcam} from './webcam';
import {isMobile} from './utils';


export default class ImageRecognition {

  startWebcam = async() => {
    const webcam = new Webcam(document.getElementById('webcam'));

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
  }

  runPredictions = async() => {
    hideElement([classificationDiv, guessButton])

    let webcamImage = webcam.capture();
    let resizedWebcam = tf.image.resizeBilinear(webcamImage, [224, 224]);
    let predictions = await model.classify(resizedWebcam);

    resultDiv.innerText = '';
    resultDiv.innerHTML = `Is it a ${predictions[0].className.split(',')[0]}?`

    classifyItem(predictions[0].className.split(',')[0])
  }

  classifyItem = item => {
    const yellowItemFound = find(yellowBinItems, yellowBinItem => item === yellowBinItem);
    const redItemFound = find(redBinItems, redBinItem => item === redBinItem);

    if(yellowItemFound){
      displayButtons('yellow')
    } else if(redItemFound) {
      displayButtons('red')
    } else {
      displayButtons('none')
    }
  }

}
