const {
  List,
  Vector,
  Str,
  HashMap,
  Keyword,
  MalSymbol,
  Identifier,
  Nil,
} = require('./types');

class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.tokens[this.position];
    if (this.position < this.tokens.length) {
      this.position++;
    }
    return token;
  }
}

const isInteger = (token) => {
  //checking if a num is int; + check atLeast 1 appearance , ^ checks start with, $ checks end with

  return token.match(/^[0-9]+$/);
};

const isFloat = (token) => {
  //checking if a num is int; + check atLeast 1 appearance , * check 0 or more appearance, $ checks end with

  return token.match(/^-?[0-9][0-9.]*$/);
};

const read_seq = (reader, closeStr) => {
  const ast = [];
  reader.next();
  while (reader.peek() !== closeStr) {
    if (reader.peek() === undefined) {
      throw 'unbalanced';
    }
    ast.push(read_form(reader));
  }
  reader.next();
  return ast;
};

const read_list = (reader) => {
  const ast = read_seq(reader, ')');
  return new List(ast);
};

const read_vector = (reader) => {
  const ast = read_seq(reader, ']');
  return new Vector(ast);
};

const read_hashmap = (reader) => {
  const ast = {};
  let isKey = true;
  const keys = [];
  reader.next();
  while (reader.peek() !== '}') {
    if (reader.peek() === undefined) {
      throw 'unbalanced';
    }
    if (isKey) {
      lastKey = read_form(reader);
    } else {
      ast[lastKey] = read_form(reader);
    }
    isKey = !isKey;
  }
  reader.next();
  return new HashMap(ast);
};

const read_atom = (reader) => {
  const token = reader.next();

  if (isInteger(token)) {
    return parseInt(token);
  }

  if (isFloat(token)) {
    return parseFloat(token);
  }

  if (token === 'false') {
    return false;
  }

  if (token === 'true') {
    return true;
  }

  if (token === 'nil') {
    return Nil;
  }

  if (token.startsWith(':')) {
    return new Keyword(token.slice(1));
  }

  if (token.match(/^"(?:\\.|[^\\"])*"$/)) {
    return new Str(token.slice(1, -1));
  }

  if (token.startsWith('"')) {
    throw 'unbalanced "';
  }

  return new MalSymbol(token);
};

const tokenize = (str) => {
  const regex =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...str.matchAll(regex)].map((element) => element[1]).slice(0, -1);
};

const read_form = (reader) => {
  const token = reader.peek();

  switch (token[0]) {
    case '(':
      return read_list(reader);
    case '[':
      return read_vector(reader);
    case '{':
      return read_hashmap(reader);
    case ')':
      throw 'unbalance )';
    case ']':
      throw 'unbalance ]';
    case '}':
      throw 'unbalance }';
  }

  return read_atom(reader);
};

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = {Reader, read_str};
