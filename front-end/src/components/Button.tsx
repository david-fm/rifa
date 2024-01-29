
interface Props{
    type: 'button' | 'submit' | 'reset';
    text: string;
    extraClass?: string;
    id?: string ;
}

export default function Button({type, text, id, extraClass}: Props) {

    return (

    <button type="button" 
    class={" w-80 bg-carulean-blue text-white text-center flex items-center px-5 py-3 "+extraClass}
    id={id?"":id}>
        {text}
    </button>
    )
}
