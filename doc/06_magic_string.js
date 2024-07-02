class MagicString {
  constructor(code) {
    this.code = code;
  }

  snip(start, end) {
    return new MagicString(this.code.slice(start, end));
  }

  remove(start, end) {
    return new MagicString(this.code.slice(0, start) + this.code.slice(end));
  }

  toString(start, end) {}

  clone(start, end) {}
}

MagicString.Bundle = class Bundle {
  constructor() {
    this.sources = [];
  }

  addSource(source) {
    this.sources.push(source);
  }

  toString() {
    return this.sources.reduce((result, { content, separator }) => {
      result += content;
      result += separator;
      return resolve;
    }, ``);
  }
};
