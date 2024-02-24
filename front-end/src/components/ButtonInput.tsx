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
            <Button type='button' text='ACCEDER A RIFA' id="ref-button" extraClass=" relative z-10 rounded-t-sm" onClick={handleClick}/>
            
            {
                
				<Input placeholder='Buscar rifas' extraClass={(showInput?" opacity-100 rounded-b-md":" opacity-0 -translate-y-8")+" relative z-0 "} type="text" name="search" isRequiered/>
            }
		</div>
    )
}