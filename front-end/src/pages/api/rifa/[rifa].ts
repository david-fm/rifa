export const prerender = false
import type { APIRoute } from "astro";

interface Rifa {
    foto: string;
    nombre: string;
    precio_ticket: number;
    cantidad_tickets:number;
    max_reservas: number;
    tickets_necesarios: number;
    tickets_vendidos: number;
    tipo_soporte: number;
    link_soporte: string;
    ranking_activo: boolean;
    info_ranking: string;
    num_visibles: boolean;
    reglamento: string;
}

const rifas: Rifa[] = [
    {
        foto: "example.jpg",
        nombre: "Mi rifa",
        precio_ticket: 1,
        cantidad_tickets: 999,
        max_reservas: 10,
        tickets_necesarios: 800,
        tickets_vendidos: 200,
        tipo_soporte: 0,
        link_soporte: "",
        ranking_activo: true,
        info_ranking: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis metus quam, eu mollis lorem facilisis et. Mauris convallis nibh nibh, eu malesuada massa cursus a.",
        num_visibles: true,
        reglamento: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis metus quam, eu mollis lorem facilisis et. Mauris convallis nibh nibh, eu malesuada massa cursus a. Fusce tristique mattis erat, at porttitor metus. Proin convallis, metus eu ultrices suscipit, purus odio ultrices risus, eu maximus magna ex in neque. Phasellus maximus tortor in ipsum elementum, vel accumsan magna tristique. Proin laoreet est tellus, ut pellentesque mi consectetur vitae. Donec purus lacus, cursus cursus massa vitae, tincidunt tincidunt sapien. Vivamus vestibulum interdum nibh id posuere. Aliquam mi tortor, ultrices molestie risus et, hendrerit viverra eros. Donec fringilla pellentesque tempus. Suspendisse a."
    },
    {
        foto: "example.jpg",
        nombre: "Mi rifa real",
        precio_ticket: 2,
        cantidad_tickets: 99999,
        max_reservas: -1,
        tickets_necesarios: 90000,
        tickets_vendidos: 2000,
        tipo_soporte: 0,
        link_soporte:"",
        ranking_activo: true,
        info_ranking: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis metus quam, eu mollis lorem facilisis et. Mauris convallis nibh nibh, eu malesuada massa cursus a.",
        num_visibles: true,
        reglamento: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis metus quam, eu mollis lorem facilisis et. Mauris convallis nibh nibh, eu malesuada massa cursus a."
    },
    {
        foto: "example.jpg",
        nombre: "Mi rifa falsa",
        precio_ticket: 2,
        cantidad_tickets: 99999,
        max_reservas: -1,
        tickets_necesarios: 90000,
        tickets_vendidos: 2000,
        tipo_soporte: 0,
        link_soporte:"",
        ranking_activo: true,
        info_ranking: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis metus quam, eu mollis lorem facilisis et. Mauris convallis nibh nibh, eu malesuada massa cursus a.",
        num_visibles: true,
        reglamento: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis metus quam, eu mollis lorem facilisis et. Mauris convallis nibh nibh, eu malesuada massa cursus a. Fusce tristique mattis erat, at porttitor metus. Proin convallis, metus eu ultrices suscipit, purus odio ultrices risus, eu maximus magna ex in neque. Phasellus maximus tortor in ipsum elementum, vel accumsan magna tristique. Proin laoreet est tellus, ut pellentesque mi consectetur vitae. Donec purus lacus, cursus cursus massa vitae, tincidunt tincidunt sapien. Vivamus vestibulum interdum nibh id posuere. Aliquam mi tortor, ultrices molestie risus et, hendrerit viverra eros. Donec fringilla pellentesque tempus. Suspendisse a."
    }
]

export const GET:APIRoute = async ({params}) => {
    
    // get the rifa id from the last part of the url
    const rifaId = Number(params.rifa);
    const askedRifa: Rifa = rifas[rifaId];
    // Get rifas given a user from the database
    return new Response(JSON.stringify(askedRifa), {
        headers: {
            "content-type": "application/json",
        },
    });
}