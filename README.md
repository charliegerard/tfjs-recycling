
# Using Tensorflow.js for easier recycling.

I always struggle to remember what is recyclable and what isn't so I decided to use [Tensorflow.js](https://js.tensorflow.org/) and the object detection model [coco-ssd](https://www.npmjs.com/package/@tensorflow-models/coco-ssd) to recognise objects and help determine which bin I should throw them in.

**This is a prototype**.

The object detection is only as good as the pre-trained model used.

For the classification between different bins, I wrote a couple of files listing different objects that should be thrown in the yellow or red bins. These objects will differ depending on the country you live in. I based my selection on the NSW region in Australia.

At the moment, the objects listed in my files are based off of the [90 classes of the coco-ssd model](https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/src/classes.ts) and the [1000 classes of the mobilenet model](./src/data/imagenet_classes.js).


The lists could be more detailed and include one for electronic goods that need to be thrown separately but that's a next step.

My main goal so far was to see if it would work, and it kinda does :)

[Working Demo](https://charliegerard.github.io/tfjs-recycling)


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


