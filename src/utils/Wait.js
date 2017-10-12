class Wait {
  /**
   * Waits the specified timeout (default: 5000ms) amount of time for the stop condition to be true,
   * then calls the stop callback.
   * @param {Function} stopCondition Called every 500ms to check if the wait should stop.
   * @param {Function} stopCallback Called when stopCondition evaluates to true.
   * @param {number} timeout Specifies after how many miliseconds should the wait give up.
   * @param {Function} timeoutCallback Called if wait reaches timeout.
   */
  static for(stopCondition, stopCallback, timeout = 5000, timeoutCallback = () => { }) {
    let startTime = new Date()

    let interval = setInterval(() => {
      let currentTime = new Date()

      if (currentTime - startTime > timeout) {
        clearInterval(interval)
        timeoutCallback()
      }

      if (stopCondition()) {
        clearInterval(interval)
        stopCallback()
      }
    }, 500)
  }
}

export default Wait
