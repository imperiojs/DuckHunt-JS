imperio.listenerRoomSetup();
imperio.roomUpdate();

setTimeout(() => {
  let connectionType = document.getElementById('connection-type');
  connectionType.innerHTML = `Currently Connected via ${imperio.connectionType}`;
}, 1000);
