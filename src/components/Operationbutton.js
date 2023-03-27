import React from 'react'
import { ACTIONS } from '../App'

function Operationbutton({operand,dispatch}) {
    
  return (
    <button onClick={()=>{dispatch({type:ACTIONS.CHOOSE_OPERATION,payload:{operand}})}}>{operand}</button>
  )
}

export default Operationbutton
