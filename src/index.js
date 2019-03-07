
// ref: https://github.com/tensorflow/tfjs-converter/blob/master/demo/mobilenet/mobilenet.js
// ref: https://github.com/tensorflow/tfjs-examples/blob/master/webcam-transfer-learning/index.js

import 'babel-polyfill';
import App from './App.js';

window.onload = async () => {
  const app = new App();
  app.init();
};


