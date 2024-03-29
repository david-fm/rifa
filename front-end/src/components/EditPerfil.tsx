import { $baseUser, $creadorInfo, $isCreador, $token } from "../store";
import { useStore } from "@nanostores/preact";
import { useRef } from "preact/hooks";
import Input from "./Input";
import Button from "./Button";

interface Props{
    serverURL: string;
}

export default function EditPerfil({serverURL}: Props) {
    
    const baseUserData = useStore($baseUser);
    const creadorData = useStore($creadorInfo);
    const isCreador = useStore($isCreador);
    const token = useStore($token);

    
    
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
            
        }
        else{
            const mydata = data as {username: string};
            $baseUser.setKey("username", mydata.username);
            
        }
    }

    
    
    
    function handleOnChage(){
        if (logoInput.current && logoInput.current.files && logoInput.current.files.length > 0) 
        {
        console.log('change2');
        const [file] = logoInput.current.files;
        // Ahora puedes usar 'file'
        //console.log(file);
        const reader = new FileReader();

        reader.onload = (event) => {
            //console.log('load', event);
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

        const toSend = new FormData();
        if(formData.get("username") !== null && formData.get("username") !== "" && formData.get("username") !== baseUserData.username){
            const usernameFormData = formData.get("username");
            if (usernameFormData !== null && usernameFormData !== "" && usernameFormData !== baseUserData.username) {
                toSend.append("username", usernameFormData.toString());
            }
        }
        if(isCreador){
            if(formData.get("support_link") !== null && formData.get("support_link") !== "" && formData.get("support_link") !== creadorData.support_link){
                const supportLinkFormData = formData.get("support_link");
                if (supportLinkFormData !== null && supportLinkFormData !== "" && supportLinkFormData !== creadorData.support_link) {
                    toSend.append("support_link", supportLinkFormData.toString());
                }
            }
            if(logoInput.current && logoInput.current.files && logoInput.current.files.length > 0){
                const [file] = logoInput.current.files;
                toSend.append("logo", file);
            }

        }
        fetch(serverURL+"api/edit/", {
            method: "POST",
            body: toSend,
            headers: {
                Authorization: 'Bearer ' + token
            }
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
                    <div class="w-24 h-24 rounded-full cursor-pointer overflow-hidden flex items-center justify-center" onClick={() =>logoInput.current?.click()}>
                    <img src={serverURL + (creadorData.logo?creadorData.logo:"/defaultLogo.svg")}  id="img" ref={img} />
                    </div>
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
                
                
                <Input name="username" type="text" placeholder="Nombre de usuario"   inputRef={usernameInput}/>
                {
                    isCreador && (
                        <Input name="support_link" type="text" placeholder="Link soporte" id="supportLinkInput"  inputRef={supportLinkInput}/>
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