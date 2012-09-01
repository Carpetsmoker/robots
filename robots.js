// Generated by CoffeeScript 1.3.1
/*
Robots!
Copyright © 2012 Martin Tournoij
http://arp242.net/robots/
*/

var CheckBrowser, ClearGrid, CloseAllWindows, DestroyRobots, Die, DrawGrid, DrawJunk, DrawPlayer, DrawRobot, DrawSprite, GetRandomCoord, HandleKeyboard, HandleMouse, InitGame, InitGame2, InitRobots, JunkAtPosition, LoadOptions, MovePlayer, MovePossible, MoveRobots, NextLevel, RobotAtPosition, SetPosition, ShowWindow, Teleport, UpdateScore, Wait, log, _boxsize, _grid, _gridcon, _gridheight, _gridsizex, _gridsizey, _gridwidth, _junk, _keybinds, _level, _maxlevels, _numrobots, _playerpos, _robots, _spritesize, _waiting,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_boxsize = 14;

_gridsizex = 59;

_gridsizey = 22;

_gridheight = _gridsizey * _boxsize;

_gridwidth = _gridsizex * _boxsize;

_grid = document.getElementById('grid');

_gridcon = _grid.getContext('2d');

_playerpos = [0, 0];

_junk = [];

_robots = [];

_level = 0;

_numrobots = 10;

_maxlevels = 4;

_waiting = false;

_keybinds = null;

_spritesize = 14;

/*
Load options from localStorage or set defaults
*/


LoadOptions = function() {
  window._showgrid = localStorage.getItem('showgrid') === 'true' ? true : false;
  window._hardcore = localStorage.getItem('hardcore') === 'true' ? true : false;
  window._autoteleport = localStorage.getItem('autoteleport') === 'true' ? true : false;
  window._graphics = localStorage.getItem('graphics');
  if (!window._graphics) {
    window._graphics = (parseInt(Math.random() * 3) + 1) + '';
  }
  window._sprite = new Image;
  window.loaded = false;
  window._sprite.onload = function() {
    return window.loaded = true;
  };
  if (window._graphics === '1') {
    window._sprite.src = 'graphics/classic.png';
  } else if (window._graphics === '2') {
    window._sprite.src = 'graphics/dalek.png';
  } else if (window._graphics === '3') {
    window._sprite.src = 'graphics/cybermen.png';
  }
  document.getElementById('graphics').selectedIndex = parseInt(window._graphics, 10) - 1;
  document.getElementById('showgrid').checked = window._showgrid;
  document.getElementById('autoteleport').checked = window._autoteleport;
  document.getElementById('hardcore').checked = window._hardcore;
  if (localStorage.getItem('keybinds') === '1') {
    document.getElementById('keybinds0').style.display = 'none';
    document.getElementById('keybinds1').style.display = 'block';
    document.getElementById('keyset').selectedIndex = 1;
    return window._keybinds = [
      [
        121, function() {
          return MovePlayer(['up', 'left']);
        }
      ], [
        107, function() {
          return MovePlayer(['up']);
        }
      ], [
        117, function() {
          return MovePlayer(['up', 'right']);
        }
      ], [
        104, function() {
          return MovePlayer(['left']);
        }
      ], [
        108, function() {
          return MovePlayer(['right']);
        }
      ], [
        98, function() {
          return MovePlayer(['down', 'left']);
        }
      ], [
        106, function() {
          return MovePlayer(['down']);
        }
      ], [
        110, function() {
          return MovePlayer(['down', 'right']);
        }
      ], [
        46, function() {
          return MovePlayer([]);
        }
      ], [
        119, function() {
          return Wait();
        }
      ], [
        116, function() {
          return Teleport();
        }
      ]
    ];
  } else {
    document.getElementById('keybinds0').style.display = 'block';
    document.getElementById('keybinds1').style.display = 'none';
    document.getElementById('keyset').selectedIndex = 0;
    return window._keybinds = [
      [
        55, function() {
          return MovePlayer(['up', 'left']);
        }
      ], [
        56, function() {
          return MovePlayer(['up']);
        }
      ], [
        57, function() {
          return MovePlayer(['up', 'right']);
        }
      ], [
        52, function() {
          return MovePlayer(['left']);
        }
      ], [
        54, function() {
          return MovePlayer(['right']);
        }
      ], [
        49, function() {
          return MovePlayer(['down', 'left']);
        }
      ], [
        50, function() {
          return MovePlayer(['down']);
        }
      ], [
        51, function() {
          return MovePlayer(['down', 'right']);
        }
      ], [
        53, function() {
          return MovePlayer([]);
        }
      ], [
        119, function() {
          return Wait();
        }
      ], [
        116, function() {
          return Teleport();
        }
      ]
    ];
  }
};

