const readline = require('readline');

const {read_str} = require('./reader');
const {pr_str} = require('./printer');
const {List, MalSymbol, Vector, HashMap, Nil, FN} = require('./types');
const {Env} = require('./env');
const {repl_env} = require('./core');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


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
  while (true) {
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
      repl_env = newEnv;
      ast = ast.ast[2];
      continue;
      // return EVAL(ast.ast[2], newEnv);
    }

    if (firstElement === 'do') {
      ast.ast.slice(1, -1).forEach((value) => {
        EVAL(value, repl_env);
      });
      ast = ast.ast[ast.ast.length - 1];
      continue;
    }

    if (firstElement === 'if') {
      const exprs = EVAL(ast.ast[1], repl_env);
      if (exprs === Nil || exprs === false) {
        ast = ast.ast[3] || Nil;
        // return ast.ast[3] !== undefined ? EVAL(ast.ast[3], repl_env) : Nil;
      } else {
        ast = ast.ast[2];
        // return EVAL(ast.ast[2], repl_env);
      }
      continue;
    }

    if (firstElement === 'fn*') {
      const fnref = function (...exprs) {
        const newEnv = Env.createEnv(repl_env, ast.ast[1].ast, exprs);
        return EVAL(ast.ast[2], newEnv);
      };
      return new FN(ast.ast[1].ast, ast.ast[2], repl_env, fnref);
    }

    const [fn, ...args] = eval_ast(ast, repl_env).ast;

    if (fn instanceof FN) {
      ast = fn.fnBody;
      repl_env = Env.createEnv(fn.env, fn.binds, args);
      continue;
    }

    if (fn instanceof Function) {
      return fn.apply(null, args);
    }
    throw `${fn} is not a function`;
  }
};

repl_env.set(new MalSymbol('eval'), (ast) => EVAL(ast, repl_env));
repl_env.set(new MalSymbol('swap!'), (atom, fn, ...fnArgs) => {
  return EVAL(
    new List([
      new MalSymbol('reset!'),
      atom,
      new List([fn, atom.malValue, ...fnArgs]),
    ]),
    repl_env
  );
});

const PRINT = (val) => pr_str(val, true);

const rep = (str) => PRINT(EVAL(READ(str), repl_env));

rep('(def! not (fn* [x] (if x false true)))');
rep('(def! sqr (fn* [x] (* x x)))');
rep('(def! mal-prog (list + 1 2))');
rep(
  '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))'
);

const main = () => {
  if (process.argv.length > 2) {
    const filename = process.argv[2];
    rep(`(load-file "${filename}")`);
    process.exit(0);
  }
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
