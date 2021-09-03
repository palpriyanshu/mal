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

class Sequence extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  equal(other) {
    if (!(other instanceof Sequence)) {
      return false;
    }

    other.ast.forEach((ele, index) => {
      if (element instanceof MalValue) {
        return element.equal(this.ast[index]);
      }
      return ele === this.ast[index];
    });

    if (this.ast.length === 0 && other.ast.length === 0) {
      return true;
    }

    return false;
  }
}

class List extends Sequence {
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

class Vector extends Sequence {
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

  equal(other) {
    if (!(other instanceof HashMap)) {
      return false;
    }

    return this.hashMap === other.hashMap;
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

  equal(other) {
    if (!(other instanceof Str)) {
      return false;
    }
    return this.string === other.string;
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

  equal(other) {
    if (!(other instanceof Keyword)) {
      return false;
    }

    return this.keyword === other.keyword;
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

  equal(other) {
    if (!(other instanceof Comment)) {
      return false;
    }
    return this.comment === other.comment;
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

  equal(other) {
    if (!(other instanceof Identifier)) {
      return false;
    }
    return this.identifier === other.identifier;
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

  equal(other) {
    if (!(other instanceof MalSymbol)) {
      return false;
    }

    return this.symbol === other.symbol;
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

  equal(other) {
    if (!(other instanceof Function)) {
      return false;
    }
    return true;
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

  equal(other) {
    if (!(other instanceof Atom)) {
      return false;
    }

    if (other.malValue instanceof MalValue) {
      return other.malValue.equal(this.malValue);
    }

    return other.malValue === this.malValue;
  }
}

class NilValue extends MalValue {
  constructor() {
    super();
  }

  pr_str(print_readably = false) {
    return 'nil';
  }

  equal(other) {
    if (!(other instanceof Sequence)) {
      return false;
    }
    return false;
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
