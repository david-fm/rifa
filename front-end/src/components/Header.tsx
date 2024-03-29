import { useStore } from '@nanostores/preact'
import { useRef } from 'preact/hooks';
import { useEffect } from 'preact/hooks';
import { $refreshToken, $token, $isCreador, $alert} from '@/store';
import { logOut, logInRequired, delay, fullInfoCreadorRequired } from '@/lib/functions';
import Alert from './Alert';

interface Props{
    icon: string;
}

export default function Header({icon}: Props){
    const isCreador = useStore($isCreador);
    
    useEffect(() => {
        logInRequired();
        fullInfoCreadorRequired();
    }, []);
    const accessToken = useStore($token);
    const refreshToken = useStore($refreshToken);
    const alert = useStore($alert);


    const toggler = useRef<HTMLImageElement>(null);
    const header = useRef<HTMLElement>(null);

    async function onToggleMenu() {
        toggler.current?.getAttribute("src") === "/nav.svg" ? 
            toggler.current.setAttribute('src', "/cross.svg") 
            : 
            toggler.current?.setAttribute("src","/nav.svg");
        const nav = document.getElementById("nav");
        if(nav?.classList.contains("hidden")){
            nav?.classList.toggle("hidden");
            await delay(20);
            nav?.classList.toggle("opacity-100");
            nav?.classList.toggle("-translate-y-4");
            nav?.classList.toggle("z-30");
            nav?.classList.toggle("after:z-30");
            header.current?.classList.toggle("z-50");
        }
        else{
            nav?.classList.toggle("opacity-100");
            nav?.classList.toggle("-translate-y-4");
            nav?.classList.toggle("z-30");
            nav?.classList.toggle("after:z-30");
            header.current?.classList.toggle("z-50");
            await delay(200);
            nav?.classList.toggle("hidden");
        
        }

    }

    
    
    return(
    <>
    {alert && <Alert message={alert}/>}
    <header class={`w-full  mx-auto px-8 py-4 flex justify-center z-10 bg-fondo sticky ${accessToken && refreshToken ? "top-0": "" }`} ref={header}>
        <div class="w-full max-w-screen-xl relative">
            {
                accessToken && refreshToken ? 
                <>
                <div class="flex justify-between items-center relative z-40">
                    
                    <a href="/">
                        <img src={"/"+icon} class
                        ="w-40" alt="Logo" />
                    </a>
                    <img src="/nav.svg" class="h-9 w-9 cursor-pointer lg:hidden" alt="Menu" id="toggler"  onClick={onToggleMenu} ref={toggler}/>
                    <nav class="hidden lg:flex lg:justify-evenly">
                        <a href="/dashboard" class=" text-textos transition-colors  ">
                            {isCreador ? "Dashboard" : "Tus Tickets"}
                            
                        </a>
                        <a href="/perfil" class="pb-1 ml-4 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 *:hover:stroke-textos " fill="none" viewBox="0 0 24 24"><path class=" stroke-input-texto  " stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 21a7 7 0 1 1 14 0M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/></svg>
                        </a>
                        <div class="pb-1 ml-4 cursor-pointer" onClick={logOut}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 *:hover:stroke-textos" viewBox="-3.5 0 64 64"><g class="stroke-input-texto stroke-2  " fill="none" fill-rule="evenodd" transform="translate(1 1)"><path d="M38 32v20c0 1.1-.9 2-2 2h-3.6M1.9 0H36c1.1 0 2 .9 2 2v24"/><path d="M0 2C0 .9.9 0 2 0l28.1 8c1.1 0 2 .9 2 2v50c0 1.1-.9 2-2 2L2 54c-1.1 0-2-.9-2-2V2Z"/><circle cx="25.5" cy="34.5" r="1.5"/><path d="M48.2 33.7v3.7c0 .3-.2.6-.6.6l-11.7-7.8c-.3-.2-.6-.3-.6-.6v-1.1c0-.2.2-.4.6-.6L47.6 20c.3 0 .5.3.5.6V24M46.3 25H56M46.3 33H56"/></g></svg>
                        </div>
                        
                    </nav>
                    
                </div>
                <nav class="flex flex-col items-end absolute right-0 top-14 w-full max-w-screen-xl m-auto py-4 px-4 transition-all opacity-0 bg-fondo border-b-2 border-black after:absolute -translate-y-4 hidden" id="nav">
                        
                        <a href="/dashboard" class="text-textos hover:border-textos transition-colors border-b-2 ">
                        {isCreador ? "Dashboard" : "Tus Tickets"}
                        </a>
                        <a href="/" class="text-textos hover:border-textos transition-colors border-b-2 ">
                            Inicio
                        </a>
                        <div class="pt-2 flex ">
                            <div class="pb-1 ml-4 cursor-pointer" onClick={logOut}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 *:hover:stroke-textos" viewBox="-3.5 0 64 64"><g class="stroke-input-texto stroke-2  " fill="none" fill-rule="evenodd" transform="translate(1 1)"><path d="M38 32v20c0 1.1-.9 2-2 2h-3.6M1.9 0H36c1.1 0 2 .9 2 2v24"/><path d="M0 2C0 .9.9 0 2 0l28.1 8c1.1 0 2 .9 2 2v50c0 1.1-.9 2-2 2L2 54c-1.1 0-2-.9-2-2V2Z"/><circle cx="25.5" cy="34.5" r="1.5"/><path d="M48.2 33.7v3.7c0 .3-.2.6-.6.6l-11.7-7.8c-.3-.2-.6-.3-.6-.6v-1.1c0-.2.2-.4.6-.6L47.6 20c.3 0 .5.3.5.6V24M46.3 25H56M46.3 33H56"/></g></svg>
                            </div>
                            <a href="/perfil" class="pb-1 ml-4 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 *:hover:stroke-textos " fill="none" viewBox="0 0 24 24"><path class="stroke-input-texto  " stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 21a7 7 0 1 1 14 0M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/></svg>
                            </a>
                        </div>
                        
                </nav>
                </>
                :
                <div class=" flex justify-center items-center z-50">
                    <a href="/">
                        <img src={"/"+icon} class="w-40" alt="Logo" />
                    </a>
                </div>
            }
        </div>
        
        
    </header>
    </>
    )
}
