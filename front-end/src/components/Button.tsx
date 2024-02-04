
interface Props{
    type: 'button' | 'submit' | 'reset';
    text: string;
    extraClass?: string;
    id?: string ;
    onClick?: () => void;
}

export default function Button({type, text, id, extraClass, onClick}: Props) {

    return (

    <button 
    type={type}
    class={" w-80 bg-carulean-blue text-white text-center flex items-center px-5 py-3 "+extraClass}
    id={id?"":id}
    onClick={onClick}>
        {text}
    </button>
    )
}
