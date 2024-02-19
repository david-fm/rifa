import Button from "./Button";
interface Props{
    onClick: ()=>any;
    text: string;
    textButton: string;
}

export default function Block({onClick,text,textButton}:Props)
{
    return(
        <div class="flex flex-col justify-center items-center gap-8 px-3 py-5 rounded border-2 border-black hover:shadow-lg">
            <p class="text-center text-2xl">{text}</p>
            <Button type="button" text={textButton} extraClass="!w-auto !py-3 px-3 justify-center" onClick={onClick}/>
        </div>
    )
}