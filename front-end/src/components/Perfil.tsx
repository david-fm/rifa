import Image from "./Image"
interface Props{
    link: string,
    username: string,
    classList?:string,
}

export default function Perfil({link, username, classList}:Props){
    return(
        <a href={link}>
            <div class={`flex justify-between items-center gap-3 px-3 py-3 shadow-lg rounded-md hover:-translate-y-3 transition-transform ${classList}`}>
            <Image src="/whatsapp.svg" alt="whatsapp" w="w-8" ratio="aspect-square"/>
            <p><small>{username}</small></p>
        </div>
        </a>
        
    )
}