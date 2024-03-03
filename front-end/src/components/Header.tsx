import { useStore } from '@nanostores/preact'
import { useRef } from 'preact/hooks';
import { $refreshToken, $token, $baseUser, $creadorInfo, $isCreador } from '../store';
interface Props{
    icon: string;
}

export default function Header({icon}: Props){
    
    const accessToken = useStore($token);
    const refreshToken = useStore($refreshToken);
    //const baseUser = useStore($baseUser);

    //console.log(baseUser);


    const toggler = useRef<HTMLImageElement>(null);
    const header = useRef<HTMLElement>(null);

    function onToggleMenu() {
        toggler.current?.getAttribute("src") === "/nav.svg" ? 
            toggler.current.setAttribute('src', "/cross.svg") 
            : 
            toggler.current?.setAttribute("src","/nav.svg");
        const nav = document.getElementById("nav");
        nav?.classList.toggle("opacity-100");
        nav?.classList.toggle("-translate-y-4");
        nav?.classList.toggle("z-30");
        nav?.classList.toggle("after:z-30");
        header.current?.classList.toggle("z-50");

    }

    const logOut = () => {
        
        $baseUser.set({username: null, email: null}); 
        $creadorInfo.set({logo: null, support_link: null, support_type: 0});
        $isCreador.set(false);
        $token.set('');
        $refreshToken.set('');
        window.location.href = "/api/auth/signout";
    }
    
    return(
    <header class={`w-full  mx-auto px-8 pt-4 flex justify-center z-10 bg-white-smoke sticky ${accessToken && refreshToken ? "top-0": "" }`} ref={header}>
        <div class="w-full max-w-screen-xl relative">
            {
                accessToken && refreshToken ? 
                <>
                <div class="flex justify-between items-center relative z-40">
                    
                    <a href="/">
                        <img src={"/"+icon} class
                        ="h-14 w-14" alt="Logo" />
                    </a>
                    <img src="/nav.svg" class="h-9 w-9 cursor-pointer lg:hidden" alt="Menu" id="toggler"  onClick={onToggleMenu} ref={toggler}/>
                    <nav class="hidden lg:flex lg:justify-evenly">
                        <a href="/dashboard" class="text-gray-700 transition-colors  ">Dashboard</a>
                        <p  class="ml-4 text-gray-700 transition-colors cursor-pointer" id="signout">Logout</p>
                        <a href="/perfil" class="ml-4 text-gray-700 transition-colors">Perfil</a>
                    </nav>
                    
                </div>
                <nav class="flex flex-col items-end absolute right-0 top-14 w-full max-w-screen-xl m-auto py-4 px-4 transition-all opacity-0 bg-white-smoke border-b-2 border-black after:absolute -translate-y-4" id="nav">
                        <a href="/dashboard" class="text-gray-700 hover:border-black transition-colors border-b-2 ">Dashboard</a>
                        <a href="/api/auth/signout" class="ml-4 text-gray-700 hover:border-black transition-colors border-b-2" onClick={logOut}>Logout</a>
                        <a href="/perfil" class="ml-4 text-gray-700 hover:border-black transition-colors border-b-2">Perfil</a>
                </nav>
                </>
                :
                <div class=" flex justify-center items-center z-50">
                    <a href="/">
                        <img src={"/"+icon} class="h-24 w-24" alt="Logo" />
                    </a>
                </div>
            }
        </div>
        
        
    </header>
    )
}
