function CMain(oData) {
  var _bUpdate;
  var _iCurResource = 0;
  var RESOURCE_TO_LOAD = 0;
  var _iState = STATE_LOADING;
  var _oData;

  var _oPreloader;
  var _oMenu;
  var _oTutorial;
  var _oHelp;
  var _oGame;

  this.initContainer = function () {
    var canvas = document.getElementById("canvas");
    s_oStage = new createjs.Stage(canvas);
    createjs.Touch.enable(s_oStage);
    s_oStage.preventSelection = false;

    s_bMobile = jQuery.browser.mobile;
    if (s_bMobile === false) {
      s_oStage.enableMouseOver(20);
      $('body').on('contextmenu', '#canvas', function (e) {
        return false;
      });
    }

    s_iPrevTime = new Date().getTime();

    createjs.Ticker.addEventListener("tick", this._update);
    createjs.Ticker.framerate = FPS;

    if (navigator.userAgent.match(/Windows Phone/i)) {
      DISABLE_SOUND_MOBILE = true;
    }

    s_oSpriteLibrary = new CSpriteLibrary();

    //ADD PRELOADER
    _oPreloader = new CPreloader();

    _bUpdate = true;
  };

  this.soundLoaded = function () {
    _iCurResource++;
    var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
    _oPreloader.refreshLoader(iPerc);
  };

  this._initSounds = function () {
    var aSoundsInfo = new Array();
    aSoundsInfo.push({
      path: './assets/sounds/',
      filename: 'snake_eating',
      loop: false,
      volume: 1,
      ingamename: 'snake_eating'
    });
    aSoundsInfo.push({
      path: './assets/sounds/',
      filename: 'click',
      loop: false,
      volume: 1,
      ingamename: 'click'
    });
    aSoundsInfo.push({
      path: './assets/sounds/',
      filename: 'game_over',
      loop: false,
      volume: 1,
      ingamename: 'game_over'
    });
    aSoundsInfo.push({
      path: './assets/sounds/',
      filename: 'snake_follow',
      loop: false,
      volume: 1,
      ingamename: 'snake_follow'
    });
    aSoundsInfo.push({
      path: './assets/sounds/',
      filename: 'scream',
      loop: false,
      volume: 1,
      ingamename: 'scream'
    });
    aSoundsInfo.push({
      path: './assets/sounds/',
      filename: 'soundtrack',
      loop: true,
      volume: 1,
      ingamename: 'soundtrack'
    });

    RESOURCE_TO_LOAD += aSoundsInfo.length;

    s_aSounds = new Array();
    for (var i = 0; i < aSoundsInfo.length; i++) {
      s_aSounds[aSoundsInfo[i].ingamename] = new Howl({
        src: [aSoundsInfo[i].path + aSoundsInfo[i].filename + '.mp3', aSoundsInfo[i].path + aSoundsInfo[i].filename + '.ogg'],
        autoplay: false,
        preload: true,
        loop: aSoundsInfo[i].loop,
        volume: aSoundsInfo[i].volume,
        onload: s_oMain.soundLoaded()
      });
    }

  };


  this._loadImages = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

    s_oSpriteLibrary.addSprite("but_play", "./assets/sprites/but_play.png");
    s_oSpriteLibrary.addSprite("but_exit", "./assets/sprites/but_exit.png");
    s_oSpriteLibrary.addSprite("msg_box", "./assets/sprites/msg_box.png");
    s_oSpriteLibrary.addSprite("bg_help", "./assets/sprites/bg_help.png");
    s_oSpriteLibrary.addSprite("audio_icon", "./assets/sprites/audio_icon.png");
    s_oSpriteLibrary.addSprite("arrow", "./assets/sprites/arrow.png");
    s_oSpriteLibrary.addSprite("but_home", "./assets/sprites/but_home.png");
    s_oSpriteLibrary.addSprite("but_restart", "./assets/sprites/but_restart.png");
    s_oSpriteLibrary.addSprite("bg_game", "./assets/sprites/bg_game.jpg");
    s_oSpriteLibrary.addSprite("food_0", "./assets/sprites/food_0.png");
    s_oSpriteLibrary.addSprite("coin_0", "./assets/sprites/coin_0.png");
    s_oSpriteLibrary.addSprite("but_pause", "./assets/sprites/but_pause.png");
    s_oSpriteLibrary.addSprite("but_continue", "./assets/sprites/but_continue.png");
    s_oSpriteLibrary.addSprite("but_yes", "./assets/sprites/but_yes.png");
    s_oSpriteLibrary.addSprite("but_not", "./assets/sprites/but_not.png");
    s_oSpriteLibrary.addSprite("but_info", "./assets/sprites/but_info.png");
    s_oSpriteLibrary.addSprite("logo_ctl", "./assets/sprites/logo_ctl.png");

    s_oSpriteLibrary.addSprite("button_tutorial", "./assets/sprites/button_tutorial.png");
    s_oSpriteLibrary.addSprite("button_register", "./assets/sprites/button_register.png");
    s_oSpriteLibrary.addSprite("button_login", "./assets/sprites/button_login.png");
    s_oSpriteLibrary.addSprite("button_start", "./assets/sprites/button_start.png");

    s_oSpriteLibrary.addSprite("message_box", "./assets/sprites/message_box.png");

    s_oSpriteLibrary.addSprite("button_box", "./assets/sprites/button_box.png");
    s_oSpriteLibrary.addSprite("arrow_key", "./assets/sprites/arrow_key.png");

    s_oSpriteLibrary.addSprite("edge_side_lr", "./assets/sprites/edge_side_lr.png");
    s_oSpriteLibrary.addSprite("edge_side_ud", "./assets/sprites/edge_side_ud.png");

   

    s_oSpriteLibrary.addSprite("logo", "./assets/sprites/logo-snake.png");
    s_oSpriteLibrary.addSprite("but_fullscreen", "./assets/sprites/but_fullscreen.png");



    for (var j = 1; j < 4; j++) {
      for (var i = 0; i < FRAMES_NUM_HELP[j]; i++) {
        s_oSpriteLibrary.addSprite("help_" + j + "_" + i, "./assets/sprites/help_" + j + "/help_" + j + "_" + i + ".jpg");
      }
    }

    for (var i = 0; i < SNAKE_TYPES; i++) {
      s_oSpriteLibrary.addSprite("snake_head_" + i, "./assets/sprites/snake_head_" + i + ".png");
      s_oSpriteLibrary.addSprite("snake_parts_" + i, "./assets/sprites/snake_parts_" + i + ".png");
    }
    RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
    s_oSpriteLibrary.loadSprites();
  };

  this._onImagesLoaded = function () {
    _iCurResource++;
    var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
    _oPreloader.refreshLoader(iPerc);
  };

  this._onAllImagesLoaded = function () {

  };

  this.preloaderReady = function () {
    this._loadImages();

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      this._initSounds();
    }


    _bUpdate = true;
  };

  this._onRemovePreloader = function () {
    _oPreloader.unload();

    s_oSoundTrack = playSound("soundtrack", 1, true);

    this.gotoMenu();
  };


  this.gotoTutorial = function () {
    _oTutorial = new CTutorial(_oData);
    _iState = STATE_TUTORIAL;
  }

  this.gotoMenu = function () {
    _oMenu = new CMenu(self);
    _iState = STATE_MENU;
  };

  this.gotoGame = function () {
    _oGame = new CGame(_oData);

    _iState = STATE_GAME;
  };

  this.gotoHelp = function () {
    _oHelp = new CHelp();
    _iState = STATE_HELP;
  };

  this.stopUpdate = function () {
    _bUpdate = false;
    createjs.Ticker.paused = true;
    $("#block_game").css("display", "block");

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      Howler.mute(true);
    }

  };

  this.startUpdate = function () {
    s_iPrevTime = new Date().getTime();
    _bUpdate = true;
    createjs.Ticker.paused = false;
    $("#block_game").css("display", "none");

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      if (s_bAudioActive) {
        Howler.mute(false);
      }
    }

  };

  this._update = function (event) {
    if (_bUpdate === false) {
      return;
    }
    var iCurTime = new Date().getTime();
    s_iTimeElaps = iCurTime - s_iPrevTime;
    s_iCntTime += s_iTimeElaps;
    s_iCntFps++;
    s_iPrevTime = iCurTime;

    if (s_iCntTime >= 1000) {
      s_iCurFps = s_iCntFps;
      s_iCntTime -= 1000;
      s_iCntFps = 0;
    }

    if (_iState === STATE_GAME) {
      _oGame.update();

    } else if (_iState === STATE_TUTORIAL) {
      _oTutorial.update();
    } else if (_iState === STATE_MENU) {
      _oMenu.update();
    }

    s_oStage.update(event);

  };

  s_oMain = this;

  _oData = oData;
  ENABLE_CHECK_ORIENTATION = oData.check_orientation;
  ENABLE_FULLSCREEN = oData.fullscreen;

  this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_iSpeedBlock;

var s_oDrawLayer;
var s_oStage;
var s_oScrollStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_bFullscreen = false;
var s_aSounds;
