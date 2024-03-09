import Image from "@/components/Image";
import Button from "@/components/Button";
import { useStore } from "@nanostores/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Signal } from "@preact/signals";
import { $token, $isCreador } from "@/store";
const serverURL = import.meta.env.PUBLIC_API;

export default function DashboardContent() {

    const token = useStore($token);
    const isCreador = useStore($isCreador);
    interface Rifa {
        foto: string;
        nombre: string;
        reglamento: string;
        id: number;
    }

    interface Ticket{
        foto: string; // URL de la foto de la rifa
        nombre: string; // Nombre de la rifa
        id_ticket: number; // ID del ticket
        id_campania: number; // ID de la rifa
    }
    
    
    
    const rifasData: Signal<Rifa[]> = useSignal<Rifa[]>([]);
    const ticketsData: Signal<{ [id_campania: string]: Ticket[] }> = useSignal<{ [id_campania: string]: Ticket[] }>({});
    const watching = useSignal<'rifas' | 'tickets'>(isCreador ? 'rifas' : 'tickets');

    const ticketsToTicketsData = (tickets: Ticket[]) => {
        const ticketsData: { [id_campania: number]: Ticket[] } = {};
        for (const ticket of tickets){
            if (ticketsData[ticket.id_campania]){
                ticketsData[ticket.id_campania].push(ticket);
            }
            else{
                ticketsData[ticket.id_campania] = [ticket];
            }
        }
        return ticketsData;
    }

    useEffect(() => {
        fetch(serverURL+'/api/dashboard/',{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            rifasData.value = data.campanias;
            ticketsData.value = ticketsToTicketsData(data.tickets);
        });
    }, []);

    return (
        <div class="h-full">
    
        <div class="flex flex-col justify-center items-center px-8">
        <div class="flex justify-center items-center gap-8">
            {isCreador ?
                <>
                <h2 
                class={"border-b-2 hover:border-textos cursor-pointer"+ (watching.value === 'rifas' ? " border-textos" : "")}
                onClick={()=>watching.value = 'rifas'}>
                    Tus Rifas
                </h2>
                <h2 
                class={"border-b-2 hover:border-textos cursor-pointer"+ (watching.value === 'tickets' ? " border-textos" : "")}
                onClick={()=>watching.value = 'tickets'}>
                    Tus Tickets
                </h2>
                </>
            :
            <h2>
                Tus Tickets
            </h2>
            }
        </div>
        
        <div class="h-full w-full flex flex-col justify-center items-center">
            
            <ul class="flex flex-col  max-w-screen-lg gap-12 items-center pt-6">
                {watching.value === 'rifas' ?
                    rifasData.value.map((rifa) => (
                    <li class="hover:shadow-md hover:-translate-y-6 transition-all">
                        <a href={`/rifa/${rifa.id.toString()}`}>
                        <article class="flex flex-col items-center md:items-stretch md:flex-row gap-8 p-8">
                        <Image classList="shrink-0" src={serverURL+rifa.foto} alt={`Foto de la campaña ${rifa.nombre}`}/>
                        
                        <div>
                            <h3 class=" text-3xl">{rifa.nombre}</h3>
                            <p class=" max-h-36 overflow-y-hidden text-ellipsis test">{rifa.reglamento}</p>
                        </div>
                        
                        </article>
                        </a>
                    </li>
                    ))
                :
                    Object.keys(ticketsData.value).map((id_campania) => (
                        <li class="hover:shadow-md hover:-translate-y-6 transition-all">
                            <a href={`/rifa/${id_campania}`}>
                            <article class="flex flex-col items-center md:items-stretch md:flex-row gap-8 p-8">
                            <Image classList="shrink-0" src={serverURL+ticketsData.value[id_campania][0].foto} alt={`Foto de la campaña ${ticketsData.value[id_campania][0].nombre}`}/>
                            
                            <div>
                                <h3 class=" text-3xl">{ticketsData.value[id_campania][0].nombre}</h3>
                                <div class="flex flex-wrap gap-4">
                                {ticketsData.value[id_campania].map((ticket) => (
                                    <p class=" max-h-36 overflow-y-hidden text-ellipsis test">{ticket.id_ticket}</p>
                                ))}
                                </div>
                            </div>
                            
                            </article>
                            </a>
                        </li>
                    ))
                }
            </ul>
            {isCreador &&
            <Button type="button" 
                text="Crear Rifa" 
                onClick={()=>window.location.href = "/rifa/crear"}/>
            }
            </div>
        </div>
    </div>
    )
}