import React from "react"
import { ILook } from "@looker/sdk"
import { ListItem } from "./ListItem";

interface LookListProps {
    looks: ILook[]
    loading: boolean
    callback: (look: ILook) => void
}

export const LookList: React.FC<LookListProps> = (props) => {
  return (
    <div style={{width: "auto", float: "left", marginTop: 10}}>
        <h3>Look List</h3>
        {
            props.loading ?
            (<h4 style={{marginRight: 30}}>Loading...</h4>) :
            (
                <ul style={{padding: 10}}>
                {props.looks.map(look => {
                    return (
                        look.id !== undefined ?
                        (<ListItem key={look.id} id={look.id!} label={look.title!} callback={() => props.callback(look)}/>) :
                        (<h4 key="error">Failed to load</h4>)
                    )
                })}
            </ul>
            )
        }
    </div>
  )
}