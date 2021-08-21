const {MalSymbol} = require('./types');

class Env {
  constructor(outer = null) {
    this.data = new Map();
    this.outer = outer;
  }

  set(key, malValue) {
    if (!(key instanceof MalSymbol)) {
      throw `${key} is not a symbol`;
    }
    this.data.set(key.symbol, malValue);
    return malValue;
  }

  find(key) {
    if (this.data.has(key.symbol)) {
      return this;
    }

    return this.outer && this.outer.find(key);
  }

  get(key) {
    const env = this.find(key);
    if (env === null) {
      throw `${key.symbol} not found`;
    }

    return env.data.get(key.symbol);
  }

  static createEnv(outer = null, binds = [], exprs = []) {
    const env = new Env(outer);
    binds.forEach((symbol, index) => {
      env.set(symbol, exprs[index]);
    });

    return env;
  }
}

module.exports = {Env};
