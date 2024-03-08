import Block from "./Block";
import Button from "./Button";
import { effect, signal } from "@preact/signals";
import { $buying, $token } from "@/store";
import { useStore } from "@nanostores/preact";

const serverURL = import.meta.env.PUBLIC_API;


interface Props{
    precio_ticket: number;
    tickets_disponibles:number;
    
    loggedIn: boolean;

    ticket_id: string | undefined;
}

const comprados = signal(0);
const pagando = signal(false);

export default function Buying({precio_ticket, tickets_disponibles, loggedIn, ticket_id}:Props){
    const token = useStore($token);
    effect(()=>{comprados.value<0?comprados.value=0:null})
    effect(()=>{comprados.value>tickets_disponibles?comprados.value=tickets_disponibles:null})

    function handlePagar(){

        if(comprados.value>0)
        {
            if(loggedIn)
            {
                fetch(`${serverURL}api/rifa/buy/`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        campania: ticket_id,
                        cantidad: comprados.value
                    })
                })
                alert("Redirigiendo a la pasarela de pago...");
                
            }
            else
            {
                if(ticket_id)
                    $buying.set(ticket_id);

                alert("Debes iniciar sesión para comprar tickets");
                window.location.replace("/login");
            }
            
                
        }
            
    }

    return(
        <>
        <div class="w-full sticky self-start top-0">
            <section class="py-8 flex flex-col gap-3 border-slate-300 border-b-2 w-full">
                <h2 class="text-center">Cantidad de Tickets</h2>
                <div class="grid grid-cols-2 grid-rows-2 gap-y-8 gap-x-12">
                    <Block onClick={()=>{comprados.value+=1}} text="+ 01" textButton="Añadir"/>
                    <Block onClick={()=>{comprados.value+=5}} text="+ 05" textButton="Añadir"/>
                    <Block onClick={()=>{comprados.value+=10}} text="+ 10" textButton="Añadir"/>
                    <Block onClick={()=>{comprados.value+=20}} text="+ 20" textButton="Añadir"/>
                </div>
                <div class="flex justify-evenly items-center">
                    <Button onClick={()=>{comprados.value-=1}} type="button" text="-" extraClass="!w-auto"/>
                    <p>{comprados.toString()}</p>
                    <Button onClick={()=>{comprados.value+=1}} type="button" text="+" extraClass="!w-auto"/>
                </div>
            </section>
            <section class="py-8 px-12 flex flex-col gap-3 w-full">
                <div class="flex justify-between">
                    <p>Precio x Numero</p><p>{precio_ticket}€</p>
                </div>
                <div class="flex justify-between">
                <p>Precio x Numero</p><p>{precio_ticket*comprados.value}€</p>
                </div>
                <Button text="PAGAR" type="button" extraClass="justify-center w-auto mt-5 mx-auto hover:-translate-y-3 hover:shadow-lg transition-all" onClick={handlePagar}/>
            </section>
        </div>
        {pagando.value?
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div class="bg-white p-8 rounded-lg">
                <h2 class="text-center">PAGANDO</h2>
                <p class="text-center">Espere un momento</p>
                <Button text="Cancelar" type="button" extraClass="justify-center w-auto mt-5 hover:-translate-y-3 hover:shadow-lg transition-all" onClick={()=>{pagando.value=false}}/>
            </div>
        </div>
        :null
        }
        </>
    )
}