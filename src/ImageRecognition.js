import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {hideElement, showElement} from './utils.js';
import {IMAGENET_CLASSES} from './data/imagenet_classes';
import {Webcam} from './webcam';
import {isMobile} from './utils';


export default class ImageRecognition {
  constructor(){
    this.webcam;
    this.predictions;
    this.model;
  }

  loadModel = async() => {
    this.model = await mobilenet.load();
    return this.model;
  }

  initiateWebcam = async() => {
    this.webcam = new Webcam(document.getElementById('webcam'));
    this.webcam.webcamElement.width = window.innerWidth
    this.webcam.webcamElement.height = window.innerHeight

    try {
      // If on mobile, use the back camera. Otherwise, flip the playback video.
      const facingMode = isMobile() ? 'environment' : 'user';
      if (!isMobile()) {
        this.webcam.webcamElement.classList.add('flip-horizontally');
      }
      await this.webcam.setup({'video': {facingMode: facingMode}, 'audio': false});
      console.log('WebCam sccessfully initialized');
    } catch (e) {
      console.log(e)
      // resultDiv.innerHTML =
      //     'WebCam not available.<br/>' +
      //     'This demo requires WebCam access with this browser.';
      return;
    }
  }

  runPredictions = async() => {
    let webcamImage = this.webcam.capture();
    let resizedWebcam = tf.image.resizeBilinear(webcamImage, [224, 224]);
    this.predictions = await this.model.classify(resizedWebcam);

    return this.predictions;
  }
}
