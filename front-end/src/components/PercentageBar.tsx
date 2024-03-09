interface Props{
    percentage: string, // percentage from 0 to 100
}

export default function PercentageBar({percentage}:Props){
    percentage = parseInt(percentage) < 0 ? "0" : percentage;
    percentage = parseInt(percentage) > 100 ? "100" : percentage;
    
    const width = `${percentage}%`
    return(
        
        <div class="w-full h-5 border-2">
            <div class={" h-full bg-barra"} 
            style={{
                width: width
            }}></div>
        </div>
    )
}