/*
Draw an empty grid aka playfield
*/


DrawGrid = function() {
  var col, row, _i, _j, _ref, _ref1;
  _gridcon.fillStyle = '#fff';
  _gridcon.fillRect(0, 0, _gridwidth, _gridheight);
  if (_showgrid) {
    for (col = _i = 0, _ref = _gridsizex * _boxsize; 0 <= _ref ? _i <= _ref : _i >= _ref; col = _i += _boxsize) {
      _gridcon.moveTo(col + 0.5, 0);
      _gridcon.lineTo(col + 0.5, _gridheight);
    }
    for (row = _j = 0, _ref1 = _gridsizey * _boxsize; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; row = _j += _boxsize) {
      _gridcon.moveTo(0, row + 0.5);
      _gridcon.lineTo(_gridwidth, row + 0.5);
    }
    _gridcon.strokeStyle = '#b7b7b7';
    _gridcon.lineWidth = 1;
    return _gridcon.stroke();
  }
};

/*
Draw a bunch of robots at a random locations
*/


InitRobots = function() {
  var i, x, y, _i, _results;
  _results = [];
  for (i = _i = 1; 1 <= _numrobots ? _i <= _numrobots : _i >= _numrobots; i = 1 <= _numrobots ? ++_i : --_i) {
    while (true) {
      x = GetRandomCoord('x');
      y = GetRandomCoord('y');
      if (!RobotAtPosition(x, y) && (x !== _playerpos[0] && y !== _playerpos[1])) {
        break;
      }
    }
    _results.push(DrawRobot(null, x, y));
  }
  return _results;
};

DrawSprite = function(num, x, y) {
  return _gridcon.drawImage(_sprite, _spritesize * num, 0, _spritesize, _spritesize, x * _boxsize, y * _boxsize, _boxsize, _boxsize);
};

/*
Draw a robot
*/


DrawRobot = function(num, x, y) {
  if (_robots[num] === null) {
    return;
  } else if (num === null) {
    num = _robots.length;
    _robots.push([x, y]);
  } else {
    ClearGrid(_robots[num][0], _robots[num][1]);
  }
  DrawSprite(1, x, y);
  return _robots[num] = [x, y];
};

/*
Two robots collided. BBBOOOOOMMM!!
*/


DestroyRobots = function(x, y) {
  var i, r, _i, _len, _results;
  ClearGrid(x, y);
  DrawJunk(x, y);
  _junk.push([x, y]);
  i = 0;
  _results = [];
  for (_i = 0, _len = _robots.length; _i < _len; _i++) {
    r = _robots[_i];
    if (r && r[0] === x && r[1] === y) {
      _robots[i] = null;
      _numrobots -= 1;
      UpdateScore();
    }
    _results.push(i += 1);
  }
  return _results;
};

DrawJunk = function(x, y) {
  return DrawSprite(2, x, y);
};

/*
Move robots around
*/


