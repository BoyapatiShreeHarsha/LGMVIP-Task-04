import './App.css';
import { useReducer } from 'react';
import Digitbutton from './components/Digitbutton';
import Operationbutton from './components/Operationbutton';

export const ACTIONS={
  ADD_DIGIT:'add-digit',
  CHOOSE_OPERATION:'choose-operation',
  EVALUATE:'evaluate',
  DEL_DIGIT:'del-digit',
  CLEAR:'clear'
}

let evaluate=({currentOperand,previousOperand,operation})=>{
  let prev=parseFloat(previousOperand);
  let curr=parseFloat(currentOperand);
  if(isNaN(prev)|| isNaN(curr))
  return "";
  let computation="";
  switch(operation)
  {
    case "+":
      computation=prev+curr;
      break;
    case "-":
      computation=prev-curr;
      break;
    case "*":
      computation=prev*curr;
      break;
    case "/":
      computation=prev/curr;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})

let formatOperand=(operand)=>{
  if(operand==null)
  return;
  const [integer,decimal]=operand.split('.');
  if(decimal==null)
  return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

let reducer=(state,{type,payload})=>{
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)
      return {
        ...state,
        currentOperand:payload.digit,
        overwrite:false
      }
      if(payload.digit==="0" && state.currentOperand==="0")
      return state;
      if(payload.digit==="." && state.currentOperand==null)
      return state;
      if(payload.digit==="." && state.currentOperand.includes("."))
      return state;
      if(payload.digit!=="0" && state.currentOperand==="0")
      return {...state,currentOperand:`${payload.digit}`};

      return {...state,currentOperand:`${state.currentOperand||""}${payload.digit}`}
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand==null && state.previousOperand==null)
      return state;

      if(state.currentOperand==null)
      return {...state,operation:payload.operand};

      if(state.previousOperand==null)
      return{
        ...state,
        currentOperand:null,
        operation:payload.operand,
        previousOperand:state.currentOperand
      }

      return {
        ...state,
        currentOperand:null,
        previousOperand:evaluate(state),
        operation:payload.operand
      }
    case ACTIONS.EVALUATE:
      if(state.currentOperand==null || state.previousOperand==null || state.operation==null)
      return state;
      return {
        ...state,
        overwrite:true,
        currentOperand:evaluate(state),
        operation:null,
        previousOperand:null
      };
    case ACTIONS.DEL_DIGIT:
      if(state.overwrite)
      {
        return {
          ...state,
          overwrite:false,
          currentOperand:null
        }
      }
      if(state.currentOperand == null)
      return state;
      if(state.currentOperand.length===1)
      return {
        ...state,
        currentOperand:null
      }
      return{
        ...state,
        currentOperand:state.currentOperand.slice(0,-1)
      }
  }
}

function App() {
  const [{currentOperand,previousOperand,operation}, dispatch] = useReducer(reducer,{})
  return (
    <>
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-output">{formatOperand(previousOperand)}{operation}</div>
        <div className="current-output">{formatOperand(currentOperand)}</div>
      </div>
      <button onClick={()=>dispatch({type:ACTIONS.CLEAR})} className="span-two" >AC</button>
      <button onClick={()=>dispatch({type:ACTIONS.DEL_DIGIT})}>DEL</button>
      <Operationbutton operand="/" dispatch={dispatch}/>
      <Digitbutton digit="1" dispatch={dispatch}/>
      <Digitbutton digit="2" dispatch={dispatch}/>
      <Digitbutton digit="3" dispatch={dispatch}/>
      <Operationbutton operand="*" dispatch={dispatch}/>
      <Digitbutton digit="4" dispatch={dispatch}/>
      <Digitbutton digit="5" dispatch={dispatch}/>
      <Digitbutton digit="6" dispatch={dispatch}/>
      <Operationbutton operand="+" dispatch={dispatch}/>
      <Digitbutton digit="7" dispatch={dispatch}/>
      <Digitbutton digit="8" dispatch={dispatch}/>
      <Digitbutton digit="9" dispatch={dispatch}/>
      <Operationbutton operand="-" dispatch={dispatch}/>
      <Digitbutton digit="." dispatch={dispatch}/>
      <Digitbutton digit="0" dispatch={dispatch}/>
      <button onClick={()=>dispatch({type:ACTIONS.EVALUATE})} className="span-two" >=</button>
    </div>
    </>
  );
}

export default App;
