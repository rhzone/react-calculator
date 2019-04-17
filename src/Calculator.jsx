import React, { Component } from 'react';
// import logo from './logo.svg';
import './Calculator.css';
import {Keyboard, KEYS} from './Keyboard';
import {validateExpression, opType, isStringNumber, toPostFixExpr, calculate} from './lib/expression';

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expression: ['0'],
    }
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(i) {
    let expression = this.state.expression;
    let key = KEYS[i];
    let result = null;
    let {isOperator, isDot, isNumber, isBracket} = opType(key);
    let lastOp = expression.slice().pop();
    if (key === 'AC') {
      // clear the expression
      expression = ['0'];
    }else if (key === '='){
      // calculate the expression
      if (validateExpression(expression.join(''))) {
        try {
          result = calculate(toPostFixExpr(expression))
        }catch {
          result = "Syntax Error";
        }
      }else {
        result = 'Syntax Error';
      }
    }else if (key === 'Del') {
      if (expression[0] !== '0' && !isStringNumber(lastOp)) {
        expression.pop();
      }else if (expression[0] !== '0' && isStringNumber(lastOp)){
        expression.pop();
        lastOp.slice(0, -1) !== '' && expression.push(lastOp.slice(0, -1))
      }
      expression.length === 0 && expression.push('0');
    }else {
      // change the expression
      // 当第一个 op 为 0, 且式子的长度为 0 时
      if (expression[0] === '0' && expression.length === 1 && (isNumber || isBracket)) {
        expression[0] = key;
      }else if (isOperator) {
        key = ' ' + key + ' ';
        this.state.isOperator && expression.pop();
        expression.push(key);
      }else if (isNumber) {
        if (isStringNumber(lastOp)) {
          expression.push(expression.pop() + key);
        }else {
          expression.push(key);
        }
      }else if (isDot) {
        if (isStringNumber(lastOp) && !lastOp.includes('.')) {
          expression.push(expression.pop() + key);
        }else if(!lastOp.includes('.')) {
          expression.push('0.');
        }
      }else {
        expression.push(key);
      }
    }
    this.setState({
      expression,
      isOperator,
      result,
    });
    
  }
  render() {
    let expression = this.state.expression;
    let result = this.state.result;
    if (typeof(result) === 'number') {
      result = '= ' + result;
    }
    return (
      <div className="calculator">
        <div className="screen-display">
          <span>{expression.join('')}</span>
          <span>{result}</span>
        </div>
        <Keyboard onClick={this.handleClick} />
      </div>
    );
  }
}

export default Calculator;