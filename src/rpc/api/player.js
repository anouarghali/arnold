import { request } from './base.js';

function getActivePlayers(callback) {
  request('Player.GetActivePlayers', {}, callback);
}

function callPlayerMethod(method, extraParams, callback) {
  getActivePlayers((err, res) => {
    if(err) {
      callback(err);
      return;
    }

    const firstPlayer = res.result[0];
    if(!firstPlayer) {
      callback(new Error('No active player is available.'));
      return;
    }

    request(method, { playerid: firstPlayer.playerid,  ...extraParams }, callback);
  });
}

function playPause(callback) {
  callPlayerMethod('Player.PlayPause', {}, callback);
}

function stop(callback) {
  callPlayerMethod('Player.Stop', {}, callback);
}

// NOTE: `to` can be 'previous' or 'next'
function goTo(to, callback) {
  callPlayerMethod('Player.GoTo', { to }, callback);
}

// NOTE: `speed` can be 'increase' or 'decrease'
function setSpeed(speed, callback) {
  callPlayerMethod('Player.SetSpeed', { speed }, callback);
}

function open(item, callback) {
  const params = {
    item
  };

  request('Player.Open', params, callback);
}

export default {
  getActivePlayers,
  playPause,
  stop,
  goTo,
  setSpeed,
  open
}