MoveRobots = function() {
  var c, i, r, x, y, _i, _j, _len, _len1, _results;
  i = 0;
  for (i = _i = 0, _len = _robots.length; _i < _len; i = ++_i) {
    r = _robots[i];
    if (r === null) {
      continue;
    }
    x = r[0];
    y = r[1];
    if (_playerpos[0] > x) {
      x += 1;
    } else if (_playerpos[0] < x) {
      x -= 1;
    }
    if (_playerpos[1] > y) {
      y += 1;
    } else if (_playerpos[1] < y) {
      y -= 1;
    }
    if (RobotAtPosition(_playerpos[0], _playerpos[1])) {
      Die();
      return;
    } else if (JunkAtPosition(x, y)) {
      ClearGrid(_robots[i][0], _robots[i][1]);
      _robots[i] = [x, y];
      DestroyRobots(x, y);
    } else {
      DrawRobot(i, x, y);
    }
  }
  _results = [];
  for (i = _j = 0, _len1 = _robots.length; _j < _len1; i = ++_j) {
    r = _robots[i];
    if (r === null) {
      continue;
    }
    c = RobotAtPosition(r[0], r[1], true);
    if (c !== false && c !== i) {
      _results.push(DestroyRobots(r[0], r[1]));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

/*
Draw our handsome protagonist
*/


DrawPlayer = function(x, y) {
  ClearGrid(_playerpos[0], _playerpos[1]);
  DrawSprite(0, x, y);
  return _playerpos = [x, y];
};

/*
Get random coordinates
TODO: How random is Math.random()?
*/


GetRandomCoord = function(axis) {
  axis = axis === 'x' ? _gridsizex : _gridsizey;
  return parseInt(Math.random() * (axis - 1) + 1, 10);
};

/*
Set position of player or robot inside the grid
*/


SetPosition = function(obj, x, y) {
  obj.style.left = x + 'px';
  return obj.style.top = y + 'px';
};

/*
Deal with keyboard events
*/


HandleKeyboard = function(event) {
  var action, code, keyCode, _i, _len, _ref, _results;
  if (event.ctrlKey || event.altKey) {
    return;
  }
  code = event.keyCode || event.charCode;
  if (code === 27) {
    CloseAllWindows();
    return;
  }
  _results = [];
  for (_i = 0, _len = _keybinds.length; _i < _len; _i++) {
    _ref = _keybinds[_i], keyCode = _ref[0], action = _ref[1];
    if (keyCode === code) {
      event.preventDefault();
      _results.push(action());
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

/*
Deal with mouse events
*/


HandleMouse = function(event) {
  var sleep;
  if (event.target.id === 'options') {
    return ShowWindow('options');
  } else if (event.target.id === 'help') {
    return ShowWindow('help');
  } else if (event.target.id === 'about') {
    return ShowWindow('about');
  } else if (event.target.id === 'close') {
    return CloseAllWindows();
  } else if (event.target.id === 'save') {
    localStorage.setItem('keybinds', document.getElementById('keyset').selectedIndex);
    localStorage.setItem('graphics', document.getElementById('graphics').selectedIndex + 1);
    localStorage.setItem('showgrid', document.getElementById('showgrid').checked);
    localStorage.setItem('autoteleport', document.getElementById('autoteleport').checked);
    localStorage.setItem('hardcore', document.getElementById('hardcore').checked);
    LoadOptions();
    CloseAllWindows();
    DrawGrid();
    return sleep = setInterval(function() {
      var i, j, r, _i, _j, _len, _len1, _results;
      if (window.loaded) {
        clearInterval(sleep);
        DrawPlayer(_playerpos[0], _playerpos[1]);
        for (i = _i = 0, _len = _robots.length; _i < _len; i = ++_i) {
          r = _robots[i];
          if (r !== null) {
            DrawRobot(i, r[0], r[1]);
          }
        }
        _results = [];
        for (i = _j = 0, _len1 = _junk.length; _j < _len1; i = ++_j) {
          j = _junk[i];
          _results.push(DrawJunk(i, j[0], j[1]));
        }
        return _results;
      }
    }, 100);
  }
};

/*
Close all windows
*/


CloseAllWindows = function() {
  var l, win, _i, _len, _ref, _results;
  l = document.getElementById('layover');
  if (l) {
    l.parentNode.removeChild(l);
  }
  _ref = document.getElementsByClassName('window');
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    win = _ref[_i];
    _results.push(win.style.display = 'none');
  }
  return _results;
};

/*
Show a window
*/


ShowWindow = function(name) {
  var div;
  div = document.createElement('div');
  div.id = 'layover';
  document.body.appendChild(div);
  return document.getElementById(name + 'window').style.display = 'block';
};

/*
Our bold player decided to wait ... Let's see if that decision was wise ... or fatal!
*/


Wait = function() {
  _waiting = true;
  while (true) {
    MoveRobots();
    if (RobotAtPosition(_playerpos[0], _playerpos[1])) {
      return;
    }
    if (_numrobots === 0) {
      NextLevel();
      break;
    }
  }
  return _waiting = false;
};

/*
Teleport to a new location ... or to death!
*/


Teleport = function() {
  var x, y;
  x = GetRandomCoord('x');
  y = GetRandomCoord('y');
  if (RobotAtPosition(x, y || JunkAtPosition(x, y))) {
    Die();
    return;
  }
  DrawPlayer(x, y);
  return MoveRobots();
};

/* Move the player around
*/


MovePlayer = function(dir) {
  var dangerous, i, j, x, y, _i, _j;
  x = _playerpos[0];
  y = _playerpos[1];
  if (__indexOf.call(dir, 'left') >= 0) {
    x -= 1;
  } else if (__indexOf.call(dir, 'right') >= 0) {
    x += 1;
  }
  if (__indexOf.call(dir, 'up') >= 0) {
    y -= 1;
  } else if (__indexOf.call(dir, 'down') >= 0) {
    y += 1;
  }
  if (x < 0 || x > _gridsizex - 1) {
    return false;
  }
  if (y < 0 || y > _gridsizey - 1) {
    return false;
  }
  dangerous = false;
  for (i = _i = -1; _i <= 1; i = ++_i) {
    for (j = _j = -1; _j <= 1; j = ++_j) {
      if (x + i < 0 || x + i > _gridsizex - 1) {
        continue;
      }
      if (y + j < 0 || y + j > _gridsizey - 1) {
        continue;
      }
      if (RobotAtPosition(x + i, y + j)) {
        dangerous = true;
      }
    }
  }
  if (!_hardcore && dangerous) {
    return false;
  }
  if (JunkAtPosition(x, y)) {
    return false;
  }
  DrawPlayer(x, y);
  MoveRobots();
  if (_numrobots <= 0) {
    NextLevel();
  }
  if (!_hardcore && _autoteleport && !MovePossible()) {
    return Teleport();
  }
};

/*
Check if there is a possible move left
*/


MovePossible = function() {
  var dangerous, x1, x2, y1, y2, _i, _j, _k, _l;
  for (x1 = _i = -1; _i <= 1; x1 = ++_i) {
    for (y1 = _j = -1; _j <= 1; y1 = ++_j) {
      dangerous = false;
      if (_playerpos[0] + x1 < 0 || _playerpos[0] + x1 > _gridsizex - 1) {
        continue;
      }
      if (_playerpos[1] + y1 < 0 || _playerpos[1] + y1 > _gridsizey - 1) {
        continue;
      }
      for (x2 = _k = -1; _k <= 1; x2 = ++_k) {
        for (y2 = _l = -1; _l <= 1; y2 = ++_l) {
          if (RobotAtPosition(_playerpos[0] + x1 + x2, _playerpos[1] + y1 + y2)) {
            dangerous = true;
          }
        }
      }
      if (!dangerous) {
        return true;
      }
    }
  }
  return false;
};

/*
Check of there if a robot at the position
*/


RobotAtPosition = function(x, y, retnum) {
  var i, r, _i, _len;
  for (i = _i = 0, _len = _robots.length; _i < _len; i = ++_i) {
    r = _robots[i];
    if (r && r[0] === x && r[1] === y) {
      if (retnum) {
        return i;
      } else {
        return true;
      }
    }
  }
  return false;
};

/*
Check if there is "junk" at this position
*/


JunkAtPosition = function(x, y) {
  var j, _i, _len;
  for (_i = 0, _len = _junk.length; _i < _len; _i++) {
    j = _junk[_i];
    if (j[0] === x && j[1] === y) {
      return true;
    }
  }
  return false;
};

/*
Clear (blank) this grid positon
TODO: Redraw grid lines if grid is enabled
*/


ClearGrid = function(x, y) {
  _gridcon.fillStyle = '#fff';
  return _gridcon.fillRect(x * _boxsize, y * _boxsize, _boxsize, _boxsize);
};

/*
Oh noes! Our brave hero has died! :-(
*/


Die = function() {
  var curscore, d, restart, s, scores, _i, _len;
  ClearGrid(_playerpos[0], _playerpos[1]);
  DrawSprite(3, _playerpos[0], _playerpos[1]);
  curscore = parseInt(document.getElementById('score').innerHTML, 10);
  scores = localStorage.getItem('scores');
  scores = JSON.parse(scores);
  if (!scores) {
    scores = [];
  }
  d = new Date;
  d = d.toLocaleDateString();
  scores.push([curscore, d, true]);
  scores.sort(function(a, b) {
    if (a[0] > b[0]) {
      return -1;
    }
    if (a[0] < b[0]) {
      return 1;
    }
    return 0;
  });
  scores = scores.slice(0, 5);
  restart = document.createElement('div');
  restart.id = 'restart';
  restart.innerHTML = 'AARRrrgghhhh....<br><br>' + 'Your highscores:<br>';
  for (_i = 0, _len = scores.length; _i < _len; _i++) {
    s = scores[_i];
    restart.innerHTML += '<span class="row' + (s[2] ? ' cur' : '') + '">' + '<span class="score">' + s[0] + '</span>' + s[1] + '</span>';
  }
  restart.innerHTML += '<br>Press any key to try again.';
  document.body.appendChild(restart);
  scores = scores.map(function(s) {
    s[2] = false;
    return s;
  });
  localStorage.setItem('scores', JSON.stringify(scores));
  document.body.removeEventListener('keypress', HandleKeyboard, false);
  return window.addEventListener('keypress', (function(e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    e.preventDefault();
    return window.location.reload();
  }), false);
};

/*
Woohoo! A robot is no more, so lets update the score.
*/


UpdateScore = function() {
  var score;
  score = parseInt(document.getElementById('score').innerHTML, 10);
  score += 10;
  if (_waiting) {
    score += 1;
  }
  return document.getElementById('score').innerHTML = score;
};

/*
Keep IE happy (also shorter to type!)
*/


log = function(msg) {
  if (console && console.log) {
    return console.log(msg);
  }
};

/*
Advance to the next level
*/


NextLevel = function() {
  _level += 1;
  _numrobots = 10 + _level * 10;
  _waiting = false;
  _junk = [];
  DrawGrid();
  DrawPlayer(GetRandomCoord('x'), GetRandomCoord('y'));
  return InitRobots();
};

CheckBrowser = function() {
  var div, old;
  old = false;
  if (window.opera) {
    if (parseFloat(window.opera.version()) < 11.60) {
      old = true;
    }
  } else if (window.chrome) {
    if (parseInt(navigator.appVersion.match(/Chrome\/(\d+)/)[1], 10) < 18) {
      old = true;
    }
  } else if (navigator.vendor && navigator.vendor.match(/[aA]pple/)) {
    if (parseFloat(navigator.appVersion.match(/Version\/(\d+\.\d+)/)[1]) < 5) {
      old = true;
    }
  } else if (navigator.userAgent.match(/Firefox\/\d+/)) {
    if (parseFloat(navigator.userAgent.match(/Firefox\/([\d\.]+)/)[1]) < 10) {
      old = true;
    }
  } else if (navigator.appName === 'Microsoft Internet Explorer') {
    if (parseInt(navigator.appVersion.match(/MSIE (\d+)/)[1], 10) < 9) {
      old = true;
    }
  }
  if (old) {
    div = document.createElement('div');
    div.id = 'oldbrowser';
    div.innerHTML = 'Robots requires a fairly new browser with support for canvas, JSON, localStorage, etc.<br>' + 'Almost all modern browsers support this, but a few may not (IE8, for example, does not).<br>' + 'Tested versions are Opera 12, Firefox 14, Chrome 20, Internet Explorer 9';
    return document.body.insertBefore(div, _grid);
  }
};

/*
Start the game!
*/


InitGame = function() {
  var sleep;
  _numrobots = 10;
  LoadOptions();
  return sleep = setInterval(function() {
    if (window.loaded) {
      clearInterval(sleep);
      return InitGame2();
    }
  }, 100);
};

InitGame2 = function() {
  DrawGrid();
  DrawPlayer(GetRandomCoord('x'), GetRandomCoord('y'));
  InitRobots();
  window.addEventListener('keypress', HandleKeyboard, false);
  return window.addEventListener('click', HandleMouse, false);
};

CheckBrowser();

InitGame();
