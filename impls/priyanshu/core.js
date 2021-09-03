const {
  List,
  MalSymbol,
  Vector,
  HashMap,
  Nil,
  MalValue,
  Str,
  Atom,
  FN,
} = require('./types');
const {Env} = require('./env');
const {pr_str} = require('./printer');
const {read_str} = require('./reader');
const {readFileSync} = require('fs');

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
  return new Str(val.map((x) => pr_str(x, false)).join(''));
});

repl_env.set(new MalSymbol('list'), (...args) => new List([...args]));
repl_env.set(new MalSymbol('count'), (list) => list.count());
repl_env.set(new MalSymbol('list?'), (arg) => arg instanceof List);

repl_env.set(new MalSymbol('read-string'), (str) => read_str(str.string));
repl_env.set(new MalSymbol('slurp'), (str) => {
  return new Str(readFileSync(__dirname + '/' + str.string, 'utf8'));
});

repl_env.set(new MalSymbol('atom'), (malValue) => new Atom(malValue));
repl_env.set(new MalSymbol('atom?'), (arg) => arg instanceof Atom);
repl_env.set(new MalSymbol('deref'), (atom) => atom.getValue());
repl_env.set(new MalSymbol('reset!'), (atom, malValue) =>
  atom.setRef(malValue)
);

repl_env.set(new MalSymbol('swap!'), (atom, fn, ...fnArgs) =>
  atom.swap(fn, fnArgs)
);

repl_env.set(new MalSymbol('cons'), (arg1, list) => list.prepend(arg1));

repl_env.set(new MalSymbol('concat'), (list1 = new List([]), ...lists) =>
  list1.concat(lists)
);
repl_env.set(new MalSymbol('vec'), (list) => {
  return new Vector(list.ast);
});

repl_env.set(
  new MalSymbol('*ARGV*'),
  new List(process.argv.slice(3).map((arg) => new Str(arg)))
);

module.exports = {repl_env};
