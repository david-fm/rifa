import Buying from "@/components/Buying";
import Image from "@/components/Image";
import PercentageBar from "@/components/PercentageBar";
import Perfil from "@/components/Perfil";

import { $token, $refreshToken, $buying } from "@/store";
import { useStore } from "@nanostores/preact";
import { useState, useEffect } from "preact/hooks";

const serverURL = import.meta.env.PUBLIC_API;


interface Props {
    rifa_id: string| undefined;
}


interface Rifa {
    foto: string;
    nombre: string;
    precio_ticket: number;
    cantidad_tickets:number;
    tickets_necesarios: number;
    tickets_vendidos: number;
    ranking_activo: boolean;
    info_ranking: string;
    reglamento: string;

    link_soporte: string;
    username_soporte: string;
    logo_soporte: string;
}

async function getRifa(rifa_id: string | undefined): Promise<Rifa>{
    
    try{
        if(!rifa_id) 
            throw new Error("No rifa_id");

        const response = await fetch(`${serverURL}api/rifas/${rifa_id}/`);
        const data = await response.json();
        return data;
    }
    catch(err){
        alert("Error al obtener la rifa");
        window.location.replace("/");
        return {} as Rifa;
    }
}

export default function RifaView({rifa_id}:Props){
    const [data, setData] = useState<Rifa>({} as Rifa);

    useEffect(()=>{
        $buying.set('');
        getRifa(rifa_id).then((res)=>{
            setData(res);
        });
    },[]);

    const token = useStore($token);
    const refreshToken = useStore($refreshToken);

    const loggedIn = token && refreshToken ? true : false;

    return (
        <div class="h-full relative overflow-auto">
      
        <div class="flex justify-center items-center h-full px-8 lg:h-auto lg:pb-20">
            <div class="flex flex-col w-full max-w-screen-lg items-start h-full max-h-full lg:flex-row lg:items-center lg:gap-8 xl:gap-20 xl:max-w-screen-xl lg:h-auto relative">
                <section class="pb-8 flex flex-col gap-8 border-slate-300 border-b-2 w-full lg:border-none">
                    <div>
                        <h1 class=" self-start">{data.nombre}</h1>
                        <Image src={serverURL+data.foto} alt="{data.nombre}" w="w-full" />
                    </div>
                    
                    <div class="grid grid-cols-2 grid-rows-1 items-center w-full">
                        <b>Sorteador</b> 
                        <Perfil link="https://wa.me/34620930883" username={data.username_soporte} logo={serverURL+data.logo_soporte} classList=""/>
                    </div>
                    <div class="w-full">
                        
                        <div class="flex justify-between">
                            <b>Tickets vendidos</b>
                            <p>{data.tickets_vendidos}/{data.tickets_necesarios}</p>
                            
                        </div>
                        <PercentageBar percentage={(data.tickets_vendidos*100/data.tickets_necesarios).toString()}/>
                        
                    </div>
                    <div class="flex flex-col gap-3">
                        <b>Reglamento</b>
                        <p class="text-wrap">
                            {data.reglamento}
                        </p>
                    </div>
                    
                </section>
                <Buying 
                    precio_ticket={data.precio_ticket} 
                    tickets_disponibles={data.cantidad_tickets-data.tickets_vendidos}
                    loggedIn={loggedIn}
                    ticket_id={rifa_id}/>
            </div>
        </div>
    </div>
    )
}