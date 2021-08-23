const {List, MalSymbol, Vector, HashMap, Nil, MalValue} = require('./types');
const {Env} = require('./env');
const {pr_str} = require('./printer');

const repl_env = new Env();
repl_env.set(new MalSymbol('+'), (...args) => args.reduce((a, b) => a + b, 0));
repl_env.set(new MalSymbol('*'), (...args) => args.reduce((a, b) => a * b, 1));
repl_env.set(new MalSymbol('-'), (...args) => {
  if (args.length === 1) {
    args.unshift(0);
  }
  return args.reduce((a, b) => a - b);
});
repl_env.set(new MalSymbol('/'), (...args) => {
  if (args.length === 1) {
    args.unshift(1);
  }
  return args.reduce((a, b) => a / b);
});

repl_env.set(new MalSymbol('pi'), Math.PI);
repl_env.set(new MalSymbol('empty?'), (x) => x.isEmpty());
repl_env.set(new MalSymbol('='), (x, y) => x == y);
repl_env.set(new MalSymbol('>'), (x, y) => x > y);
repl_env.set(new MalSymbol('<'), (x, y) => x < y);
repl_env.set(new MalSymbol('<='), (x, y) => x <= y);
repl_env.set(new MalSymbol('>='), (x, y) => x >= y);

repl_env.set(new MalSymbol('prn'), (val) => {
  const str = pr_str(val, true);
  console.log(str);
  return Nil;
});

repl_env.set(new MalSymbol('println'), (...val) => {
  const str = val.map((x) => pr_str(x, false)).join(' ');
  console.log('' + str + '\n');
  return Nil;
});

repl_env.set(new MalSymbol('str'), (...val) => {
  return val.map((x) => pr_str(x, true)).join('');
});

repl_env.set(new MalSymbol('list'), (...args) => new List([...args]));
repl_env.set(new MalSymbol('count'), (list) => list.count());
repl_env.set(new MalSymbol('list?'), (arg) => arg instanceof List);

module.exports = {repl_env};
