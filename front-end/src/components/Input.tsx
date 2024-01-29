interface Props{
    placeholder: string;
    name: string;
    extraClass?: string;
    type?: string;
}

export default function Input({placeholder, extraClass, type, name}: Props) {
    const classes = ` w-80 bg-silver max-w-sm px-5 py-3 drop-shadow-sm transition-all ${extraClass}`
    return (
        <input 
        type={type?type:"text"}  
        placeholder={placeholder}  
        class={classes}
        name={name}/>
    )
}
