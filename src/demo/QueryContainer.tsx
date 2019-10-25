import React from "react"
import { ILook } from "@looker/sdk";

export interface QueryProps {
  look?: ILook,
  results?: string
  running: boolean
}

export const QueryContainer: React.FC<QueryProps> = (props) => {
  return (
    <div style={{float: "left", width: "50%", height: "auto", margin: "10 0 0 10"}}>
      <h4>
        Query:
        {
          props.look ? " " + (props.look.title) : ""
        }
      </h4>
      <textarea style={{width: "90%", height: 300}} value={props.running ? "Running Query" : (props.results ? (props.results) : "")} readOnly/>
    </div>
  )
}