import Token from './token';

export class IdentifierToken extends Token {
  static get firstChars() {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_';
  }

  static parse(tokenizer) {
    let i = tokenizer.chunkOffset + 1;
    for (;;) {
      const c = tokenizer.chunk[i];
      if (
        (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9') ||
        c === '_'
      ) {
        i += 1;
      } else {
        break;
      }
    }

    const o = tokenizer.chunkOffset;
    tokenizer.chunkOffset = i;
    return new this(tokenizer.chunk.substring(o, i));
  }

  constructor(value) {
    super();
    Object.defineProperty(this, 'value', { value: value });
  }

  get type() {
    return 'identifier';
  }
}
