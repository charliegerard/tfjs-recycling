
# Image recognition using Tensorflow.js for easier recycling

I always struggle to remember what is recyclable and what isn't so I decided to use [Tensorflow.js](https://js.tensorflow.org/) and the [MobileNet](https://arxiv.org/abs/1704.04861) model pre-trained on [ImageNet](http://www.image-net.org/challenges/LSVRC/2012/) to recognise objects and help determine which bin I should throw stuff in.

This project is based on the [Emoji Scavenger Hunt](https://github.com/google/emoji-scavenger-hunt) experiment and [this prototype](https://github.com/maru-labo/tfjs-mobilenet-webcam)


The demo loads the model converted to TensorFlow.js format,
which is hosted at Google Cloud Storage
(e.g. its `weights_manifest.json` can be obtained
[here](https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v1_1.0_224/weights_manifest.json)).



## Installing and running locally

`git clone tfjs-recycling`

`cd tfjs-recycling`


```bash
yarn        # Installs dependencies.
yarn start
```

A browser window/tab should open on port 8080.

## Building

To build the project, run `yarn build` and the `public` directory will have the deployable files.


