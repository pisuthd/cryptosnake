# CryptoSnake

## What is it

CryptoSnake is a kinect-styled snake game, anyone with a decent webcam-equipped desktop can experience an innovative full-body tracking technology right from the browser and player can get an reward in NEO NEP-5 token when fruits have been eaten by the snake that they're controlled. In the long run, the token can be used for organizaing various challenges from player to player and create a bandwagon effect as the network become more valuable and more people join. 

![Menu Screen](https://s3.amazonaws.com/dev1.cryptosnake.webcam/snake1.png)

 
 ## How it works
 
 * NEO blockchain - The game utilizes of a new token name SNAKE COIN based in NEO NEP-5 where it can drop as a fruit form in the game. And it will be primarily data store for the game where player can place an challenge for other player and set a bounty for them. 
 
 * Tensorflow.js - The magic behinds the game is a pre-built machine-learning model name [Posenet](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5) which allows for real-time pose estimation in the browser by tensorflow javascript framework without the need of expensive sensors at all. The game detects player hands in a video and analyse the movement of the player to control a snake. The easiest way to control the snake is just act like to drive a car. For anyone interesting on this check out the sourcecode on ngx-client/app/src/assets/js/CWebcamController.js
 
 ## How to play
 
 please check here [http://neo.game/works_details_en.html#128](http://neo.game/works_details_en.html#128)
 
 Or go to testnet.cyptosnake.webcam for the early version of this game (please make sure that you have enable load unsafe script at your browser due to the backend API is not yet setup SSL).
 
 
 ## Installation
 
The installation uses 4 components to install at your own private environment 

1. flask-api - A REST API server that connects the system to the NEO blockchain network.
2. ngx-client - A HTML5 game based in Angular and Creative.js + tensorflow.js on body tracking module.
3. smart-contracts - Smart contract based on neo-boa and neo-python contains NEP-5 token names Snake Coin & extension logic for betting between players.
 
For offline playing, only need ngx-client to runs as following
 
```
npm install
```

```
npm start
```

Prior to the API server & smart contract deployment, you need to have a NEO privatenet in-place either docker or full-node please check on NEO official guide on private network deployment.

Then you need to install python-sdk from [https://github.com/CityOfZion/neo-python](https://github.com/CityOfZion/neo-python) then navigate to your neo-python folder and run 

```
mkdir api
```
```
cp (from the package) api/
```
```
python3.6 server.py
```
It is advising to runs the game for experiment only while the production should considering to use nginx or apache instead.

 ## Issues
 
 1. Q: Why my snake is so slow? A: The game detects your body movement in the browser with webgl you need to have a high-performance GPU on your PC or notebook for the best experience.
 2. Q: Is my identity is private? A: Yes, your privatenet is keep privately inside a browser local storage, you may export it somewhere and signoff to ensure your wallet is safe.

