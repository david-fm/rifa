interface Props{
    percentage: string, // percentage from 0 to 100
}

export default function PercentageBar({percentage}:Props){
    return(
        
        <div class="w-full h-5 border-2">
            <div class={`w-[${percentage}%] h-full bg-slate-400`}></div>
        </div>
    )
}