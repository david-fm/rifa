import Image from "./Image";
import Button from "./Button";
import { useStore } from "@nanostores/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Signal } from "@preact/signals";
import { $token } from "../store";
const serverURL = import.meta.env.PUBLIC_API;

export default function DashboardContent() {

    const token = useStore($token);
    interface Rifa {
        foto: string;
        nombre: string;
        reglamento: string;
        id: number;
    }
    const rifasData:Signal<Rifa[]> = useSignal<Rifa[]>([]);

    useEffect(() => {
        fetch(serverURL+'/api/dashboard/',{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            rifasData.value = data;
        });
    }, []);

    return (
        <div>
    
        <div class="flex justify-center items-center px-8">
        <div class="h-full w-full flex flex-col justify-center items-center">
            <h2>Tus rifas</h2>
            <ul class="flex flex-col  max-w-screen-lg gap-12 items-center pt-6">
                {rifasData.value.map((rifa) => (
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
                ))}
            </ul>
            <Button type="button" 
                text="Crear Rifa" 
                onClick={() => alert('Button clicked!')}/>
            </div>
        </div>
    </div>
    )
}