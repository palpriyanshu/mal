const readline = require('readline');

const {read_str} = require('./reader');
const {pr_str} = require('./printer');
const {List, MalSymbol, Vector, HashMap} = require('./types');
const {Env} = require('./env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

const eval_ast = (ast, repl_env) => {
  if (ast instanceof MalSymbol) {
    return repl_env.get(ast);
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

  const firstElement = ast.ast[0].symbol;
  if (firstElement === 'def!') {
    if (ast.ast.length !== 3) {
      throw 'Incorrect number of arguments to def!';
    }
    const value = EVAL(ast.ast[2], repl_env);
    return repl_env.set(ast.ast[1], value);
  }

  if (firstElement === 'let*') {
    if (ast.ast.length !== 3) {
      throw 'Incorrect number of arguments to let*';
    }
    const newEnv = new Env(repl_env);
    const bindings = ast.ast[1].ast;
    for (let i = 0; i < bindings.length; i += 2) {
      newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv));
    }
    return EVAL(ast.ast[2], newEnv);
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
