interface Props{
    placeholder?: string;   // Placeholder for the input
    name?: string;          // Name of the input
    extraClass?: string;    // Extra classes to add to the input
    type?: string;          // Decide the type of input
    big?: boolean;          // Decide whether to use textareas or inputs
    cols?: number;           // Number of columns for the textarea
    rows?: number;           // Number of rows for the textarea
    id?: string;            // Id of the input
    myOnInput?: (e: Event) => void;   // Function to call when the input changes
    // If you want to use onInput you should 
}

export default function Input({placeholder, extraClass, type, name, myOnInput, big, rows, cols, id}: Props) {
    const classes = ` w-64 lg:w-80 py-4 lg:py-5 bg-silver max-w-sm px-5 drop-shadow-sm transition-all ${extraClass}`
    const textAreaClasses =` w-80 bg-silver max-w-sm px-5 py-3 drop-shadow-sm transition-all resize-none ${extraClass}`
    function specialOnInput(e: Event) {
        resizeTextarea(e);
        if(myOnInput)
            myOnInput(e);
    }
    function resizeTextarea(e: Event) {
        const element = e.target as HTMLTextAreaElement;
        element.style.height = "auto";
        element.style.height = (element.scrollHeight) + "px";
    }
    return (
        (type==="file"?
        <>
        <label for="file-input" class={classes + " cursor-pointer"}>{placeholder}</label>
        <input 
            type={type}
            name={name}
            class=" opacity-0 absolute z-[-1]"
            onChange={myOnInput}
            id={id?id:"file-input"}/>
        </>
        :
        (big?
            <textarea
            placeholder={placeholder}
            class={textAreaClasses}
            name={name}
            onInput={(e)=>specialOnInput(e)}
            rows={rows}
            cols={cols}
            id={id}
            ></textarea>
            :
            <input 
            type={type?type:"text"}  
            placeholder={placeholder}  
            class={classes}
            name={name}
            onChange={myOnInput}
            id={id}/>)
        )
        
    )
}
