import Image from "./Image"
interface Props{
    link: string,
    username: string,
    logo: string,
    classList?:string,
}

export default function Perfil({link, username, logo, classList}:Props){
    return(
        <a href={link}>
            <div class={`flex justify-between items-center gap-3 px-3 py-3 shadow-lg rounded-md hover:-translate-y-3 transition-transform ${classList}`}>
            <Image src={logo} alt="whatsapp" w="w-8" h="h-8" classList=" rounded-full overflow-hidden"/>
            <p><small>{username}</small></p>
        </div>
        </a>
        
    )
}