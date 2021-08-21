class MalValue {
  pr_str() {
    return '----- default Mal Value ------';
  }
}

const pr_str = (val, print_readably = false) => {
  if (val instanceof MalValue) {
    return val.pr_str();
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
    return '(' + this.ast.map(pr_str).join(' ') + ')';
  }

  isEmpty() {
    return this.ast.length === 0;
  }

  count() {
    return this.ast.length;
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
    return '[' + this.ast.map(pr_str).join(' ') + ']';
  }

  count() {
    return this.ast.length;
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
      string = string + separator + pr_str(key[0] || key) + ' ' + pr_str(value);
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
        .replace('/\n/g', '\\n')
        .replace('/"/g', '\\"')
        .replace('/\\/g', '\\\\');
      return '"' + string + '"';
    }

    return '"' + this.string + '"';
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
  Nil,
  pr_str,
};
