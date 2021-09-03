class MalValue {
  pr_str() {
    return '----- default Mal Value ------';
  }
}

const pr_str = (val, print_readably = false) => {
  if (val instanceof MalValue) {
    return val.pr_str(print_readably);
  }

  if (val instanceof Function) {
    return '#<function>';
  }

  return val.toString();
};

class List extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  pr_str(print_readably = false) {
    return '(' + this.ast.map((e) => pr_str(e, print_readably)).join(' ') + ')';
  }

  isEmpty() {
    return this.ast.length === 0;
  }

  count() {
    return this.ast.length;
  }

  prepend(arg) {
    return new List([arg, ...this.ast]);
  }

  concat(lists) {
    const flatList = lists.flatMap((list) => list.ast);
    return new List(this.ast.concat(flatList));
  }
}

class Vector extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  isEmpty() {
    return this.ast.length === 0;
  }

  pr_str(print_readably = false) {
    return '[' + this.ast.map((e) => pr_str(e, print_readably)).join(' ') + ']';
  }

  count() {
    return this.ast.length;
  }

  prepend(arg) {
    return new List([arg, ...this.ast]);
  }

  concat(lists) {
    const flatList = lists.flatMap((list) => list.ast);
    return new List(this.ast.concat(flatList));
  }
}

class HashMap extends MalValue {
  constructor(hashMap) {
    super();
    this.hashMap = hashMap;
  }

  pr_str(print_readably = false) {
    let string = '';
    let separator = '';
    for (const [key, value] of this.hashMap.entries()) {
      string =
        string +
        separator +
        pr_str(key, print_readably) +
        ' ' +
        pr_str(value, print_readably);
      separator = ' ';
    }
    return '{' + string + '}';
  }
}

class Str extends MalValue {
  constructor(string) {
    super();
    this.string = string;
  }

  pr_str(print_readably = false) {
    if (print_readably) {
      const string = this.string
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
      return '"' + string + '"';
    }

    return this.string;
  }
}

class Keyword extends MalValue {
  constructor(keyword) {
    super();
    this.keyword = keyword;
  }

  pr_str(print_readably = false) {
    return ':' + this.keyword;
  }
}

class Comment extends MalValue {
  constructor(comment) {
    super();
    this.comment = comment;
  }

  pr_str(print_readably = false) {
    return '';
  }
}

class Identifier extends MalValue {
  constructor(identifier) {
    super();
    this.identifier = identifier;
  }

  pr_str(print_readably = false) {
    return this.identifier;
  }
}

class MalSymbol extends MalValue {
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }

  pr_str(print_readably = false) {
    return this.symbol;
  }
}

class FN extends MalValue {
  constructor(binds, fnBody, env, fn) {
    super();
    this.binds = binds;
    this.fnBody = fnBody;
    this.env = env;
    this.fn = fn;
  }

  pr_str(print_readably = false) {
    return '#<function>';
  }

  apply(args) {
    return this.fn.apply(null, args);
  }
}

class Atom extends MalValue {
  constructor(malValue) {
    super();
    this.malValue = malValue;
  }

  pr_str(print_readably = false) {
    return `(atom ${this.malValue})`;
  }

  getValue() {
    return this.malValue;
  }

  setRef(value) {
    this.malValue = value;
    return value;
  }

  swap(fn, args) {
    let newValue;
    if (fn instanceof FN) {
      newValue = fn.apply([this.malValue, ...args]);
    } else {
      newValue = fn(this.malValue, ...args);
    }

    return this.setRef(newValue);
  }
}

class NilValue extends MalValue {
  constructor() {
    super();
  }

  pr_str(print_readably = false) {
    return 'nil';
  }
}

const Nil = new NilValue();

module.exports = {
  MalValue,
  List,
  Vector,
  HashMap,
  Str,
  Keyword,
  MalSymbol,
  Identifier,
  Comment,
  FN,
  Nil,
  Atom,
  pr_str,
};
