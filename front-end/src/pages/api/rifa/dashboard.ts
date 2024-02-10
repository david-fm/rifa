export const prerender = false
import type { APIRoute } from "astro";

interface Rifa {
    foto: string;
    nombre: string;
    reglamento: string;
    id: number;
}

const rifas: Rifa[] = [
    {
        foto: "example.jpg",
        nombre: "Mi rifa",
        reglamento: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis metus quam, eu mollis lorem facilisis et. Mauris convallis nibh nibh, eu malesuada massa cursus a. Fusce tristique mattis erat, at porttitor metus. Proin convallis, metus eu ultrices suscipit, purus odio ultrices risus, eu maximus magna ex in neque. Phasellus maximus tortor in ipsum elementum, vel accumsan magna tristique. Proin laoreet est tellus, ut pellentesque mi consectetur vitae. Donec purus lacus, cursus cursus massa vitae, tincidunt tincidunt sapien. Vivamus vestibulum interdum nibh id posuere. Aliquam mi tortor, ultrices molestie risus et, hendrerit viverra eros. Donec fringilla pellentesque tempus. Suspendisse a.",
        id: 0
    },
    {
        foto: "example.jpg",
        nombre: "Mi rifa real",
        reglamento: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis metus quam, eu mollis lorem facilisis et. Mauris convallis nibh nibh, eu malesuada massa cursus a.",
        id: 1
    },
    {
        foto: "example.jpg",
        nombre: "Mi rifa falsa",
        reglamento: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis metus quam, eu mollis lorem facilisis et. Mauris convallis nibh nibh, eu malesuada massa cursus a. Fusce tristique mattis erat, at porttitor metus. Proin convallis, metus eu ultrices suscipit, purus odio ultrices risus, eu maximus magna ex in neque. Phasellus maximus tortor in ipsum elementum, vel accumsan magna tristique. Proin laoreet est tellus, ut pellentesque mi consectetur vitae. Donec purus lacus, cursus cursus massa vitae, tincidunt tincidunt sapien. Vivamus vestibulum interdum nibh id posuere. Aliquam mi tortor, ultrices molestie risus et, hendrerit viverra eros. Donec fringilla pellentesque tempus. Suspendisse a.",
        id: 2
    }
]


export const GET:APIRoute = async ({cookies}) => {
    /*
    Check if user is logged in
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");
    if(!accessToken || !refreshToken){
        return new Response("User not log in", {status: 401});
    }
    */
    const rifasUsuario: Rifa[] = rifas;
    // Get rifas given a user from the database
    return new Response(JSON.stringify(rifasUsuario), {
        headers: {
            "content-type": "application/json",
        },
    });
}