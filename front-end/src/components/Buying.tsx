import Block from "./Block";
import Button from "./Button";
import { effect, signal } from "@preact/signals";
interface Props{
    precio_ticket: number;
    cantidad_tickets:number;
    max_reservas: number;
}

const comprados = signal(0);

export default function Buying({precio_ticket, cantidad_tickets, max_reservas}:Props){

    effect(()=>{comprados.value>max_reservas?comprados.value=max_reservas:null})

    return(
        <>
        <section class="py-8 flex flex-col gap-3 border-slate-300 border-b-2 w-full">
            <h2 class="text-center">Cantidad de Tickets</h2>
            <div class="grid grid-cols-2 grid-rows-2 gap-y-8 gap-x-12">
                <Block onClick={()=>{comprados.value+=1}} text="+ 01" textButton="Añadir"/>
                <Block onClick={()=>{comprados.value+=5}} text="+ 05" textButton="Añadir"/>
                <Block onClick={()=>{comprados.value+=10}} text="+ 10" textButton="Añadir"/>
                <Block onClick={()=>{comprados.value+=20}} text="+ 20" textButton="Añadir"/>
            </div>
            <div class="flex justify-evenly items-center">
                <Button onClick={()=>{comprados.value-=1}} type="button" text="-" extraClass="w-auto"/>
                <p>{comprados.toString()}</p>
                <Button onClick={()=>{comprados.value+=1}} type="button" text="+" extraClass="w-auto"/>
            </div>
        </section>
        <section class="py-8 px-12 flex flex-col gap-3 w-full">
            <div class="flex justify-between">
                <p>Precio x Numero</p><p>{precio_ticket}€</p>
            </div>
            <div class="flex justify-between">
            <p>Precio x Numero</p><p>{precio_ticket*comprados.value}€</p>
            </div>
            <Button text="PAGAR" type="button" extraClass="justify-center mt-5 hover:-translate-y-3 hover:shadow-lg transition-all"/>
        </section>
        </>
    )
}