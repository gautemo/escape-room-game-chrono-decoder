const gameMode = (name) => {
  document.querySelector('h1').textContent = name
  document.querySelector('#one').value = ''
  document.querySelector('#two').value = ''
  document.querySelector('#three').value = ''
  document.querySelector('#one').dispatchEvent(new Event("input"))
  document.querySelector('#two').dispatchEvent(new Event("input"))
  document.querySelector('#three').dispatchEvent(new Event("input"))
}

document.querySelectorAll('nav li').forEach(element => {
  element.addEventListener('click', () => gameMode(element.textContent))
})

const validateKey = e => /[1-6]|[a-f]|[A-F]/.test(e.key)
document.querySelector('#one').onkeypress = validateKey
document.querySelector('#two').onkeypress = validateKey
document.querySelector('#three').onkeypress = validateKey

document.querySelector('#one').addEventListener('input', e => setAnswer(e.target.value, 1))
document.querySelector('#two').addEventListener('input', e => setAnswer(e.target.value, 2))
document.querySelector('#three').addEventListener('input', e => setAnswer(e.target.value, 3))

const setAnswer = (keys, nr) => {
  const gameMode = document.querySelector('h1').textContent
  let answers = {
    'Prison Break': prisonBreak,
    'Virus': virus,
    'Nuclear Countdown': nuclear,
    'Temple of the Aztec': temple,
  }
  const answer = answers[gameMode]
  const reveal = document.querySelector(`#reveal-${nr}`)
  const keysEl = document.querySelector(`#keys-${nr}`)
  const keysMapped = [...keys].map(mapToNumberKey).join('')
  showKey(keysMapped[0], nr, 1)
  showKey(keysMapped[1], nr, 2)
  showKey(keysMapped[2], nr, 3)
  showKey(keysMapped[3], nr, 4)
  if (keysMapped.length < 4){
    reveal.textContent = ''
    keysEl.classList.remove('correct', 'incorrect')
  } else if (keysMapped === answer[nr-1]){
    reveal.textContent = 'Correct'
    keysEl.classList.add('correct')
    playAudio('assets/correct.wav')
  }else{
    reveal.textContent = 'Wrong'
    keysEl.classList.add('incorrect')
    if(intervalId){
      document.querySelector('#time').classList.add('animate')
      if(minutes > 0){
        minutes--
      }else{
        seconds = 1
      }
    }
    playAudio('assets/wrong.wav')
  }
}

const showKey = (keyValue, partNr, keyNr) => {
  const keyEl = document.querySelector(`.key-${partNr}-${keyNr}`)
  if (keyValue){
    keyEl.innerHTML = `
      <img src="assets/key${keyValue}.png" alt="key" height="160" />
    `;
  }else{
    keyEl.innerHTML = ''
  }
}

const mapToNumberKey = key => {
  const map = {
    'A': 1,
    'B': 6,
    'C': 5,
    'D': 2,
    'E': 4,
    'F': 3,
  }
  return map[key.toUpperCase()] ?? key
}

document.querySelector('#time').addEventListener('animationend', e => e.target.classList.remove('animate'))
let intervalId = null
let minutes = 60
let seconds = 0

document.querySelector('button').addEventListener('click', e => {
  const timer = document.querySelector('#time')
  if(intervalId == null){
    e.target.textContent = 'STOP'
    intervalId = setInterval(() => {
      seconds--
      if(seconds < 0){
        minutes--
        seconds = 59
      }
      timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      if(minutes === 0 && seconds === 0){
        clearInterval(intervalId)
        playAudio('assets/timesup.wav')
      }else if(minutes % 5 === 0 && seconds === 0){
        playAudio('assets/info.wav')
      }
      
    }, 1000)
  }else{
    e.target.textContent = 'START'
    clearInterval(intervalId)
    intervalId = null
  }
})

const playAudio = (src) => {
  const audio = new Audio(src)
  audio.play();
}