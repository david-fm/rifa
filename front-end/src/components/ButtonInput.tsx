import Button from "./Button"
import Input from "./Input"
import { useSignal } from "@preact/signals";
import { Signal } from "@preact/signals";
const serverURL = import.meta.env.PUBLIC_API;



export default function ButtonInput() {
    interface Results{
        id: number;
        title: string;
        creador: string;
    }

    const showInput = useSignal<boolean>(false);
    const results:Signal<Results[]> = useSignal<Results[]>([]);

    async function searchRifa(e: Event){
        if(e.target)
        {
            const input = e.target as HTMLInputElement;
            const response = await fetch(`${serverURL}api/rifa/?search=${input.value}`);
            const data = await response.json();
            if(data.length)
                results.value = data;
            else
                results.value = [];
            
        }
    }

    function handleClick() {
        showInput.value = !showInput.value;
    }
    return(
        <div>
            <Button type='button' text='ACCEDER A RIFA' id="ref-button" extraClass=" relative z-10 rounded-t-sm" onClick={handleClick}/>
            
            
                
            <Input placeholder='Buscar rifas' extraClass={(showInput.value?" opacity-100 "+(results.value.length?"":"rounded-b-md"):" opacity-0 -translate-y-8")+" relative z-0 "} type="text" name="search" isRequiered onKeyUp={searchRifa}/>
            <div class={(showInput.value?" opacity-100":" opacity-0 hidden")+" w-64 relative z-0"}>
                {results.value.map((result) => {
                    return(
                        <a class="border block w-full bg-white-smoke p-4" href={`rifa/${result.id}/`}>
                            <p >{result.title}</p>
                            <small>Creador: { result.creador }</small>
                        </a>
                    )
                }
                )}
            </div>
                            
            
		</div>
    )
}