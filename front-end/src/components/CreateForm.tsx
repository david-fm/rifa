import Input from "./Input"
import Select from "./Select"
import Button from "./Button"
import Discounts from "./Discounts"
import Prize from "./Prize"
import { useSignal } from "@preact/signals"
import { useRef } from "preact/hooks"
interface Props {
}


export default function CreateForm({}: Props) {

    const signal = useSignal(0)
    const form = useRef<HTMLFormElement>(null);

    const info = [
        (<div class="w-[400px] px-8 lg:px-0">
            <h2 class="pb-5">Información general</h2>
            <p class="text-balance">Información general sobre la campaña, Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum debitis possimus corporis, id soluta iste voluptatibus nam itaque quaerat nisi!</p>
        </div>),
        (<div class="w-[400px] px-8 lg:px-0">
            <h2 class="pb-5">Ranking</h2>
            <p class="text-balance">Información sobre el <b>ranking</b> de la campaña</p>
        </div>),
        (<div class="w-[400px] px-8 lg:px-0">
            <h2 class="pb-5">Tickets</h2>
            <p class="text-balance">Información sobre los <b>tickets</b></p>
        </div>),
        (<div class="w-[400px] px-8 lg:px-0">
            <h2 class="pb-5">Descuentos</h2>
            <p class="text-balance">Descuentos por cantidad de tickets</p>
        </div>  ),
        (<div class="w-[400px] px-8 lg:px-0">
            <h2 class="pb-5">Premios</h2>
            <p class="text-balance">Información sobre los premios</p>
        </div>)

    ]

    function handleSubmition(){
        form.current?.submit();
    }
    return (
        <div class="h-full w-full flex justify-center items-center">
            <div class="flex flex-col lg:flex-row-reverse max-w-screen-lg gap-10 lg:gap-32 items-center">
            {info[signal.value]}
                
            <form action="" class="relative w-[400px] px-8 lg:px-0 top-0 left-0 pt-4 flex flex-col gap-6 " id="crea-rifa" ref={form}>
                <div class={(signal.value==0?"flex flex-col gap-8 items-center":"hidden ")}>
                    <Input placeholder='Nombre de la rifa' name='nombre' />

                    <Input name='imagen' type='file' placeholder="Imagen de la campaña" extraClass='bg-white-smoke !drop-shadow-none cursor-pointer border-2'/>
                    
                    <Input placeholder='Reglamento de la campaña' name='reglamento' big rows={5} />
                </div>
                
                <div class={(signal.value==1?"flex flex-col gap-8 items-center":"hidden ")}>
                    <div class="flex items-center justify-center gap-2 ">
                        <p class=" shrink-0">¿Esta activo?</p>
                        <Input name='ranking-activo' type='checkbox' extraClass="w-auto"/>
                    </div>
                    <Input placeholder='Incentivos en el ranking' name='reglamento' big rows={5}  />
                </div>
                <div class={(signal.value==2?"flex flex-col gap-8 items-center":"hidden ")}>
                    <Select form="crea-rifa" name="numero-de-ticket" />
                    
                    <Input placeholder='Precio de los tickets' name='precio-ticket' />
                    <Input placeholder='Maximo número de tickets' name='numero-ticket' />
                    <Input placeholder="Tickets necesarios" name="tickets-necesarios" />
                </div>
                <div class={(signal.value==3?"flex flex-col gap-8 items-center":"hidden ")}>
                    <Discounts />
                </div>
                <div class={(signal.value==4?"flex flex-col gap-8 items-center":"hidden ")}>
                    <Prize />
                </div>         
                {signal.value==info.length?
                    <Button type="button" text="CREAR" onClick={handleSubmition}/>
                    :
                    <div class="flex gap-1">
                        <Button type="button" text="ANTERIOR" onClick={()=>signal.value -= 1}/>
                        <Button type="button" text="SIGUIENTE" onClick={()=>signal.value += 1}/>
                    </div>
                }
            </form>
            </div>
        </div>
        
    )
}