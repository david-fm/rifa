export const prerender = false
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { jwtDecode } from "jwt-decode";
import type { JWToken } from "../../../types/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const purify = DOMPurify(new JSDOM().window);
  
  
  const token:string | undefined= cookies.get("sb-access-token")?.value;
  if (token == undefined) {
    return new Response("Unauthorized", { status: 401 });
  }
  const decoded = jwtDecode<JWToken>(token);
  const id = decoded.sub;

  let toReturn = {};
  const isCreador = cookies.get("iscreador");
  if(isCreador === undefined){
    const username = formData.get("username")?.toString();
    if(username === undefined){
      return new Response("Username is required", { status: 400 });
    }
    const cleanedUsername = purify.sanitize(username);

    const baseUserResponse = await supabase.from("base_user").update({
      username: cleanedUsername,
    })
    .eq("id", id);

    if (baseUserResponse.error) {
      return new Response("Error while updating username", { status: 500 });
    }
    toReturn = {
      username: cleanedUsername,
    }
  }
  else{
    const username = formData.get("username")?.toString();
    if(username === undefined){
      return new Response("Username is required", { status: 400 });
    }
    const cleanedUsername = purify.sanitize(username);
    const supportLink = formData.get("support_link")?.toString();
    if(supportLink === undefined){
      return new Response("Support link is required", { status: 400 });
    }
    const clenaedSupportLink = purify.sanitize(supportLink);
    
    const baseUserResponse = await supabase.from("base_user").update({
      username: cleanedUsername,
    })
    .eq("id", id);

    if (baseUserResponse.error) {
      return new Response("Error while updating username", { status: 500 });
    }

    const creadorResponse = await supabase.from("creador").update({
      support_link: clenaedSupportLink,
    })
    .eq("id", id);

    if (creadorResponse.error) {
      return new Response("Error while updating suportLink", { status: 500 });
    }
    // const answer = {
    //   username: baseUserResponse.data?.username,
    //   support_link: supportLink,
    // }
    toReturn = {
      username: cleanedUsername,
      support_link: clenaedSupportLink,
    }
  }
  
  return new Response( JSON.stringify(toReturn), { status: 200 });
};