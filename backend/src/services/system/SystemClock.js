
class SystemClock {
  constructor() {
    if (SystemClock.instance) {
      return SystemClock.instance;
    }
    SystemClock.instance = this;
  }

  now() {
    return new Date();
  }

  timestamp() {
    return Date.now();
  }

  isoString() {
    return new Date().toISOString();
  }
}

export default new SystemClock();

