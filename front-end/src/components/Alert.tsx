import { useRef } from "preact/hooks";
import { $alert } from "@/store";
import type { PropsWithChildren } from "preact/compat";
interface Props {
    message?: string;
    onClose?: () => void;
}


export default function Alert({message, children, onClose}:PropsWithChildren<Props>) {
    const alerta = useRef<HTMLDivElement>(null);
    const removeAlert = () => {
        if(onClose) onClose();
        alerta.current?.classList.add("hidden");
        $alert.set("");
    }
    return (
        <div class="fixed w-full h-full top-0, left-0 flex justify-center items-center z-40" ref={alerta}>
            <div className="p-6 relative max-w-md min-h-44 w-full rounded text-input-texto bg-white shadow-md flex justify-center items-center" role="alert">
                <img src="/cross.svg" class="w-4 absolute top-4 right-4 cursor-pointer" alt="Logo" onClick={removeAlert}/>
                {children ? children : message}
            </div>
        </div>
        
    );
}