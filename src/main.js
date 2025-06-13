import { logMessage, getApiUrl } from '../utils/helpers'

let isConnectionEstabished = false
let intervalCount = 3
let intervalKey = null
const CONNECT_START = 'connectStart'
const CONNECT_FAIL = 'connectFail'
const CONNECTION_SUCCESS = 'connectSuccess'
const NOT_CONNECTED = 'notConnected'
const LAUNCH_START = 'launchStart'
const LAUNCH_COUNTDOWN = 'launchCountdown'
const LAUNCH_SUCCESS = 'launchSuccess'
const ABORT_SUCCESS = 'abortSuccess'
const ABORT_FAIL = 'abortFail'

const stringifyError = (status, key) => {
  let error = {
    status,
    key,
    message: `Error from status: ${status}`
  }

  return JSON.stringify(error)
}

const connectToMajorTom = async (e) => {
  try {
    logMessage(CONNECT_START)
    const response = await fetch(getApiUrl())
    if (!response.ok) throw new Error(stringifyError(response.status, CONNECT_FAIL))
    if (response.status === 200) {
      logMessage(CONNECTION_SUCCESS)
      isConnectionEstabished = true
    }
  } catch (error) {
    const { status, key } = JSON.parse(error.message)
    if (status === 500) {
      logMessage(key);
      isConnectionEstabished = false;
    }
  }
}

const resetInterval = () => {
  if (intervalKey) {
    clearInterval(intervalKey)
    intervalCount = 3
    intervalKey = null
  }
}

const intervalLogMessage = () => {
  if (intervalCount > 1 && isConnectionEstabished) {
    logMessage(LAUNCH_COUNTDOWN, intervalCount--)
  } else {
    resetInterval()
    if(isConnectionEstabished){
      logMessage(LAUNCH_SUCCESS)
    }
  }
}

const initiateLaunch = () => {
  if(!isConnectionEstabished) logMessage(NOT_CONNECTED)
  intervalKey = setInterval(intervalLogMessage, 1000)
}

const abortCountDown = () => {
  if (intervalKey) {
    resetInterval()
    logMessage(ABORT_SUCCESS)
  } else logMessage(ABORT_FAIL)

}

const setupConnectButton = () => {
  // Your code goes here
  const btnConntect = document.querySelector('#connect')
  btnConntect.addEventListener('click', connectToMajorTom)
}

const setupLaunchButton = () => {
  // Your code goes here
  const btnLaunch = document.querySelector('#launch')
  btnLaunch.addEventListener('click', initiateLaunch)  
}

const setupAbortButton = () => {
  // Your code goes here
  const btnAbort = document.querySelector('#abort')
  btnAbort.addEventListener('click', abortCountDown)
}


export const main = () => {
  const navContainer = document.querySelector('#app')
  navContainer.innerHTML = `
    <div class="controls">
      <button id="connect">Connect to Major Tom</button>
      <button id="launch">Initiate Launch</button>
      <button id="abort">Abort Mission</button>
    </div>

    <div class="logs">
      <h2>Mission Logs:</h2>
      <ul id="log-list"></ul>
    </div>
  `
  
  setupConnectButton()
  setupLaunchButton()
  setupAbortButton()
}
