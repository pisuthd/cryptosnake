function CTutorial(oData) {

  var _oCursorLeftHand;
  var _oCursorRightHand;

  var _oContainerEdges;
  var s_oScrollStage;
  var _oBg;
  var _pStartScroll;
  var _oPlayerSnake;
  var _oCoins;
  var _iSection;
  var _fRotationDir;
  var _aSnakes;
  var _oEdges;
  var _oSection;
  var _iPlayerSpeed;

  var _fLerpCamera = LERP_RATE;

  var _oMsgAccessWebcam;

  var _oWebcamController;

  var _bStartGame = false;

  var _iGameState = STATE_INIT;


  this._init = function () {
    _oContainerEdges = new createjs.Container();
    s_oScrollStage = new createjs.Container();
    s_oStage.addChild(s_oScrollStage);
    _oBg = new CBackground(s_oScrollStage);

    _aSnakes = new Array();


    setVolume("soundtrack", 0.4);
    _iSection = 0;
    _fRotationDir = 0;
    _oEdges = new CEdges(_oContainerEdges);
    _oSection = new CManageSections();

    _oCoins = new CManageCoins(s_oScrollStage, 'tutorial');



    _oCursorLeftHand = new createjs.Shape();
    _oCursorLeftHand.graphics.beginFill("red").drawCircle(0, 0, 5);
    _oCursorLeftHand.x = CANVAS_WIDTH / 3;
    _oCursorLeftHand.y = CANVAS_HEIGHT / 2;
    s_oStage.addChild(_oCursorLeftHand);

    _oCursorRightHand = new createjs.Shape();
    _oCursorRightHand.graphics.beginFill("red").drawCircle(0, 0, 5);
    _oCursorRightHand.x = CANVAS_WIDTH - (CANVAS_WIDTH / 3);
    _oCursorRightHand.y = CANVAS_HEIGHT / 2;

    s_oStage.addChild(_oCursorRightHand);

    _iPlayerSpeed = HERO_SPEED;


    this.createPlayerSnake();


    this.resetCameraOnPlayer();

    _pStartScroll = {
      xMax: SCROLL_LIMIT.xMax,
      xMin: SCROLL_LIMIT.xMin,
      yMax: SCROLL_LIMIT.yMax,
      yMin: SCROLL_LIMIT.yMin
    };

    s_oScrollStage.addChild(_oContainerEdges);


    _oMsgAccessWebcam = new createjs.Container();
    _oMsgAccessWebcam.x = (CANVAS_WIDTH / 2) - 180;
    _oMsgAccessWebcam.y = (CANVAS_HEIGHT / 2) - 300

    _oMsgBox = createBitmap(s_oSpriteLibrary.getSprite('message_box'));
    _oMsgAccessWebcam.addChild(_oMsgBox);

    var oText1Back = new createjs.Text("Loading...", "20px " + FONT_GAME, "black");
    oText1Back.textAlign = "center";
    oText1Back.x = 180
    oText1Back.y = 50

    oText1Back.outline = 2;
    _oMsgAccessWebcam.addChild(oText1Back);


    var oText2Back = new createjs.Text("Please allow access to your webcam", "18px " + FONT_GAME, "black");
    oText2Back.textAlign = "center";
    oText2Back.x = 180
    oText2Back.y = 80
    _oMsgAccessWebcam.addChild(oText2Back);


    s_oStage.addChild(_oMsgAccessWebcam);



    _oWebcamController = new CWebcamController('tutorial');


    _oFade = new createjs.Shape();
    _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    s_oStage.addChild(_oFade);

    createjs.Tween.get(_oFade).to({
      alpha: 0
    }, MS_FADE_TIME, createjs.Ease.cubicOut).call(function () {
      _oFade.visible = false;
    });

  }


  this.circleToCircleCollision = function (oPos1, oPos2, iDim1, iDim2) {
    var fDistance = distance(oPos1, oPos2);
    var fDim = iDim1 + iDim2;
    if (fDim > fDistance) {
      return true;
    }
    return false;
  };

  this.getSnakesArray = function () {
    return _aSnakes;
  };



  this.manageCollision = function () {
    this.snakeSection();
    this.snakeFoodsCollision();
    this.snakeEdgesCollision();

    this.snakesCollisions();
  };

  this.snakesCollisions = function () {
    /*
    for (var i = 0; i < _aEnemySnakes.length; i++) {
      this.snakesHeadHeadCollision(_oPlayerSnake, _aEnemySnakes[i]);
      this.snakesHeadQueueCollision(_oPlayerSnake, _aEnemySnakes[i]);
    }
    */
  };

  this.snakeFoodsCollision = function () {
    for (var i = 0; i < _aSnakes.length; i++) {
      var aFoods = _oSection.getSectionByID(_aSnakes[i].getSectionID()).getFoodsSection();
      for (var j = 0; j < aFoods.length; j++) {
        this.snakeOpenMounth(_aSnakes[i], aFoods[j]);
        if (!aFoods[j].getEaten()) {
          var oPos = _aSnakes[i].getPos();
          oPos.y += EATEN_OFFSET_DETECT * _aSnakes[i].getDir().getY();
          oPos.x += EATEN_OFFSET_DETECT * _aSnakes[i].getDir().getX();
          if (this.circleToCircleCollision(oPos, aFoods[j].getPos(), SNAKES_TOKEN_RADIUS_FOOD_DETECT, aFoods[j].getDim().w)) {
            this.snakeEatenFood(_aSnakes[i], aFoods[j]);
          }
        }
      }
    }
  };

  this.snakeEatenFood = function (oSnake, oFood) {
    if (oSnake.getType() === PLAYER) {
      this.updateScoreFood();
      oSnake.eatingSound();
    }
    oSnake.setTarget({
      result: false
    });
    oFood.setEaten(true);
    oFood.eatenAnim(oSnake.getPos());
    oSnake.eatenEffect();
    /*
    for (var i = 0; i < _aEnemySnakes.length; i++) {
      if (oSnake.getType() === ENEMY_SNAKES[i] && oSnake.getLengthQueue() >= MAX_AI_QUEUE_LENGTH) {
        return;
      }
    }
    */
  };

  this.updateScoreFood = function () {
    //_iScore++;
    //_oInterface.refreshScore(_iScore);
    // if (_iScore > _iBestScore) {
    //  _iBestScore = _iScore;
    //  _oInterface.refreshBestScore(_iBestScore, true);
    //}
  };



  this.snakeOpenMounth = function (oSnake, oFood) {
    var bFound = false;
    if (!oFood.getEaten()) {
      var oPos = oSnake.getPos();
      oPos.y += MOUNTH_OFFSET_DETECT * oSnake.getDir().getY();
      oPos.x += MOUNTH_OFFSET_DETECT * oSnake.getDir().getX();
      if (this.circleToCircleCollision(oPos, oFood.getPos(), oSnake.getOpenMounthDim().h, oFood.getDim().w)) {
        bFound = true;
      }
    }
    this.actionOpenMounth(oSnake, bFound);
  };

  this.actionOpenMounth = function (oSnake, bFound) {
    if (bFound) {
      if (oSnake.getCurrentAnimation() !== "open" && oSnake.getCurrentAnimation() !== "remain_open" && oSnake.getCurrentAnimation() !== "damage_close") {
        if (oSnake.getCurrentAnimation() === "remain_damage") {
          oSnake.changeState("damage_close");
        } else {
          oSnake.changeState("open");
        }
      }
    } else {
      if (oSnake.getCurrentAnimation() === "open" || oSnake.getCurrentAnimation() === "remain_open") {
        oSnake.changeState("close");
      }
    }
  };

  this.snakeSection = function () {
    var aSections = _oSection.getSections();
    for (var i = 0; i < _aSnakes.length; i++) {
      for (var j = 0; j < aSections.length; j++) {
        if (aSections[j].getRect().intersects(_aSnakes[i].getRectangle())) {
          _aSnakes[i].setSectionID(aSections[j].getID());
          break;
        }
      }
    }
  };

  this.snakeEdgesCollision = function () {
    var aEdgesCol = _oEdges.getRectangles();
    for (var j = 0; j < _aSnakes.length; j++) {
      for (var i = 0; i < aEdgesCol.length; i++) {
        if (aEdgesCol[i].rect.intersects(_aSnakes[j].getRectangle())) {
          _aSnakes[j].bounce(aEdgesCol[i].normal);
        }
      }
    }
  };




  this._updatePlay = function () {
    if (_bStartGame) {
      _oPlayerSnake.update(_iPlayerSpeed);
      this.scrollStage(_oPlayerSnake, _iPlayerSpeed);

      _oCoins.update();

      this.manageCollision();

      //_oAiSnakes.update();

    }
  }

  this.update = function () {
    switch (_iGameState) {
      case STATE_INIT:
        _oWebcamController.detectPose()
        /*
          if (s_oHelp !== null) {
            s_oHelp.update();
          }
          */
        break;
      case STATE_PLAY:
        this._updatePlay();
        _oWebcamController.detectPose()
        break;
      case STATE_FINISH:

        break;
    }
  };

  this.resetCameraOnPlayer = function () {
    s_oScrollStage.x += _oPlayerSnake.getDir().getX() * HERO_SPEED + (PLAYER_CAMERA_OFFSET.x - _oPlayerSnake.getLocalPos().x);
    s_oScrollStage.y += _oPlayerSnake.getDir().getY() * HERO_SPEED + (PLAYER_CAMERA_OFFSET.y - _oPlayerSnake.getLocalPos().y);
  };

  this.hasHand = function (event) {
    let hasHand = false

    for (let r of event) {
      if (r.part == 'leftWrist') {
        hasHand = true
        break
      } else if (r.part == 'rightWrist') {
        hasHand = true
        break
      }
    }


    return hasHand
  }

  this.onKeyReleased = function () {
    _bKeyDown = false;
  };

  this.findAngle = function (cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }


  this.getHandAngle = function (event) {
    let angle = 0;

    let totalParts = 0;
    let leftPos
    let rightPos
    for (let r of event) {
      if (r.part == 'leftWrist') {
        _oCursorLeftHand.x = r.position.x * 4
        _oCursorLeftHand.y = r.position.y * 4
        leftPos = {
          x: r.position.x * 4,
          y: r.position.y * 4
        }

        totalParts += 1
      } else if (r.part == 'rightWrist') {

        _oCursorRightHand.x = r.position.x * 4
        _oCursorRightHand.y = r.position.y * 4
        rightPos = {
          x: r.position.x * 4,
          y: r.position.y * 4
        }
        totalParts += 1
      }
    }

    if (totalParts == 2) {
      angle = this.findAngle(leftPos.x, leftPos.y, rightPos.x, rightPos.y)
    }

    return angle
  };

  this.onMove = function (event) {
    if (this.hasHand(event)) {
      let angle = this.getHandAngle(event)
      if (angle > 0) {
        angle -= 180;
      } else if (angle < 0) {
        angle += 180
      }

      if (angle != 0) {
        _oPlayerSnake.rotation(angle)
      } else {
        this.onKeyReleased();
      }

    } else {
      this.onKeyReleased();
    }
  }

  this.scrollStage = function (oFollow) {
    s_oScrollStage.x += oFollow.getDir().getX() * HERO_SPEED + (PLAYER_CAMERA_OFFSET.x - oFollow.getLocalPos().x) * _fLerpCamera;
    s_oScrollStage.y += oFollow.getDir().getY() * HERO_SPEED + (PLAYER_CAMERA_OFFSET.y - oFollow.getLocalPos().y) * _fLerpCamera;

    if (s_oScrollStage.x < _pStartScroll.xMin) {
      s_oScrollStage.x = _pStartScroll.xMin;
    } else if (s_oScrollStage.x > _pStartScroll.xMax) {
      s_oScrollStage.x = _pStartScroll.xMax;
    }

    if (s_oScrollStage.y < _pStartScroll.yMin) {
      s_oScrollStage.y = _pStartScroll.yMin;
    } else if (s_oScrollStage.y > _pStartScroll.yMax) {
      s_oScrollStage.y = _pStartScroll.yMax;
    }
  };

  this.createPlayerSnake = function () {
    var iType = PLAYER;
    var oSpritePlayer = s_oSpriteLibrary.getSprite('snake_head_' + iType);
    _oPlayerSnake = new CSnake(HERO_START_X, HERO_START_Y, oSpritePlayer, iType, START_QUEUE_SNAKES[iType], null, s_oScrollStage);
    _aSnakes.push(_oPlayerSnake);
  };


  this._onButtonNextRelease = function () {
    s_oStage.removeChild(_oGroup);
    _bStartGame = true;

    _iGameState = STATE_PLAY;

    _oGroup = new createjs.Container();
    _oGroup.x = (CANVAS_WIDTH / 2) - 180;
    _oGroup.y = (CANVAS_HEIGHT / 2) - 300


    _oMsgBox = createBitmap(s_oSpriteLibrary.getSprite('message_box'));
    _oGroup.addChild(_oMsgBox);

    var oText1Back = new createjs.Text("Keep your both hands at the same level to move", "14px " + FONT_GAME, "black");
    oText1Back.textAlign = "center";
    oText1Back.x = 180
    oText1Back.y = 40
    _oGroup.addChild(oText1Back);

    var oText2Back = new createjs.Text("a snake forward, lift left hand up to turn right", "14px " + FONT_GAME, "black");
    oText2Back.textAlign = "center";
    oText2Back.x = 180
    oText2Back.y = 60
    _oGroup.addChild(oText2Back);

    var oText3Back = new createjs.Text("Lift an opposite to turn left like to drive a car.", "14px " + FONT_GAME, "black");
    oText3Back.textAlign = "center";
    oText3Back.x = 180
    oText3Back.y = 80
    _oGroup.addChild(oText3Back);

    var oSprite = s_oSpriteLibrary.getSprite('button_box');
    var oButtonNext = new CTextButton(200, 200, oSprite, "Next", "Arial", "white", 32, _oGroup);
    oButtonNext.setVisible(true);

    oButtonNext.addEventListener(ON_MOUSE_UP, this._onButtonNext2Release, this);
    s_oStage.addChild(_oGroup)
  }

  this._onButtonNext2Release = function () {
    s_oStage.removeChild(_oGroup);
    _oCoins.foodsInSections();


    _oGroup = new createjs.Container();
    _oGroup.x = (CANVAS_WIDTH / 2) - 180;
    _oGroup.y = (CANVAS_HEIGHT / 2) - 300


    _oMsgBox = createBitmap(s_oSpriteLibrary.getSprite('message_box'));
    _oGroup.addChild(_oMsgBox);

    var oText1Back = new createjs.Text("We now put some of fruit for you, keep pratice", "14px " + FONT_GAME, "black");
    oText1Back.textAlign = "center";
    oText1Back.x = 180
    oText1Back.y = 40
    _oGroup.addChild(oText1Back);

    var oText2Back = new createjs.Text("Solo mode provides NEO NEP-5 token to collect", "14px " + FONT_GAME, "black");
    oText2Back.textAlign = "center";
    oText2Back.x = 180
    oText2Back.y = 60
    _oGroup.addChild(oText2Back);

    var oText3Back = new createjs.Text("and real fun with real enemies.", "14px " + FONT_GAME, "black");
    oText3Back.textAlign = "center";
    oText3Back.x = 180
    oText3Back.y = 80
    _oGroup.addChild(oText3Back);


    var oSprite = s_oSpriteLibrary.getSprite('button_box');
    var oButtonNext = new CTextButton(200, 200, oSprite, "Close", "Arial", "white", 32, _oGroup);
    oButtonNext.setVisible(true);

    oButtonNext.addEventListener(ON_MOUSE_UP, this._onButtonCloseRelease, this);


    s_oStage.addChild(_oGroup)

  }


  this.unpause = function (bVal) {
    _bStartGame = bVal;
    createjs.Ticker.paused = !bVal;
  };

  this._onButtonCloseRelease = function () {
    _oFade.visible = true;
    createjs.Tween.get(_oFade, {
      ignoreGlobalPause: true
    }).to({
      alpha: 1
    }, MS_FADE_TIME, createjs.Ease.cubicOut).call(function () {
      s_oTutorial.unpause(true);
      s_oTutorial.unload();

      
      
      //console.dir(_oWebcamController.video)


      playExistingSound("soundtrack");
      setVolume("soundtrack", 1);
      s_oMain.gotoMenu();
    });
  }

  var _oGroup;
  var _oFade;
  var _oMsgBox;


  this.showTutorialPanel = function (msg) {
    _oMsgAccessWebcam.removeAllChildren()
    s_oStage.removeChild(_oMsgAccessWebcam);


    _oGroup = new createjs.Container();
    _oGroup.x = (CANVAS_WIDTH / 2) - 180;
    _oGroup.y = (CANVAS_HEIGHT / 2) - 300

    _oMsgBox = createBitmap(s_oSpriteLibrary.getSprite('message_box'));
    _oGroup.addChild(_oMsgBox);

    if (msg.status == 1) {
      var oText1Back = new createjs.Text("Congrats! You should see red cursors at the screen.", "14px " + FONT_GAME, "black");
      oText1Back.textAlign = "center";
      oText1Back.x = 180
      oText1Back.y = 40
      _oGroup.addChild(oText1Back);

      var oText2Back = new createjs.Text("Move your hands around to controlling cursors and", "14px " + FONT_GAME, "black");
      oText2Back.textAlign = "center";
      oText2Back.x = 180
      oText2Back.y = 60
      _oGroup.addChild(oText2Back);

      var oText3Back = new createjs.Text("stand up from your seat for a better experience.", "14px " + FONT_GAME, "black");
      oText3Back.textAlign = "center";
      oText3Back.x = 180
      oText3Back.y = 80
      _oGroup.addChild(oText3Back);

      var oSprite = s_oSpriteLibrary.getSprite('button_box');
      var oButtonNext = new CTextButton(200, 200, oSprite, "Next", "Arial", "white", 32, _oGroup);
      oButtonNext.setVisible(true);
      oButtonNext.addEventListener(ON_MOUSE_UP, this._onButtonNextRelease, this);


    } else if (msg.status == 2) {
      // show error
      var oText1Back = new createjs.Text("Error", "32px " + FONT_GAME, "red");
      oText1Back.textAlign = "center";
      oText1Back.x = 180
      oText1Back.y = 40

      oText1Back.outline = 2;
      _oGroup.addChild(oText1Back);

      if (msg.cause) {
        var oText2Back = new createjs.Text(msg.cause, "14px " + FONT_GAME, "red");
        oText2Back.textAlign = "center";
        oText2Back.x = 180
        oText2Back.y = 80

        _oGroup.addChild(oText2Back);
      }

    }

    s_oStage.addChild(_oGroup)


  }
  this.unload = function () {
    s_oStage.removeChild(_oGroup);
    stopSound("soundtrack");

    s_oWebcamController = null
    s_oStage.removeAllChildren();
    createjs.Tween.removeAllTweens();
    s_oTutorial = null;

  }


  s_oTutorial = this;

  HERO_ROT_SPEED = oData.hero_rotation_speed;
  HERO_SPEED = oData.hero_speed;
  HERO_SPEED_UP = oData.hero_speed_up;
  FOOD_SCORE = oData.food_score;
  SNAKES_AI_SPEED = oData.snakes_AI_speed;


  this._init();

}
var s_oTutorial;


