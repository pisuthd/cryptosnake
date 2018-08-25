
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
      video.width = CANVAS_WIDTH / 3;
      video.height = CANVAS_HEIGHT / 3;
  
  
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
  