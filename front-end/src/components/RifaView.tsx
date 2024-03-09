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


interface Ofertas {
    precio: number;
    cada: number;
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
    premios: [string];
    ofertas: [Ofertas];

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
    // Initialize the state
    const INITIAL_RIFA: Rifa = {
        foto: "",
        nombre: "",
        precio_ticket: 0,
        cantidad_tickets: 0,
        tickets_necesarios: 0,
        tickets_vendidos: 0,
        ranking_activo: false,
        info_ranking: "",
        reglamento: "",
        premios: [""],
        ofertas: [{precio: 0, cada: 0}],
        link_soporte: "",
        username_soporte: "",
        logo_soporte: ""
    }
    const [data, setData] = useState<Rifa>(INITIAL_RIFA);

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
        <div class="h-full relative">
      
        <div class="flex justify-center items-center h-full px-8 lg:h-auto lg:pb-20">
            <div class="flex flex-col w-full max-w-screen-lg items-start h-full max-h-full lg:flex-row lg:items-center lg:gap-8 xl:gap-20 xl:max-w-screen-xl lg:h-auto relative">
                <section class="pb-8 flex flex-col gap-8 border-barra border-b-2 w-full lg:border-none">
                    <div>
                        <h1 class=" self-start">{data.nombre}</h1>
                        <Image src={serverURL+data.foto} alt="{data.nombre}" w="w-full" />
                    </div>
                    
                    <div class="grid grid-cols-2 grid-rows-1 items-center w-full">
                        <b>Sorteador</b> 
                        <Perfil link={data.link_soporte} username={data.username_soporte} logo={serverURL+data.logo_soporte} classList=""/>
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
                        <p class="text-wrap whitespace-pre">
                            {data.reglamento}
                        </p>
                    </div>
                    <div class="flex flex-col gap-3">
                        <b>Premios</b>
                        <ul class="list-disc list-inside">
                            {data.premios?.map((premio)=>{
                                return <li>{premio}</li>
                            })}
                        </ul>
                    </div>
                    
                </section>
                <Buying 
                    precio_ticket={data.precio_ticket} 
                    tickets_disponibles={data.cantidad_tickets-data.tickets_vendidos}
                    ofertas={data.ofertas}
                    loggedIn={loggedIn}
                    ticket_id={rifa_id}/>
            </div>
        </div>
    </div>
    )
}