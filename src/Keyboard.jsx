import React, {Component} from 'react';
import './Keyboard.css'


export const KEYS = [
  'AC', '(', ')', '÷',
  '7', '8', '9', 'x',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  'Del', '0', '.', '='
];

function Key(props) {
  return (
    <button className="keyboard-item" type="button" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

export class Keyboard extends Component {
  render() {
    const keysWrapper = KEYS.map((value, index) => (
      <Key key={value} value={value} onClick={() => this.props.onClick(index)}></Key>
    ));
    return (

      <div className="keyboard">
        {keysWrapper}
      </div>
    )
  }
}
