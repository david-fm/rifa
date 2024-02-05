import type { APIRoute } from "astro";

interface Rifa {
    foto: string;
    nombre: string;
    reglamento: string;
}

export const GET:APIRoute = async ({request, cookies, redirect}) => {
    return new Response(JSON.stringify({foto:"foto",nombre:"nombre",reglamento:"reglamento"}), {
        headers: {
            "content-type": "application/json",
        },
    });
}