import type { Ref } from "preact";

interface Props{
    placeholder?: string;   // Placeholder for the input
    name?: string;          // Name of the input
    extraClass?: string;    // Extra classes to add to the input
    type?: string;          // Decide the type of input
    accept?: string;        // Accept attribute for file inputs
    big?: boolean;          // Decide whether to use textareas or inputs
    cols?: number;           // Number of columns for the textarea
    rows?: number;           // Number of rows for the textarea
    id?: string;            // Id of the input
    isRequiered?: boolean;    // Whether the input is requiered
    myOnInput?: (e: Event) => void;   // Function to call when the input changes
    onKeyUp?: (e: Event) => void;   // Function to call when the input changes
    inputRef?: Ref<HTMLInputElement> ;   // Ref to the input
    textareaRef?: Ref<HTMLTextAreaElement> ;   // Ref to the textarea
}

export default function Input({placeholder, extraClass, type, name, myOnInput, big, rows, cols, id, isRequiered, accept, inputRef, textareaRef,onKeyUp}: Props) {
    const classes = ` w-64 lg:w-80 py-4 lg:py-5 bg-input-fondo text-input-texto placeholder:text-input-texto max-w-sm px-5 drop-shadow-sm transition-all ${extraClass}`
    const textAreaClasses =` w-80 bg-input-fondo text-input-texto placeholder:text-input-texto max-w-sm px-5 py-3 drop-shadow-sm transition-all resize-none ${extraClass}`
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
            <label for="file-input" class={classes + " cursor-pointer"} accept={accept?accept:"image/*"}>{placeholder}</label>
            {isRequiered ?
                <input 
                type={type}
                name={name}
                class=" opacity-0 absolute z-[-1]"
                onChange={myOnInput}
                onKeyUp={onKeyUp}
                id={id?id:"file-input"}
                required
                ref={inputRef}/>
                :
                <input 
                type={type}
                name={name}
                class=" opacity-0 absolute z-[-1]"
                onChange={myOnInput}
                onKeyUp={onKeyUp}
                id={id?id:"file-input"}
                ref={inputRef}/>
            }
            
            </>
        :
            (big?
                (isRequiered?
                    <textarea
                    placeholder={placeholder}
                    class={textAreaClasses}
                    name={name}
                    onInput={(e)=>specialOnInput(e)}
                    onKeyUp={onKeyUp}
                    rows={rows}
                    cols={cols}
                    id={id}
                    required
                    ref={textareaRef}
                    ></textarea>
                    :
                    <textarea
                    placeholder={placeholder}
                    class={textAreaClasses}
                    name={name}
                    onInput={(e)=>specialOnInput(e)}
                    onKeyUp={onKeyUp}
                    rows={rows}
                    cols={cols}
                    id={id}
                    ref={textareaRef}
                    ></textarea>
                    )
                
                :
                (isRequiered?
                    <input 
                    type={type?type:"text"}  
                    placeholder={placeholder}  
                    class={classes}
                    name={name}
                    onChange={myOnInput}
                    onKeyUp={onKeyUp}
                    id={id}
                    required
                    ref={inputRef}/>
                    :
                    <input 
                    type={type?type:"text"}  
                    placeholder={placeholder}  
                    class={classes}
                    name={name}
                    onChange={myOnInput}
                    onKeyUp={onKeyUp}
                    id={id}
                    ref={inputRef}/>
                    )
                )
            )
        
    )
}
