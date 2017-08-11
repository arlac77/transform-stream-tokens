import Token from './token';

export class OperatorToken extends Token {
  static get value() {
    return '';
  }

  static register(tokenizer) {
    const value = this.value;
    const firstChar = value[0];
    const maxLength = tokenizer.maxTokenLengthForFirstChar[firstChar] || 0;

    if (maxLength < value.length) {
      tokenizer.maxTokenLengthForFirstChar[firstChar] = value.length;
    }

    const p = tokenizer.registeredTokens[value];
    if (p) {
      this.nud = p.nud;
    }

    tokenizer.registeredTokens[value] = this;
  }

  static parse(pp) {
    pp.offset += this.value.length;
    const t = new this();
    //console.log(`${t.name} ${t.type}`);
    return t;
  }

  get value() {
    return this.name;
    //return this.constructor.value;
  }

  get type() {
    return 'operator';
  }
}

export class InfixOperatorToken extends OperatorToken {
  led(grammar, left) {
    return this.combine(left, grammar.expression(this.precedence));
  }
}

export class InfixRightOperatorToken extends OperatorToken {
  led(grammar, left) {
    return this.combine(left, grammar.expression(this.precedence - 1));
  }
}

export class PrefixOperatorToken extends OperatorToken {
  nud(grammar, left) {
    return this.combine(left, grammar.expression(this.precedence));
  }
}

export function makeOperatorTokens(baseToken, tokenDefinitions) {
  const tokens = [];

  Object.keys(tokenDefinitions).forEach(key => {
    tokens.push(
      class X extends baseToken {
        static get value() {
          return key;
        }

        get name() {
          return key;
        }

        get value() {
          return this.name;
        }
      }
    );
  });

  return tokens;
}