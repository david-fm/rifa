// Script that allows users without local storage to access their user data

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { jwtDecode } from "jwt-decode";


export const POST: APIRoute = async ({ cookies }) => {

  if (!cookies.get("sb-access-token")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const token:string | undefined= cookies.get("sb-access-token")?.value;
  if (token !== undefined) {
    const decoded = jwtDecode(token);
    const id = decoded.sub;
    if(id !== undefined){
        const baseInfo = await supabase.from("base_user").select("username").eq("id", id).single();

        if(cookies.get("iscreador"))
        {
            const creadorInfo = await supabase.from("creador")
            .select(`
            logo,
            support_link,
            support_type`)
            .eq("id", id).single();
            return new Response(JSON.stringify({ username: baseInfo.data?.username, creadorInfo: creadorInfo.data }), {
                status: 200,
                headers: {
                  "content-type": "application/json",
                },
              });
        }
        return new Response(JSON.stringify({ username: baseInfo.data?.username, creadorInfo: null }), {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          });
        
    }
    
  }
  
  return new Response("Unauthorized", { status: 401 });   
  
};