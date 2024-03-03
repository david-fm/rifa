import { $baseUser, $creadorInfo, $isCreador } from "../store";
import { useStore } from "@nanostores/preact";
import { useRef } from "preact/hooks";
import Input from "./Input";
import Button from "./Button";


export default function EditPerfil() {
    
    const baseUserData = useStore($baseUser);
    const creadorData = useStore($creadorInfo);
    const isCreador = useStore($isCreador);

    
    
    const creador = useRef<HTMLDivElement>(null);
    const form = useRef<HTMLFormElement>(null);

    const username =  useRef<HTMLHeadingElement>(null);
    const gmail = useRef<HTMLParagraphElement>(null);
    const supportLink = useRef<HTMLParagraphElement>(null);
    const img = useRef<HTMLImageElement>(null);

    const logoInput = useRef<HTMLInputElement>(null);
    const usernameInput = useRef<HTMLInputElement>(null);
    const supportLinkInput = useRef<HTMLInputElement>(null);
    
    
    
    
    function updateUser(data:unknown){
        if (isCreador){
            const mydata = data as {username: string, support_link: string, logo: string};
            $creadorInfo.setKey("logo", mydata.logo);
            $creadorInfo.setKey("support_link", mydata.support_link);
            $baseUser.setKey("username", mydata.username);
            if(username.current && supportLink.current && img.current && logoInput.current && usernameInput.current && supportLinkInput.current){
                
                username.current.textContent = mydata.username;
                supportLink.current.textContent = mydata.support_link;
                //img.src = data.logo;

                usernameInput.current.value = mydata.username;
                supportLinkInput.current.value = mydata.support_link;
                //logoInput.src = data.logo;
            }
        }
        else{
            const mydata = data as {username: string};
            $baseUser.setKey("username", mydata.username);
            if(username.current && usernameInput.current){
                
                username.current.textContent = mydata.username;
                usernameInput.current.value = mydata.username;
            }
        }
    }

    
    
    
    function handleOnChage(){
        console.log('change');
        console.log(logoInput.current);
        console.log(logoInput.current?.files);
        console.log(logoInput.current?.files?.length);
        if (logoInput.current && logoInput.current.files && logoInput.current.files.length > 0) 
        {
        console.log('change2');
        const [file] = logoInput.current.files;
        // Ahora puedes usar 'file'
        console.log(file);
        const reader = new FileReader();

        reader.onload = (event) => {
            console.log('load', event);
            if(img.current?.src && event.target?.result !== null)
            {
                const value: string | ArrayBuffer | undefined = event.target?.result;

                if (typeof value === 'string' ) {
                    const stringValue: string = value;
                    // Ahora puedes usar stringValue
                    img.current.src = stringValue;
                } else {
                    // Manejar el caso en que value no es un string
                }
            }
                
        };

        reader.onerror = event => {
            console.log('error', event);
        };

        reader.readAsDataURL(file);
        }
    }
    function handleSubmission(e: Event){
    
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        fetch("/api/auth/edit", {
            method: "POST",
            body: formData,
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    updateUser(data);
                });
            }
        })
    }
    
    return(
        <div class="flex flex-col items-center justify-center w-96" ref={creador}>
            {
                isCreador && (
                <img src={creadorData.logo?creadorData.logo:"/defaultLogo.svg"} class="w-24 h-24 rounded-full cursor-pointer" id="img" ref={img} onClick={() =>logoInput.current?.click()}/>
                )

            }
            <h1 class="text-2xl font-bold mt-4" ref={username}>{baseUserData.username}</h1>
            <p class="text-sm text-gray-500 mt-1" ref={gmail}>Gmail: {baseUserData.email}</p>
            {
                isCreador && (
                    <p class="text-sm text-gray-500 mt-1" ref={supportLink}>Link soporte: {creadorData.support_link}</p>
                )
            }
            
            <form class="pt-4 flex flex-col items-center" action="/api/auth/edit" ref={form} onSubmit={handleSubmission}>
                
                
                <Input name="username" type="text" placeholder="Nombre de usuario"  isRequiered inputRef={usernameInput}/>
                {
                    isCreador && (
                        <Input name="support_link" type="text" placeholder="Link soporte" id="supportLinkInput" isRequiered inputRef={supportLinkInput}/>
                    )
                }
                {
                    isCreador && (
                        <Input type="file" placeholder="Logo" extraClass="hidden" id="logoInput" name="image" inputRef={logoInput} myOnInput={handleOnChage}/>
                    )
                }
                {/* 
                <Input type="text" placeholder="Correo electrónico" />
                
                <Input type="password" placeholder="Contraseña" />
                <Input type="password" placeholder="Contraseña actual" />*/}
                <Button type="submit" text="Actualizar"/>
            </form>
        </div>
    )
}