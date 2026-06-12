(function () {
  'use strict';

  // ---- Game content ----
  // 16 words, fixed order (warm-up -> strong/funny peak -> bonus tail).
  var WORDS = [
    'חוף ים',
    'גן חיות',
    'מסעדת גמלא',
    'ראיון עבודה',
    'Jensen Days',
    'ישיבת צוות',
    'Ai agent',
    'מסיבת הפתעה',
    'חתונה',
    'business trip',
    'חדר כושר',
    'יקב',
    'תחנת רכבת',
    'מצפן',
    'אוניברסיטה',
    'מזל'
  ];
  var IMPOSTOR_WORD = 'מתחזה';
  var MIN_PLAYERS = 3;
  var MAX_PLAYERS = 12;

  // ---- State ----
  var state = { players: 5, round: 0, impostor: 0, current: 1 };

  function $(id) { return document.getElementById(id); }

  var screens = {
    setup: $('screen-setup'),
    pass: $('screen-pass'),
    card: $('screen-card'),
    discuss: $('screen-discuss'),
    end: $('screen-end')
  };

  function show(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle('active', key === name);
    });
    window.scrollTo(0, 0);
  }

  function randInt(max) { return Math.floor(Math.random() * max); }

  // ---- Setup ----
  function renderCount() { $('player-count').textContent = state.players; }
  function changeCount(delta) {
    state.players = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, state.players + delta));
    renderCount();
  }

  function startGame() {
    state.round = 0;
    startRound();
  }

  // ---- Round flow ----
  function startRound() {
    state.impostor = randInt(state.players); // 0-based: which player (in pass order) is the impostor
    state.current = 1;
    showPass();
  }

  function showPass() {
    $('pass-chip').textContent = 'סבב ' + (state.round + 1) + '/' + WORDS.length;
    $('pass-player').textContent = 'שחקן ' + state.current;
    show('pass');
  }

  function revealCard() {
    var isImpostor = (state.current - 1) === state.impostor;
    var icon = $('card-icon').querySelector('i');
    $('card-chip').textContent = 'שחקן ' + state.current;
    if (isImpostor) {
      $('card-label').textContent = 'התפקיד שלך';
      $('card-word').textContent = IMPOSTOR_WORD;
      $('card-hint').textContent = 'השתלבו ונסו לנחש את המילה';
      icon.className = 'ti ti-spy';
    } else {
      $('card-label').textContent = 'המילה שלך';
      $('card-word').textContent = WORDS[state.round];
      $('card-hint').textContent = 'תנו רמז במילה אחת';
      icon.className = 'ti ti-bulb';
    }
    show('card');
  }

  function hideAndNext() {
    state.current += 1;
    if (state.current > state.players) {
      showDiscuss();
    } else {
      showPass();
    }
  }

  function showDiscuss() {
    $('discuss-chip').textContent = 'סבב ' + (state.round + 1) + '/' + WORDS.length;
    show('discuss');
  }

  function nextRound() {
    state.round += 1;
    if (state.round >= WORDS.length) {
      showEnd();
    } else {
      startRound();
    }
  }

  function showEnd() {
    $('end-rounds').textContent = 'שיחקתם ' + WORDS.length + ' סיבובים מעולים';
    show('end');
  }

  function newGame() { show('setup'); }

  // ---- Wire up ----
  $('btn-minus').addEventListener('click', function () { changeCount(-1); });
  $('btn-plus').addEventListener('click', function () { changeCount(1); });
  $('btn-start').addEventListener('click', startGame);
  $('btn-reveal').addEventListener('click', revealCard);
  $('pass-card').addEventListener('click', revealCard);
  $('btn-hide').addEventListener('click', hideAndNext);
  $('btn-next').addEventListener('click', nextRound);
  $('btn-restart').addEventListener('click', newGame);

  renderCount();
})();
