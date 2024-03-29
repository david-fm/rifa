import { useRef } from "preact/hooks";
import { $alert } from "@/store";
interface Props {
    message: string;
}


export default function Alert({message}:Props){
    const alerta = useRef<HTMLDivElement>(null);
    const removeAlert = () => {
        alerta.current?.classList.add("hidden");
        $alert.set("");
    }
    return (
        <div class="absolute w-full h-full top-0, left-0 flex justify-center items-center z-40" ref={alerta}>
            <div className="p-6 relative max-w-md min-h-44 w-full rounded text-input-texto bg-fondo shadow-md flex justify-center items-center" role="alert">
                <img src="/cross.svg" class="w-4 absolute top-4 right-4 cursor-pointer" alt="Logo" onClick={removeAlert}/>
                {message}
            </div>
        </div>
        
    );
}