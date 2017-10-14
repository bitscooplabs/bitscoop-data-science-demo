# 2. Download the Demo “Dog.Breed” Project

You can download a pre-zipped copy of the code at https://github.com/bitscooplabs/bitscoop-data-science-demo/archive/master.zip and then skip to step 3.

The SHA-256 for this file is

`4b086cbda493c12cde05740d0998be3333459cf3d8a97aa440f31484b5f257a1`

If you want to build the project yourself instead of using the pre-zipped copy above, you will need to have node.js and `npm` installed on your machine so that you can install the demo’s dependencies before uploading the code to Lambda. Download the project from

[bitscooplabs/bitscoop-data-science-demo](https://github.com/bitscooplabs/bitscoop-data-science-demo)

[bitscoop-data-science-demo — Simple Data Science demo based on the](https://github.com/bitscooplabs/bitscoop-data-science-demo)

[BitScoop platformgithub.com*](https://github.com/bitscooplabs/bitscoop-data-science-demo)

From the top level of this project run

`npm install`

to install all of the project-wide dependencies, then go to the src/ directory and again run

`npm install`

Finally go up one level to the top-level directory and run the command

`grunt build`

to zip the project to

dist/bitscoop-data-science-demo-<version>.zip
