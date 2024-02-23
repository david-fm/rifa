// Script that allows users without local storage to access their user data
export const prerender = false
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { jwtDecode } from "jwt-decode";
import type { userDetails } from "../../../types/localStorage";
import type { JWToken } from "../../../types/supabase";


export const POST: APIRoute = async ({ cookies }) => {

  if (!cookies.get("sb-access-token")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const token:string | undefined= cookies.get("sb-access-token")?.value;
  if (token !== undefined) {
    const decoded = jwtDecode<JWToken>(token);
    const id = decoded.sub;
    const email = decoded.email;
    if(id !== undefined){
        const baseInfo = await supabase.from("base_user").select("username").eq("id", id).single();

        const creadorInfo = await supabase.from("creador")
        .select(`
        logo,
        support_link,
        support_type`)
        .eq("id", id).single();
        if(creadorInfo.data !== null && baseInfo.data !== null)
        {
          const toSend : userDetails = {
            username: baseInfo.data?.username,
            email: email,
            creadorInfo: creadorInfo.data
          } 
          return new Response(
            JSON.stringify(toSend), {
              status: 200,
              headers: {
                "content-type": "application/json",
              },
            });
        }
        
    }
    
  }
  
  return new Response("Unauthorized", { status: 401 });   
  
};