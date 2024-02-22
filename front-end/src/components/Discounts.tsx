import Input from "./Input"
import VaribleBlock from "./VariableBlock";
import type {  MutableRef } from "preact/hooks";

export default function Discounts() {

    function setNameChild(references:MutableRef<HTMLElement>[]){
        //console.log(references)
        for (let i = 0; i < references.length; i++) {
            const element: HTMLElement = references[i].current;
            if(element.children){
                const input: HTMLInputElement = element.children[1] as HTMLInputElement
                const input2: HTMLInputElement = element.children[3] as HTMLInputElement
                input.name = i + "-" + "cada"
                input2.name = i + "-" + "descuento"
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