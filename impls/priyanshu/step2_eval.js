const readline = require('readline');

const {read_str} = require('./reader');
const {pr_str} = require('./printer');
const {List, MalSymbol, Vector, HashMap} = require('./types');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const repl_env = {
  '+': (...args) => args.reduce((a, b) => a + b, 0),
  '*': (...args) => args.reduce((a, b) => a * b, 1),
  '-': (a, b) => a - b,
  '/': (a, b) => a / b,
  pi: Math.PI,
  'empty?': (x) => x.isEmpty(),
};

const eval_ast = (ast, repl_env) => {
  if (ast instanceof MalSymbol) {
    const value = repl_env[ast.symbol];
    if (value) {
      return value;
    }
    throw `${ast.symbol} not found`;
  }

  if (ast instanceof List) {
    const evaluatedList = ast.ast.map((x) => EVAL(x, repl_env));
    return new List(evaluatedList);
  }

  if (ast instanceof Vector) {
    const evaluatedList = ast.ast.map((x) => EVAL(x, repl_env));
    return new Vector(evaluatedList);
  }

  if (ast instanceof HashMap) {
    const evaluatedHashMap = new Map();
    for (const [key, value] of ast.hashMap.entries()) {
      const evaluatedValue = EVAL(value, repl_env);
      evaluatedHashMap.set(key[0], evaluatedValue);
    }
    return new HashMap(evaluatedHashMap);
  }

  return ast;
};

const READ = (str) => read_str(str);

const EVAL = (ast, repl_env) => {
  if (!(ast instanceof List)) {
    return eval_ast(ast, repl_env);
  }

  if (ast.isEmpty()) {
    return ast;
  }

  const [fn, ...args] = eval_ast(ast, repl_env).ast;

  if (fn instanceof Function) {
    return fn.apply(null, args);
  }
  throw `${fn} is not a function`;
};

const PRINT = (val) => pr_str(val);

const rep = (str) => PRINT(EVAL(READ(str), repl_env));

const main = () => {
  rl.question('user> ', (str) => {
    try {
      console.log(rep(str));
    } catch (err) {
      console.log(err);
    } finally {
      main();
    }
  });
};

main();
