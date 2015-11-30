# CtlApi

A CenturyLink API loader javascript sdk. Check out the demo in example/example1.html

### 1. Installation

You will need to have [nodejs](http://nodejs.org/download) installed.

### 2. Getting started

* open the command line and switch into the project folder
* ```npm install```
* ```sudo npm install -g gulp```
* ```gulp``` to see the list of available tasks

### 3. Essential Gulp Tasks

* ```gulp build``` dumps a plain and a minified file from all files in the folder ```src``` into the folder ```dist```.
* ```gulp clean``` removes all files in the folder ```dist```.
* ```gulp doc``` generates JSDuck documentation in the folder ```docs```.
* ```gulp test``` runs the tests and linting for all files in the folder ```src```.
* ```gulp bump-patch``` increases the version by ```0.0.1``` for the last git commit and pushes the new tag to the remote repository.
* ```gulp bump-minor``` increases the version by ```0.1.0``` for the last git commit and pushes the new tag to the remote repository.
* ```gulp bump-major``` increases the version by ```1.0.0``` for the last git commit and pushes the new tag to the remote repository.
