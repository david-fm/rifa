import Input from "./Input"
import VaribleBlock from "./VariableBlock";
import type { ComponentChildren } from "preact"
import type {  MutableRef } from "preact/hooks";

interface Props{
    name?: string;
}

export default function Prize({name}:Props) {

    function setNameChild(references:MutableRef<ComponentChildren>[]){
        console.log(references)
        for (let i = 0; i < references.length; i++) {
            if(references[i].current.props?.name){
                references[i].current.props.name = i + "-" + "premio"
            }
        }
    }

    return (
        <VaribleBlock manager={setNameChild}>
                <Input placeholder="Premio" name={"premio"}/>
        </VaribleBlock>
    )
}