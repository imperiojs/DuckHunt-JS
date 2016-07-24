/* eslint-disable no-var */
var state = 'initializing';
var initializing = 'tl';
var corners = {
  tl: { a: 0, b: 0, g: 0 },
  tr: { a: 0, b: 0, g: 0 },
  br: { a: 0, b: 0, g: 0 },
  bl: { a: 0, b: 0, g: 0 },
};

// Add nonce code to screen for mobile users to enter
document.getElementById('nonce-container').innerHTML =
  'Mobile code: <span>' + imperio.nonce + '</span>';

// Use roomId from cookies to create a room
imperio.listenerRoomSetup();
imperio.roomUpdate();
imperio.dataListener(confirmInitialization);
imperio.gyroscopeListener(handleGyroStream);

function confirmInitialization(data) {
  console.log('confirmInitialization invoked:', data);
  var target = document.getElementById('initialization-data');
  target.innerHTML = JSON.stringify(data);
  var feedbackMap = {
    tl: 'top-left-feedback',
    tr: 'top-right-feedback',
    bl: 'bottom-left-feedback',
    br: 'bottom-right-feedback',
  };
  console.log('data:', data);
  console.log('targetId', feedbackMap[data.target]);
  var cornerTarget = document.getElementById(feedbackMap[data.target]);
  initializing = data.target;
  delete data.target;
  corners[initializing] = data;
  cornerTarget.innerHTML = JSON.stringify(data);
  var cornersState = document.getElementById('corners-state');
  cornersState.innerHTML = JSON.stringify(corners);

  // ready to start game?
  if (initializing === 'bl') {
    state = 'gaming';
    document.getElementById('state').innerHTML = 'game time!';
  }
}

function handleGyroStream(gyroData) {
  // print the gyro data stream to our feedback div
  var target = document.getElementById('initialization-data');
  target.innerHTML = JSON.stringify(gyroData);

  // if we're ready to game, try and map out position!
  if (state === 'gaming') {
    // HANDLE X COORDS
    var aMin = corners.tl.a;
    var aMax = corners.br.a;
    console.log(`aMin: ${aMin}, aMax: ${aMax}`);
    if (aMax > aMin) aMax -= 360;
    if (gyroData.alpha > aMin) gyroData.alpha -= 360;
    console.log(`new aMax: ${aMax}`);
    console.log(`gyroData.alpha: ${gyroData.alpha}`);
    var xPercentage = (aMin - gyroData.alpha) / (aMin - aMax);
    console.log(`Percentage ${xPercentage}`);
    var xMin = 0;
    var xMax = window.innerWidth;
    var xPosition = xMax * xPercentage;
    console.log(`xMin: ${xMin}, xMax: ${xMax}, xPos: ${xPosition}`);

    // HANDLE Y COORDS
    var bMax = corners.tl.b;
    var bMin = corners.br.b;
    console.log(`bMax: ${bMax}, bMin: ${bMin}`);
    // if (bMax > bMin) bMax -= 360;
    // if (gyroData.alpha > aMin) gyroData.alpha -= 360;
    // console.log(`new aMax: ${aMax}`);
    console.log(`gyroData.beta: ${gyroData.beta}`);
    var yPercentage = (bMax - gyroData.beta) / (bMax - bMin);
    console.log(`Percentage ${yPercentage}`);
    var yMin = 0;
    var yMax = window.innerHeight;
    var yPosition = yMax * yPercentage;
    console.log(`yMin: ${yMin}, yMax: ${yMax}, yPos: ${yPosition}`);

    document.getElementById('x-coords').innerHTML =
      `X = ${xPosition}, Y = ${yPosition}`;
    document.getElementById('reticle').style.left = `${xPosition}px`;
    document.getElementById('reticle').style.top = `${yPosition}px`;
  }
}
