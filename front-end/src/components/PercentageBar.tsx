interface Props{
    percentage: string, // percentage from 0 to 100
}

export default function PercentageBar({percentage}:Props){
    const width = `${percentage}%`
    return(
        
        <div class="w-full h-5 border-2">
            <div class={" h-full bg-slate-400"} 
            style={{
                width: width
            }}></div>
        </div>
    )
}