function CWebcamController(access_type) {
  var video;
  var net;
  var count = 0


  var onDetecting = false;
  this._init = function () {
    this.bindWebcam();



  }

  this.unload = function () {
    video.srcObject.stop()
    video = null;
    net = null;

    s_oWebcamController = null;


  };

  async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video = document.getElementById('video');
    video.width = CANVAS_WIDTH / 4;
    video.height = CANVAS_HEIGHT / 4;


    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user'
      },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }

  async function loadVideo() {
    const video = await setupCamera();
    video.play();

    return video;
  }




  this.detectPose = function () {
    if (!video || !net) {

      return
    }
    if (onDetecting) {

      return
    }
    count += 1;
    // detect twice a second
    if (count % (FPS * 0.75) == 1) {

    } else {
      count = 0
      return
    }

    const flipHorizontal = true;


    async function poseDetectionFrame() {
      const imageScaleFactor = 0.5;
      const outputStride = 16;
      onDetecting = true
      let poses = [];
      let singlePoseDetection = {
        minPoseConfidence: 0.1,
        minPartConfidence: 0.5,
      };

      const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
      poses.push(pose);

      onDetecting = false;
      poses.forEach(({
        score,
        keypoints
      }) => {

        if (score >= singlePoseDetection.minPoseConfidence) {

          let result = []
          for (let k of keypoints) {

            if (k.part == 'leftWrist' || k.part == 'rightWrist') {
              if (k.score >= singlePoseDetection.minPartConfidence) {
                result.push(k);
              }
            }
          }
          if (result.length > 0) {
            if (access_type == 'tutorial') {
              s_oTutorial.onMove(result)
            } else {
              s_oGame.onMove(result)
            }

          }
        }

      });

    }

    poseDetectionFrame();

  }

  this.bindWebcam = async function () {

    net = await posenet.load(0.75);
    let message = {
      status: 0,
      cause: ''
    }
    try {
      video = await loadVideo();
      message.status = 1
    } catch (e) {
      message.status = 2
      message.cause = 'this browser does not support video capture,'
     

    }
    

    if (access_type == 'tutorial') {
      s_oTutorial.showTutorialPanel(message);
    } else {
      s_oGame.startGame(message);
    }

  }




  s_oWebcamController = this;


  this._init();

  return this;

}


var s_oWebcamController
