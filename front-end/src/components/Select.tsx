import { useRef } from "preact/hooks";
interface Props{
    form: string;         // Form to which the input belongs
    name: string;          // Name of the select
    extraClass?: string;    // Extra classes to add to the input
    isRequiered?: boolean;  // Whether the input is requiered
}

export default function Select({form, name, extraClass, isRequiered}: Props) {
    const selectRef = useRef<HTMLSelectElement>(null);
    const classes = `w-80 bg-silver max-w-sm px-5 py-3 drop-shadow-sm transition-all bg-input-fondo text-input-texto ${extraClass}`

    const testNotDefault = (e: Event) => {
        
        const element = e.target as HTMLSelectElement;
        if (selectRef.current)
        {
            if(element.value === "x")
                selectRef.current.classList.add("border-red-500", "border-2");
                
            else
                selectRef.current.classList.remove("border-red-500", "border-2");
        }
            
    }
    if(isRequiered)
    {
        return(
            <select
            form={form}
            name={name}
            class={classes}
            onClick={(e)=>testNotDefault(e)}
            ref={selectRef}
            required
            >
                <option value="x" selected>Número de tickets</option>
                <option value="0">0-99</option>
                <option value="1">0-999</option>
                <option value="2">0-9999</option>
                <option value="3">0-99999</option>
                <option value="4">0-999999</option>
                <option value="5">0-9999999</option>
            </select>
        )
    }
    return (
        <select
        form={form}
        name={name}
        class={classes}
        onClick={(e)=>testNotDefault(e)}
        ref={selectRef}
        >
            <option value="x" selected>Número de tickets</option>
            <option value="0">0-99</option>
            <option value="1">0-999</option>
            <option value="2">0-9999</option>
            <option value="3">0-99999</option>
            <option value="4">0-999999</option>
            <option value="5">0-9999999</option>
        </select>
    )
}
