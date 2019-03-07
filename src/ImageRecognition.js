import * as cocoSsd from "@tensorflow-models/coco-ssd";
import {Webcam} from './utils/webcam';
import {isMobile} from './utils/utils';

export default class ImageRecognition {
  constructor(){
    this.webcam;
    this.predictions;
    this.model;
  }

  loadModel = async() => {
    this.model = await cocoSsd.load();;
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
      return e;
    }
  }

  runPredictions = async() => {
    let webcamImage = this.webcam.webcamElement;
    this.predictions = await this.model.detect(webcamImage);
    return this.predictions;
  }
}
