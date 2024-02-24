import Input from "./Input"
import VaribleBlock from "./VariableBlock";
import type { ComponentChildren } from "preact"
import type {  MutableRef } from "preact/hooks";


export default function Prize() {

    function setNameChild(references:MutableRef<ComponentChildren>[]){
        //console.log(references)
        for (let i = 0; i < references.length; i++) {
            const inputElment: HTMLInputElement = references[i].current as HTMLInputElement
            if(inputElment.name){
                inputElment.name = i + "-" + "premio"
            }
        }
    }

    return (
        <VaribleBlock manager={setNameChild}>
                <Input placeholder="Premio" name={"premio"} isRequiered/>
        </VaribleBlock>
    )
}