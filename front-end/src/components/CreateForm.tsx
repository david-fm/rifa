import Input from "./Input"
import Select from "./Select"
import Button from "./Button"
import Discounts from "./Discounts"
import Prize from "./Prize"
import Image from "./Image"
import { useSignal } from "@preact/signals"
import { useRef } from "preact/hooks"
import { useStore } from "@nanostores/preact"
import { $token } from "../store"
const serverURL = import.meta.env.PUBLIC_API;


export default function CreateForm() {
    // TODO CHECK IF THE FORM IS VALID BEFORE SUBMITTING
    const accessToken = useStore($token);
    const signal = useSignal(0);
    const error = useSignal(false);
    const thersAFile = useSignal(false);

    const toUpdate = useRef<HTMLImageElement>(null);
    const form = useRef<HTMLFormElement>(null);
    

    
    function checkActualInputs(){
        const actualDiv = form.current?.querySelector(`#container-${signal.value}`) as HTMLDivElement | null;
        if(!actualDiv) return null;
        const inputs = actualDiv.querySelectorAll('input, textarea, select') as NodeListOf<HTMLInputElement> | NodeListOf<HTMLTextAreaElement> | NodeListOf<HTMLSelectElement> | null;
        let toReturn:HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null = null;
        inputs?.forEach(input=>{
            if(!(input.type === 'checkbox') && input.required && input.value === ''){
                toReturn = input;
            }
            if(input.tagName === 'SELECT' && input.required && input.value === 'x')
                toReturn = input;
        })
        return toReturn;
    }
    const handlePrevious = () =>{
        if(signal.value > 0)
            signal.value -= 1;
    }
    const handleNext = () =>{
        const input = checkActualInputs() as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
        if(input){
            error.value = true;
            input.focus();
            return;
        }
        if(signal.value < 5)
        {
            error.value = false;
            signal.value += 1;
        }
    }

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
    

    function handleFile(e: Event) {
        
        const element = e.target as HTMLInputElement;
        const file = element.files?.item(0);
        if(file)
        {
            
            const reader = new FileReader();
            reader.onload = function(e){
                if(toUpdate.current)
                {
                    thersAFile.value = true;
                    toUpdate.current.src = e.target?.result as string;
                }
            }
            reader.readAsDataURL(file);
        }
    }
    function handleSubmition(){

        const toSend: Record<string, string| Record<string, string>[]| string[]| Record<string,string|boolean>> = {};
        const prizes = form.current?.querySelectorAll('.prize') as NodeListOf<HTMLInputElement>;

        const prizesArray = Array.from(prizes).map(prize=>prize.value);
        toSend['premios'] = prizesArray;

        const discounts = form.current?.querySelectorAll('.discount') as NodeListOf<HTMLDivElement>;
        const discountsArray = Array.from(discounts).map(discount=>{
            const inputs = discount.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
            const toReturn: Record<string, string> = {};
            inputs.forEach(input=>{
                toReturn[input.name] = input.value;
            });
            return toReturn;
        });
        toSend['ofertas'] = discountsArray;

        const campania = form.current?.querySelectorAll('.campania') as NodeListOf<HTMLInputElement> | NodeListOf<HTMLTextAreaElement> | NodeListOf<HTMLSelectElement> ;

        const campaniaToSend: Record<string, string | boolean> = {};
        campania.forEach(input => {
            if (input.type === 'checkbox' && input instanceof HTMLInputElement) {
                campaniaToSend[input.name] = input.checked;
            } 
            else if (input.tagName === 'SELECT' && input instanceof HTMLSelectElement) {
                campaniaToSend[input.name] = input.value;
            }
            else {
                campaniaToSend[input.name] = input.value;
            }
        });
        toSend['campania'] = campaniaToSend;
        
        const image = form.current?.querySelector('input[type="file"]') as HTMLInputElement;
        const file = image.files?.item(0);

        const formData = new FormData();
        if(file)
            formData.append('foto', file);


        fetch(`${serverURL}api/rifa/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(toSend)
        }).then(r=>r.json()).then(r=>{
            
            formData.append('campania', r.campania)
            // SEND THE IMAGE
            fetch(`${serverURL}api/rifa/`,{
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData
            }).then(r=>{
                if(r.status !== 200)
                    //jump to catch
                    throw new Error('Error');
            }).catch(()=>console.log("Error al enviar la imagen de la rifa"))
            
            window.location.href = '/dashboard/';
        
        }).catch(e=>console.log(e));
    }
    return (
        <div class="h-full w-full flex justify-center items-center">
            <div class="flex flex-col lg:flex-row-reverse max-w-screen-lg gap-10 lg:gap-32 items-center">
            {info[signal.value]}
                
            <form action="" class="relative w-[400px] px-8 lg:px-0 top-0 left-0 pt-4 flex flex-col gap-6 " id="crea-rifa" ref={form}>
                <div class={(signal.value==0?"flex flex-col gap-8 items-center":"hidden ")} id="container-0">
                    <Input extraClass="campania" placeholder='Nombre de la rifa' name='nombre' isRequiered/>
                    <Image src="" alt ="Imagen de la campaña" imgRef={toUpdate} classList={thersAFile.value?"":"hidden"}/>
                    
                    <Input  name='foto' type='file' placeholder="Imagen de la campaña" extraClass='bg-white-smoke !drop-shadow-none cursor-pointer border-2' isRequiered myOnInput={handleFile}/>
                    
                    <Input extraClass="campania" placeholder='Reglamento de la campaña' name='reglamento' big rows={5} isRequiered/>
                </div>
                
                <div class={(signal.value==1?"flex flex-col gap-8 items-center":"hidden ")} id="container-1">
                    <div class="flex items-center justify-center gap-2 ">
                        <p class=" shrink-0">¿Esta activo?</p>
                        <Input name='ranking_activo' type='checkbox' extraClass="w-auto campania" isRequiered/>
                    </div>
                    <Input extraClass="campania" placeholder='Incentivos en el ranking' name='info_ranking' big rows={5}  isRequiered/>
                </div>
                <div class={(signal.value==2?"flex flex-col gap-8 items-center":"hidden ")} id="container-2">
                    <Select form="crea-rifa" name="cantidad_tickets" extraClass="campania" isRequiered/>
                    
                    <Input extraClass="campania" placeholder='Precio de los tickets' name='precio_ticket' isRequiered/>
                    {/* {<Input extraClass="campania" placeholder='Compras maximas por usuario' name='max_reservas' isRequiered/>} */}
                    <Input extraClass="campania" placeholder="Tickets necesarios" name="tickets_necesarios" isRequiered/>
                </div>
                <div class={(signal.value==3?"flex flex-col gap-8 items-center":"hidden ")} id="container-3">
                    <Discounts />
                </div>
                <div class={(signal.value==4?"flex flex-col gap-8 items-center":"hidden ")} id="container-4">
                    <Prize />
                </div>         
                { error.value && <p>Rellena todos los datos</p>}
                <div class="flex gap-1">
                    
                    <Button type="button" text="ANTERIOR" onClick={handlePrevious}/>
                    {
                    signal.value==info.length?
                        <Button type="button" text="CREAR" onClick={handleSubmition}/>
                        :
                        <Button type="button" text="SIGUIENTE" onClick={handleNext}/>
                    }

                </div>
            </form>
            </div>
        </div>
        
    )
}