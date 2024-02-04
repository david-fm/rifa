interface Props{
    placeholder?: string;   // Placeholder for the input
    name?: string;          // Name of the input
    extraClass?: string;    // Extra classes to add to the input
    type?: string;          // Decide the type of input
    big?: boolean;          // Decide whether to use textareas or inputs
    cols?: number;           // Number of columns for the textarea
    rows?: number;           // Number of rows for the textarea
    myOnInput?: (e: Event) => void;   // Function to call when the input changes
    // If you want to use onInput you should 
}

export default function Input({placeholder, extraClass, type, name, myOnInput, big, rows, cols}: Props) {
    const classes = ` w-80 bg-silver max-w-sm px-5 py-3 drop-shadow-sm transition-all ${extraClass}`
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
        big?
        <textarea
        placeholder={placeholder}
        class={textAreaClasses}
        name={name}
        onInput={(e)=>specialOnInput(e)}
        rows={rows}
        cols={cols}
        ></textarea>
        :
        <input 
        type={type?type:"text"}  
        placeholder={placeholder}  
        class={classes}
        name={name}
        onChange={myOnInput}/>
    )
}
