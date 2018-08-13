function CArena(oData) {
  var _pStartScroll;
  var _oPlayerSnake;
  var _oBg;
  var _oInterface;
  var _oEndPanel = null;
  var _oFade;
  var _oCoins;
  var _oEdges;
  var _oAiSnakes;
  var _oSection;
  var _oContainerEdges;
  var _bStartGame = false;
  var _iCoin;
  var _iGameState = STATE_INIT;
  var _iSection;
  var _iVelocityStep;
  var _iPlayerSpeed;
  var _iBalance;
  var _WorldRecord;
  var _aEnemySnakes;
  var _aSnakes;
  var _fRotationDir;
  var _fLerpCamera = LERP_RATE;
  var _oHitArea;


  var _oCursorLeftHand;
  var _oCursorRightHand;


  var _oMsgAccessWebcam;
  var _oWebcamController;
  var _bStartGame = false;


  this._init = function () {
    _oContainerEdges = new createjs.Container();
    s_oScrollStage = new createjs.Container();
    s_oStage.addChild(s_oScrollStage);
    _oBg = new CBackground(s_oScrollStage);

    _iCoin = 0;

    _aSnakes = new Array();
    _aEnemySnakes = new Array();

    setVolume("soundtrack", 0.4);

    _iVelocityStep = 0;

    _iSection = 0;

    _fRotationDir = 0;

    _oEdges = new CEdges(_oContainerEdges);

    _oSection = new CManageSections();


    _oCoins = new CManageCoins(s_oScrollStage, 'arena');

    _oAiSnakes = new CControlAiSnakes();

    _iPlayerSpeed = HERO_SPEED;


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

    this.createPlayerSnake();

    _iCoin = 0;

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



    _oWebcamController = new CWebcamController('arena');


    this.addEnemySnakes();


    _oInterface = new CInterface();
    _oInterface.refreshScore(0);
    _oInterface.refreshBestScore(0, false);

    _oFade = new createjs.Shape();
    _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    s_oStage.addChild(_oFade);

    createjs.Tween.get(_oFade).to({
      alpha: 0
    }, MS_FADE_TIME, createjs.Ease.cubicOut).call(function () {
      _oFade.visible = false;
    });

  }

  this.resetCameraOnPlayer = function () {
    s_oScrollStage.x += _oPlayerSnake.getDir().getX() * HERO_SPEED + (PLAYER_CAMERA_OFFSET.x - _oPlayerSnake.getLocalPos().x);
    s_oScrollStage.y += _oPlayerSnake.getDir().getY() * HERO_SPEED + (PLAYER_CAMERA_OFFSET.y - _oPlayerSnake.getLocalPos().y);
  };

  this.unload = function () {
    _bStartGame = false;
    stopSound("soundtrack");


    s_oWebcamController = null
    s_oStage.removeAllChildren();
    createjs.Tween.removeAllTweens();
    s_oGame = null;
    _oInterface.unload();

  };

  this.createPlayerSnake = function () {
    var iType = PLAYER;
    var oSpritePlayer = s_oSpriteLibrary.getSprite('snake_head_' + iType);
    _oPlayerSnake = new CSnake(HERO_START_X, HERO_START_Y, oSpritePlayer, iType, START_QUEUE_SNAKES[iType], null, s_oScrollStage);
    _aSnakes.push(_oPlayerSnake);
  };

  this.addEnemySnakes = function () {
    var iID = 0;
    for (var i = 0; i < AI_SNAKES.length; i++) {
      var iType = AI_SNAKES[i].type;
      var oSpriteSnake1 = s_oSpriteLibrary.getSprite('snake_head_' + iType);
      var oEnemySnake = new CSnake(AI_SNAKES[i].x, AI_SNAKES[i].y, oSpriteSnake1, iType, START_QUEUE_SNAKES[iType], iID, s_oScrollStage);
      _aEnemySnakes.push(oEnemySnake);
      _aSnakes.push(oEnemySnake);

      _oAiSnakes.addSnakeToAI(oEnemySnake);
      iID++;
    }
  };
  this.onRestart = function () {
    _fRotationDir = 0;
    this.unloadASnake(_oPlayerSnake);
    for (var i = 0; i < _aEnemySnakes.length; i++) {
      this.unloadASnake(_aEnemySnakes[i]);
      _oAiSnakes.removeSnakeByID(i);
    }
    _aSnakes = new Array();
    _aEnemySnakes = new Array();

    _oAiSnakes.reset();

    this.createPlayerSnake();

    this.scrollStage(_oPlayerSnake, _iPlayerSpeed);

    _fLerpCamera = 0.1;
    createjs.Tween.get(this).wait(750).call(function () {
      _fLerpCamera = LERP_RATE;
    });


    this.addEnemySnakes();

    _iCoin = 0
    _oInterface.refreshScore(0);
    playExistingSound("soundtrack");

    s_oScrollStage.setChildIndex(_oContainerEdges, s_oScrollStage.numChildren - 1);

    _oFoods.restoresAllEatenFood();
    _iGameState = STATE_PLAY;
    s_oGame.unpause(true);


  }

  this.unloadASnake = function (oSnake) {
    oSnake.unloadQueue();
    oSnake.unload();
  };

  this.getPlayerSnake = function () {
    return _oPlayerSnake;
  };

  this.getSnakesArray = function () {
    return _aSnakes;
  };

  this.onLeft = function () {
    if (_oPlayerSnake.getEaten()) {
      return;
    }
    _bKeyDown = true;

    _fRotationDir = -HERO_ROT_SPEED;
  };

  this.onRight = function () {
    if (_oPlayerSnake.getEaten()) {
      return;
    }
    _bKeyDown = true;

    _fRotationDir = HERO_ROT_SPEED;
  };


  this.onExit = function () {
    _oFade.visible = true;
    createjs.Tween.get(_oFade, {
      ignoreGlobalPause: true
    }).to({
      alpha: 1
    }, MS_FADE_TIME, createjs.Ease.cubicOut).call(function () {
      s_oGame.unpause(true);
      s_oGame.unload();
      
      playExistingSound("soundtrack");
      setVolume("soundtrack", 1);
      s_oMain.gotoMenu();
    });
  };


  this.updateScrollLimit = function (iNewX, iNewY) {
    _pStartScroll.xMax = SCROLL_LIMIT.xMax + iNewX;
    _pStartScroll.xMin = SCROLL_LIMIT.xMin - iNewX;
    _pStartScroll.yMax = SCROLL_LIMIT.yMax + iNewY;
    _pStartScroll.yMin = SCROLL_LIMIT.yMin - iNewY;

  };


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

  this.cutQueueAt = function (oSnake1, iQueueCol) {
    oSnake1.cutQueueAtPoint(iQueueCol);
  };
  this.unpause = function (bVal) {
    _bStartGame = bVal;
    createjs.Ticker.paused = !bVal;
  };
  this.snakeCloseMounthAnim = function (oSnake) {
    oSnake.changeState("close");
    oSnake.setIgnoreAnim(true);
    oSnake.onAnimationEnd();
  };

  this.manageCollision = function () {
    this.snakeSection();
    this.snakeFoodsCollision();
    this.snakeEdgesCollision();

    this.snakesCollisions();
  };

  this.snakesCollisions = function () {
    for (var i = 0; i < _aEnemySnakes.length; i++) {
      this.snakesHeadHeadCollision(_oPlayerSnake, _aEnemySnakes[i]);
      this.snakesHeadQueueCollision(_oPlayerSnake, _aEnemySnakes[i]);
    }
  };

  this.snakesHeadHeadCollision = function (oPlayerSnake, oEnemySnake) {
    if (oPlayerSnake.getEaten()) {
      return;
    }
    this.snakeOpenMounth(oPlayerSnake, oEnemySnake);
    if (this.circleToCircleCollision(oPlayerSnake.getPos(), oEnemySnake.getPos(), oPlayerSnake.getDim().h, oEnemySnake.getDim().h)) {

      oPlayerSnake.die();
      createjs.Tween.get(this).wait(MS_TIME_SHOW_WIN_PANEL).call(this.onDiePlayerSnake);

    }
  };


  this.snakesHeadQueueCollision = function (oSnake1, oSnake2) {
    if (oSnake2.getTarget().target !== AI_PLAYER || oSnake1.getEaten()) {
      return;
    }
    var aQueue1 = oSnake1.getQueue();
    for (var j = aQueue1.length - 2; j > 0; j--) {
      this.snakeOpenMounth(oSnake2, aQueue1[j]);
      if (this.circleToCircleCollision(aQueue1[j].getPos(), oSnake2.getPos(), aQueue1[j].getDim().h, oSnake2.getDim().w)) {
        this.cutQueueAt(oSnake1, j);
        if (oSnake1.getCurrentAnimation() !== "damage_open" && oSnake1.getCurrentAnimation() !== "remain_damage") {
          oSnake1.changeState("damage_open");
        }
        oSnake2.getSubAI().setFollowTime(oSnake2.getSubAI().getFollowTime() - MS_DECREASE_TIME_EATEN_QUEUE);
        oSnake1.screamingSound();
        this.snakeCloseMounthAnim(oSnake2);
        _iCoin = oSnake1.getLengthQueue();
        _oInterface.refreshScore(_iCoin);
        break;
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
    for (var i = 0; i < _aEnemySnakes.length; i++) {
      if (oSnake.getType() === ENEMY_SNAKES[i] && oSnake.getLengthQueue() >= MAX_AI_QUEUE_LENGTH) {
        return;
      }
    }
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

  this.circleToCircleCollision = function (oPos1, oPos2, iDim1, iDim2) {
    var fDistance = distance(oPos1, oPos2);
    var fDim = iDim1 + iDim2;
    if (fDim > fDistance) {
      return true;
    }
    return false;
  };

  this.onDiePlayerSnake = function () {
    stopSound("soundtrack");
    _oInterface.createEndPanel(_iCoin);
  };

  this.onDieEnemySnake = function (iID) {
    _aEnemySnakes.splice(iID, 1);
    _oAiSnakes.removeSnakeByID(iID);
  };

  this.updateScoreFood = function () {
    _iCoin++;
    _oInterface.refreshScore(_iCoin);
    //if (_iScore > _iBestScore) {
    // _iBestScore = _iScore;
    //_oInterface.refreshBestScore(_iBestScore, true);
    //}
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
  this.hasHand = function (event) {
    let hasHand = false

    for (let r of event) {
      if (r.part == 'leftWrist' || r.part == 'rightWrist') {
        hasHand = true
        break
      }

    }


    return hasHand
  }

  this.onKeyReleased = function () {
    _bKeyDown = false;
  };

  this.startGame = function (msg) {
    _oMsgAccessWebcam.removeAllChildren()
    s_oStage.removeChild(_oMsgAccessWebcam);



    _oGroup = new createjs.Container();
    _oGroup.x = (CANVAS_WIDTH / 2) - 180;
    _oGroup.y = (CANVAS_HEIGHT / 2) - 300


    console.log(msg)
    if (msg.status == 2) {
      // show error
      // show error


      _oMsgBox = createBitmap(s_oSpriteLibrary.getSprite('message_box'));
      _oGroup.addChild(_oMsgBox);
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

    } else {
      console.log('start game now')
      // start game
      var oSprite = s_oSpriteLibrary.getSprite('button_box');
      var oButtonNext = new CTextButton(200, 200, oSprite, "Go", "Arial", "white", 32, _oGroup);
      oButtonNext.setVisible(true);
      oButtonNext.addEventListener(ON_MOUSE_UP, this.onButtonGoRelease, this);



      //setTimeout(()=>{
      //s_oStage.removeChild(_oBottomText)
      //},3000)
    }
    s_oStage.addChild(_oGroup)

  }
  this.onButtonGoRelease = function () {
    if (_oGroup) {
      s_oStage.removeChild(_oGroup);
    }
    _bStartGame = true;
    _oCoins.foodsInSections();
    _iGameState = STATE_PLAY;


  }

  this._updatePlay = function () {
    if (_bStartGame) {


      _oPlayerSnake.update(_iPlayerSpeed);

      this.scrollStage(_oPlayerSnake, _iPlayerSpeed);

      _oCoins.update();

      this.manageCollision();

      _oAiSnakes.update();

    }
  };

  this.update = function () {
    switch (_iGameState) {
      case STATE_INIT:
        _oWebcamController.detectPose()
        break;
      case STATE_PLAY:
        this._updatePlay();
        _oWebcamController.detectPose()
        break;
      case STATE_FINISH:

        break;
    }
  };






  s_oGame = this;

  HERO_ROT_SPEED = oData.hero_rotation_speed;
  HERO_SPEED = oData.hero_speed;
  HERO_SPEED_UP = oData.hero_speed_up;
  FOOD_SCORE = oData.food_score;
  SNAKES_AI_SPEED = oData.snakes_AI_speed;


  this._init();
}
var s_oGame;
