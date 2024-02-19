export const prerender = false
import type { APIRoute } from "astro";

export const GET:APIRoute = async ({params}) => {
    
    // get the rifa id from the last part of the url
    const rifaId = Number(params.rifa);
    // Get rifas given a user from the database
    return new Response(JSON.stringify(rifaId), {
        headers: {
            "content-type": "application/json",
        },
    });
}