interface Props{
    src: string,
    alt: string,
    w?: string,
    ratio?: string,
    h?: string,
    classList?: string,


}

export default function Image({src,alt,w,ratio,h,classList}:Props){
    // In the future use Image component from astro
    return(
        <div class={`${h} ${w?w:"w-52"} ${h==undefined?(ratio?ratio:"aspect-video"):ratio} ${classList}`}>
            <img src={src} alt={alt} />
        </div>
    )
}