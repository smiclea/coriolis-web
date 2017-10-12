class Wait {
  static for(store, predicate, callback) {
    this.interval = setInterval(() => {
      if (predicate(store.getState())) {
        clearInterval(this.interval)
        callback()
      }
    }, 500)
  }
}

export default Wait
