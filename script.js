const setBtn = document.getElementById('set-btn');
const timersList = document.getElementById('timers-list');
const alarmSound = document.getElementById('alarm-sound');

let timers = [];

function formatTime(unit) {
  return unit.toString().padStart(2, '0');
}

function createTimerElement(timerObj, index) {
  const timerDiv = document.createElement('div');
  timerDiv.className = 'timer';
  timerDiv.setAttribute('data-index', index);

  const timeSpan = document.createElement('span');
  timeSpan.textContent = `Time Left : ${formatTime(timerObj.hours)} : ${formatTime(timerObj.minutes)} : ${formatTime(timerObj.seconds)}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';

  deleteBtn.addEventListener('click', () => {
    clearInterval(timerObj.intervalId);
    timers.splice(index, 1);
    renderTimers();
  });

  timerDiv.appendChild(timeSpan);
  timerDiv.appendChild(deleteBtn);

  return timerDiv;
}

function renderTimers() {
  timersList.innerHTML = '';
  if (timers.length === 0) {
    timersList.innerHTML = `<p class="no-timers">You have no timers currently!</p>`;
    return;
  }

  timers.forEach((timerObj, index) => {
    const timerElement = createTimerElement(timerObj, index);
    timersList.appendChild(timerElement);
  });
}

function updateTimer(index) {
  let timer = timers[index];

  if (timer.seconds > 0) {
    timer.seconds--;
  } else {
    if (timer.minutes > 0) {
      timer.minutes--;
      timer.seconds = 59;
    } else if (timer.hours > 0) {
      timer.hours--;
      timer.minutes = 59;
      timer.seconds = 59;
    } else {
      // Timer is up
      clearInterval(timer.intervalId);
      const timerElement = document.querySelector(`.timer[data-index="${index}"]`);
      if (timerElement) {
        timerElement.classList.add('timer-ended');
        timerElement.innerHTML = `<span>Timer Is Up !</span>`;
        alarmSound.play();
      }
      return;
    }
  }

  renderTimers();
}

setBtn.addEventListener('click', () => {
  const h = parseInt(document.getElementById('hours').value) || 0;
  const m = parseInt(document.getElementById('minutes').value) || 0;
  const s = parseInt(document.getElementById('seconds').value) || 0;

  if (h === 0 && m === 0 && s === 0) {
    alert('Please enter a valid time!');
    return;
  }

  const timerObj = {
    hours: h,
    minutes: m,
    seconds: s,
    intervalId: null
  };

  timerObj.intervalId = setInterval(() => {
    updateTimer(timers.indexOf(timerObj));
  }, 1000);

  timers.push(timerObj);
  renderTimers();

  // Clear input
  document.getElementById('hours').value = '';
  document.getElementById('minutes').value = '';
  document.getElementById('seconds').value = '';
});
