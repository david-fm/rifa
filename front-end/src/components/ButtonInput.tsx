import Button from "./Button"
import Input from "./Input"
import { useState } from 'preact/hooks'


type Props = {
}


export default function ButtonInput(props: Props) {
    const [showInput, setShowInput] = useState(false)

    function handleClick() {
        setShowInput(!showInput)
    }
    return(
        <div>
            <div class=" relative w-fit h-fit z-10 " onClick={handleClick}>
                <Button type='button' text='ACCEDER A RIFA' id="ref-button" extraClass="rounded-t-sm"/>
            </div>
            
            {
                
				<Input placeholder='Buscar rifas' extraClass={(showInput?"opacity-0 -translate-y-8":"opacity-100")+" relative z-0 rounded-b-md"} type="text" name="search"/>
            }
		</div>
    )
}