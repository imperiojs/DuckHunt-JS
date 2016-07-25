  // global variables
var state = 'initializing';
var initializing = 'tl';
var corners = {
  tl: { a: 0, b: 0, g: 0 },
  tr: { a: 0, b: 0, g: 0 },
  bl: { a: 0, b: 0, g: 0 },
  br: { a: 0, b: 0, g: 0 },
};

var gyroState = {
  a: 0,
  b: 0,
  g: 0
};

// Join socket room and set up listeners
imperio.emitRoomSetup(function emitConnected() { console.log('connected') });
imperio.roomUpdate(function emitRoomUpdate(roomData) {
  console.log('roomData', roomData);
});
imperio.emitGyroscope.start(storeGyroState);
imperio.dataListener(); // callback
var initializeBox = document.getElementById('initialize-box');
initializeBox.addEventListener('touchend', initializeCorners);
var shoot = document.getElementById('shoot');
imperio.gesture('tap', shoot, () => console.log('emited tap event', event),
function(event) {
  return gyroState;
});

// GYRO LISTENER CALLBACK
// stores the gyro orientation data to a global gyroState variable
function storeGyroState(gyroObj) {
  gyroState.a = gyroObj.alpha;
  gyroState.b = gyroObj.beta;
  gyroState.g = gyroObj.gamma;
}

// TOUCH INITIALIZE BOX CALLBACK
// initialize corners
function initializeCorners() {
  if (state === 'initializing') {
     // TODO switch statement
    var target = initializing;
    if (initializing === 'tl') {
      corners.tl = gyroState;
      initializing = 'tr';
    }
    else if (initializing === 'tr') {
      corners.tr = gyroState;
      initializing = 'br';
    }
    else if (initializing === 'br') {
      corners.br = gyroState;
      initializing = 'bl';
    }
    else if (initializing === 'bl') {
      corners.bl = gyroState;
      initializing = null;
    }
    else {
      console.log('Done calibrating! Start game!');
    }
  }
  var emitGyroState = {};
  emitGyroState.target = target;
  emitGyroState.a = gyroState.a;
  emitGyroState.b = gyroState.b;
  emitGyroState.g = gyroState.g;
  console.log('gyroState:', emitGyroState);
  imperio.emitData(initializeFeedback, emitGyroState);
}

function initializeFeedback() {
  initializeBox.style.backgroundColor = 'yellow';
  setTimeout(function() {
    initializeBox.style.backgroundColor = 'green';
  }, 200);
}

imperio.webRTCConnect();
