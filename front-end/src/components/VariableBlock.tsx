import {Signal, useSignal,effect} from "@preact/signals"
import type { ComponentChildren } from "preact"
import { useRef, type MutableRef } from "preact/hooks";
interface Props{
    children: ComponentChildren;
    manager?: (references:MutableRef<ComponentChildren>[])=>void;
}

export default function VaribleBlock({children,manager}:Props){
    // repeat the children n times
    const n = useSignal(1)
    const childrens = Array(n.value).fill(1).map((el,i) => children)
    const references = childrens.map((c) => useRef(c))

    const handleOnPlus = () => {
        n.value += 1
    }
    const handleOnMinus = () => {
        n.value -= 1
    }
    /*
    const setNameChildren = (children:ComponentChildren, i:number) => {
        console.log(references)
        console.log(references[i].current.props?.children? references[i].current.props?.children[1]?.props.name:"Empty")
        // if(children.props.name){
        //     children.props.name = n.value + "-" + children.props.name
        // }
    }*/
    /*effect(() => {
        const blocksContainer = document.getElementById("blocksContainer")
        if(blocksContainer){
            blocksContainer.childNodes.forEach((el,i) => setNameChildren(children,i))
        }
    })*/
    
    //setNameChildren(children,0)
    if(manager){
        manager(references)
    }
    return (
        <>
            <div class="flex flex-col gap-2" id="blocksContainer">
            {childrens.map((el,i) => el)}
            </div>
            <div class="flex gap-1">
                <button type="button" class=" text-4xl" onClick={handleOnPlus}>+</button>
                <button type="button" class="text-4xl" onClick={handleOnMinus}>-</button>
            </div>
            
        </>
    )
}