import Input from "./Input"
import VaribleBlock from "./VariableBlock";
import type { ComponentChildren } from "preact"
import type {  MutableRef } from "preact/hooks";
interface Props{
}


export default function Discounts() {

    function setNameChild(references:MutableRef<ComponentChildren>[]){
        //console.log(references)
        for (let i = 0; i < references.length; i++) {
            if(references[i].current.props?.children){
                references[i].current.props.children[1].props.name = i + "-" + "cada"
                references[i].current.props.children[3].props.name = i + "-" + "descuento"
            }
        }
    }

    return (
        <VaribleBlock manager={setNameChild}>
            <div class="grid grid-cols-2 grid-rows-2 gap-y-1">
                <label htmlFor={"cada"} class="flex items-center">Cada</label>
                <Input placeholder="10" name={"cada"} extraClass="w-auto"/>
                <label htmlFor={"descuento"} class="flex items-center">Precio</label>
                <Input placeholder="5" name={"descuento"} extraClass="w-auto"/>
            </div>
        </VaribleBlock>
    )
}