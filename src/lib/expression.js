/* 主要算法: 利用了堆栈数据结构 */

function validateExpression(exprStr) {
  let exprArray = exprStr.replace(/\s/g, '').split('');
  let operator = ['+', '-', 'x', '÷'];
  let lastExprOp = exprArray.slice().pop();
  // operator 和 '(' 不能位于末尾
  if (operator.includes(lastExprOp) || lastExprOp === '(') {
    return false;
  }
  return checkBracket(exprArray);
}

function checkBracket(exprArray) {
  /* 括号配对处理 */
  let bracketStack = [];
  // 判断左右括号个数是否相等
  let count = 0;
  exprArray.forEach((value, index) => {
    if (value === '(') {
      count++;
      bracketStack.push(index);
    }else if (value === ')') {
      count--;
      if (bracketStack.pop() === index - 1) {
        // just to break the balance
        count--;
      };
    }
  })
  /* todo */
  for (let i = 1; i < exprArray.length - 1; i++) {
    let previous = opType(exprArray[i - 1]);
    let next = opType(exprArray[i + 1])
    if (exprArray[i] === '(') {
      if (!(previous.isOperator || previous.isBracket) || !(next.isNumber || next.isBracket)) {
        return false;
      }
    }else if (exprArray[i] === ')') {
      if (!(previous.isNumber || previous.isBracket) || !(next.isOperator || next.isBracket)) {
        return false;
      }
    }
  }
  return bracketStack.length === 0 && count === 0;
}

function priority(op) {
  switch(op) {
    case '+':
    case '-':
      return 1;
    case 'x':
    case '÷':
      return 2;
    default:
      return 0;
  }
}
function comparePriority(a, b) {
  return (priority(a.replace(/\s/g, '')) - priority(b.replace(/\s/g, ''))) >= 0
}

function toPostFixExpr(infixExprArray) {
  if (!Array.isArray(infixExprArray)) {
    throw Error("Parameter of function toPostFixExpr must be an array or a string");
  }
  // 存储操作符
  let output = [];
  let operatorStack = [];
  // the top operator of operatorStack
  let topOperator;
  // 存储操作数
  infixExprArray.forEach(op => {
    let {isOperator, isLeftBracket, isRightBracket, isNumber} = opType(op);
    if (isNumber) {
      output.push(parseFloat(op));
    }else if (isOperator){
      for (let i = 0; i < operatorStack.length; i++) {
        topOperator = operatorStack.slice().pop();
        if (comparePriority(topOperator, op) && topOperator !== '(') {
          output.push(operatorStack.pop());
        }else if (topOperator === '(') {
          break;
        }
      }
      operatorStack.push(op);
    }else if (isLeftBracket) {
      operatorStack.push(op);
    }else if (isRightBracket) {
      operatorStack.slice().forEach(() => {
        topOperator = operatorStack.slice().pop();
        if (topOperator !== '(') {
          output.push(operatorStack.pop());
        }else if (topOperator === '(') {
          operatorStack.pop();
        }
      });
    }
  });
  operatorStack.slice().forEach(() => {
    output.push(operatorStack.pop());
  });
  return output;
}

function calculate(postFixExpr) {
  let operandStack = [];
  let result;
  postFixExpr.forEach((value) => {
    if (typeof(value) === 'number') {
      operandStack.push(value);      
    }else {
      switch(value.replace(/\s/g, '')) {
        case '-':
          result = -operandStack.pop() + operandStack.pop();
          break;
        case 'x':
          result = operandStack.pop() * operandStack.pop();
          break;
        case '÷':
          if (operandStack.slice().pop() === 0) {
            throw Error("0 不能作为被除数");
          }
          result = 1 / operandStack.pop() * operandStack.pop();
          break;
        default:
          result = operandStack.pop() + operandStack.pop();
          break;
      }
      operandStack.push(result);
    }
  })
  return operandStack.pop();
}
function opType(op) {
  let isOperator = ['+', '-', 'x', '÷'].includes(op.replace(/\s/g, ''));
  let isLeftBracket = op === '(';
  let isRightBracket = op === ')';
  let isBracket = isLeftBracket || isRightBracket;
  let isDot = op === '.';
  let isNumber = isStringNumber(op);
  return {
    isOperator,
    isBracket,
    isLeftBracket,
    isRightBracket,
    isNumber,
    isDot,
  }
}

function isStringNumber(str) {
  return Number.isInteger(parseInt(str));
}

export {
  validateExpression,
  opType,
  isStringNumber,
  toPostFixExpr,
  calculate,
}

