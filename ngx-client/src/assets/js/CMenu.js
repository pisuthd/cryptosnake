function CMenu() {
  var _pStartPosAudio;
  var _pStartPosPlay;
  var _pStartPosCredits;
  var _pStartPosFullscreen;

  var _oBg;
  var _oButPlay;
  var _oCreditsBut;
  var _oButtonLogin;
  var _oButtonCreateAccount;
  var _oButtonPlayGame;
  var _oFade;
  var _oAudioToggle;
  var _oAnimMenu;
  var _oContainerMenuGUI;
  var _oButFullscreen;
  var _fRequestFullScreen = null;
  var _fCancelFullScreen = null;

  var _wallet

  this._init = function () {
    _oBg = CBackground(s_oStage);

    _oContainerMenuGUI = new createjs.Container();
    _oContainerMenuGUI.alpha = 0;
    s_oStage.addChild(_oContainerMenuGUI);

    //var oSprite = s_oSpriteLibrary.getSprite('but_play');
    //_pStartPosPlay = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 200};
    //_oButPlay = new CGfxButton(_pStartPosPlay.x, _pStartPosPlay.y, oSprite, _oContainerMenuGUI);
    // _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
    //_oButPlay.pulseAnimation();





    //var oSprite = s_oSpriteLibrary.getSprite('button_box');
    //_oButPlay = new CTextButton(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 20, oSprite, "Start Game", "Arial", "white", 32, _oContainerMenuGUI);
    //_oButPlay.setVisible(true);
    //_oButPlay.addEventListener(ON_MOUSE_UP, this._onButtonTutorialRelease, this);




    var oSprite = s_oSpriteLibrary.getSprite('button_box');
    _oButTutorial = new CTextButton(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 100, oSprite, "Tutorial", "Arial", "white", 24, _oContainerMenuGUI);
    _oButTutorial.setVisible(true);
    _oButTutorial.addEventListener(ON_MOUSE_UP, this._onButtonTutorialRelease, this);


    var oSprite = s_oSpriteLibrary.getSprite('button_box');
    _oButTutorial = new CTextButton(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 180, oSprite, "Option", "Arial", "white", 24, _oContainerMenuGUI);
    _oButTutorial.setVisible(true);
    _oButTutorial.addEventListener(ON_MOUSE_UP, this._onButtonOptionRelease, this);


    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      var oSprite = s_oSpriteLibrary.getSprite('audio_icon');

      _pStartPosAudio = {
        x: (oSprite.height / 2) + 10,
        y: (oSprite.height / 2) + 10
      };
      _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, _oContainerMenuGUI);
      _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    }

    /*
    var oSpriteCredits = s_oSpriteLibrary.getSprite('but_info');
    _pStartPosCredits = {
      x: (oSpriteCredits.height / 2) + 10,
      y: (oSpriteCredits.height / 2) + 10
    };
    _oCreditsBut = new CGfxButton((CANVAS_WIDTH / 2), CANVAS_HEIGHT - 240, oSpriteCredits, _oContainerMenuGUI);
    _oCreditsBut.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
    */
    _oAnimMenu = new CAnimMenu(s_oStage);

    s_oStage.addChild(_oContainerMenuGUI);

    var doc = window.document;
    var docEl = doc.documentElement;
    _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (ENABLE_FULLSCREEN === false) {
      _fRequestFullScreen = false;
    }

    if (_fRequestFullScreen && screenfull.enabled) {
      oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
      _pStartPosFullscreen = {
        x: _pStartPosAudio.x + oSprite.width / 2 + 10,
        y: oSprite.height / 2 + 10
      };

      _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, _oContainerMenuGUI);
      _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
    }

    this._showAuthButtons()




    _oFade = new createjs.Shape();
    _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    s_oStage.addChild(_oFade);

    createjs.Tween.get(_oFade).to({
      alpha: 0
    }, MS_FADE_TIME, createjs.Ease.cubicOut).call(function () {
      _oFade.visible = false;
    });





    this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
  };

  var _oBottomText

  var _oBalanceText

  this._showAuthButtons = function () {
    if (_oButtonLogin) {
      _oButtonLogin.setVisible(false)
      _oContainerMenuGUI.removeChild(_oButtonLogin);
    }
    if (_oButtonCreateAccount) {

      _oButtonCreateAccount.setVisible(false)
      _oContainerMenuGUI.removeChild(_oButtonCreateAccount);
    }
    if (_oBottomText) {

      _oContainerMenuGUI.removeChild(_oBottomText);
    }





    if (_wallet == null) {
      if (this._hasNEP2Key()) {

        var oSprite = s_oSpriteLibrary.getSprite('button_box');
        _oButtonLogin = new CTextButton(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 20, oSprite, "Login", "Arial", "white", 24, _oContainerMenuGUI);
        _oButtonLogin.setVisible(true);
        _oButtonLogin.addEventListener(ON_MOUSE_UP, this._onButtonLoginRelease, this);
      } else {
        var oSprite = s_oSpriteLibrary.getSprite('button_box');
        _oButtonCreateAccount = new CTextButton(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 20, oSprite, "Create Wallet", "Arial", "white", 24, _oContainerMenuGUI);
        _oButtonCreateAccount.setVisible(true);
        _oButtonCreateAccount.addEventListener(ON_MOUSE_UP, this._onButtonCreateAccountRelease, this);


        _oBottomText = new createjs.Text("No wallet found, please either create your wallet or import an existing key.", "18px " + FONT_GAME, "white");
        _oBottomText.textAlign = "center";
        _oBottomText.x = CANVAS_WIDTH / 2
        _oBottomText.y = (CANVAS_HEIGHT / 2) + 240
        _oContainerMenuGUI.addChild(_oBottomText)
      }
    } else {
      var oSprite = s_oSpriteLibrary.getSprite('button_box');
      _oButtonLogin = new CTextButton(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + 20, oSprite, "Play Game", "Arial", "white", 24, _oContainerMenuGUI);
      _oButtonLogin.setVisible(true);
      _oButtonLogin.addEventListener(ON_MOUSE_UP, this._onButtonPlayGame, this);

      this._loadBalance()

    }

  }
  this._loadBalance = function () {
    window.angularComponentReference.zone.run(() => {
      window.angularComponentReference.componentFn('load_balance', this.onUpdateBalance);

    })
  }
  this.onUpdateBalance =  (balance)=> {
    //console.log('balance : ', balance)
    const bal = balance.balance/100000000
    _oBalanceText = new createjs.Text("Your Balance : "+bal+" SNK", "32px " + FONT_GAME, "white");
    _oBalanceText.textAlign = "left";
    _oBalanceText.x = CANVAS_WIDTH / 2 - 600
    _oBalanceText.y = (CANVAS_HEIGHT / 2) + 280
    _oContainerMenuGUI.addChild(_oBalanceText)
  }

  this._hasNEP2Key = function () {
    if (localStorage.getItem('nep2key')) {
      return true
    } else {
      return false
    }
  }

  this.onLogin = (result) => {
    console.log('wallet  : ', result);
    _wallet = result
    this._showAuthButtons()
  }

  this._onButtonPlayGame = function () {
    _oFade.visible = true;

    createjs.Tween.get(_oFade).to({
      alpha: 1
    }, MS_FADE_TIME, createjs.Ease.cubicOut).call(function () {
      s_oMenu.unload();
      s_oMain.gotoGame();
      $(s_oMain).trigger("start_session");
    });
  }

  this._onButtonLoginRelease = function () {
    window.angularComponentReference.zone.run(() => {
      window.angularComponentReference.componentFn('login', this.onLogin);

    })
  }
  this._onButtonCreateAccountRelease = function () {
    window.angularComponentReference.zone.run(() => {
      window.angularComponentReference.componentFn('create_account', this.onAccountCreated);

    })
  }
  this.onCallbackOption = (nep2key) => {
    if (nep2key == null) {
      localStorage.removeItem('nep2key')
    } else {
      localStorage.setItem('nep2key', nep2key);
    }

    this._showAuthButtons();
  }

  this.onAccountCreated = (nep2key) => {

    localStorage.setItem('nep2key', nep2key);

    this._showAuthButtons();


  }



  this.animContainerGUI = function () {
    createjs.Tween.get(_oContainerMenuGUI).to({
      alpha: 1
    }, 500, createjs.Ease.cubicOut);
  };

  this.refreshButtonPos = function (iNewX, iNewY) {
    //_oAudioToggle.setPosition(_pStartPosAudio.x + iNewX, iNewY + _pStartPosAudio.y);
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
    }
    if (_fRequestFullScreen && screenfull.enabled) {
      _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
    }
  };

  this.unload = function () {
    //_oButPlay.unload();
    //_oButPlay = null;
    //_oButtonLogin.unload();
    //_oButtonLogin = null;

    if (_oButtonLogin) {
      _oButtonLogin.unload();
      _oButtonLogin = null;
    }
    if (_oButtonCreateAccount) {
      _oButtonCreateAccount.unload();
      _oButtonCreateAccount = null;
    }


    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.unload();
      _oAudioToggle = null;
    }
    if (_fRequestFullScreen && screenfull.enabled) {
      _oButFullscreen.unload();
    }

    s_oStage.removeAllChildren();

    s_oMenu = null;
  };

  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
  };

  this._onCreditsBut = function () {
    new CCreditsPanel();
  };



  this._onButtonOptionRelease = function () {

    window.angularComponentReference.zone.run(() => {
      window.angularComponentReference.componentFn('show_option', this.onCallbackOption);

    })
  }



  this._onButtonTutorialRelease = function () {
    _oFade.visible = true;

    createjs.Tween.get(_oFade).to({
      alpha: 1
    }, MS_FADE_TIME, createjs.Ease.cubicOut).call(function () {
      s_oMenu.unload();
      s_oMain.gotoTutorial();
      $(s_oMain).trigger("start_session");
    });
  };

  this._onButPlayRelease = function () {
    _oFade.visible = true;

    createjs.Tween.get(_oFade).to({
      alpha: 1
    }, MS_FADE_TIME, createjs.Ease.cubicOut).call(function () {
      s_oMenu.unload();
      s_oMain.gotoGame();
      $(s_oMain).trigger("start_session");
    });
  };

  this.resetFullscreenBut = function () {
    if (_fRequestFullScreen && screenfull.enabled) {
      _oButFullscreen.setActive(s_bFullscreen);
    }
  };


  this._onFullscreenRelease = function () {
    if (s_bFullscreen) {
      _fCancelFullScreen.call(window.document);
    } else {
      _fRequestFullScreen.call(window.document.documentElement);
    }

    sizeHandler();
  };

  this.update = function () {
    _oAnimMenu.update();
  };

  s_oMenu = this;

  this._init();
}

var s_oMenu = null;
