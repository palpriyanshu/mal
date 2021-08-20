class MalValue {
  pr_str() {
    return '----- default Mal Value ------';
  }
}

const pr_str = (val) => {
  if (val instanceof MalValue) {
    return val.pr_str();
  }

  return val.toString();
};

class List extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  pr_str() {
    return '(' + this.ast.map(pr_str).join(' ') + ')';
  }
}

class Vector extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  pr_str() {
    return '[' + this.ast.map(pr_str).join(' ') + ']';
  }
}

class HashMap extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  pr_str() {
    const keyValuePairs = Object.keys(this.ast).map((x) => {
      return ' ' + pr_str(x) + ' ' + pr_str(this.ast[x]);
    });
    return '{' + keyValuePairs.toString().trim() + '}';
  }
}

class Str extends MalValue {
  constructor(string) {
    super();
    this.string = string;
  }

  pr_str() {
    console.log(this.string);
    const string = this.string
      .replace('/\n/g', '\\n')
      .replace('/"/g', '\\"')
      .replace('/\\/g', '\\\\');
    return '"' + string + '"';
  }
}

class Keyword extends MalValue {
  constructor(keyword) {
    super();
    this.keyword = keyword;
  }

  pr_str() {
    return ':' + this.keyword;
  }
}

class Comment extends MalValue {
  constructor(comment) {
    super();
    this.comment = comment;
  }

  pr_str() {
    return '';
  }
}

class Identifier extends MalValue {
  constructor(identifier) {
    super();
    this.identifier = identifier;
  }

  pr_str() {
    return this.identifier;
  }
}

class MalSymbol extends MalValue {
  constructor(malSymbol) {
    super();
    this.malSymbol = malSymbol;
  }

  pr_str() {
    return this.malSymbol;
  }
}

class NilValue extends MalValue {
  constructor() {
    super();
  }

  pr_str() {
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
