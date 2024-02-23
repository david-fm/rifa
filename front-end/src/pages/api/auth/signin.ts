import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import type { userDetails } from "../../../types/localStorage";
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';



export const POST: APIRoute = async ({ request, cookies }) => {
  
  const purify = DOMPurify(new JSDOM().window);


  const formData = await request.formData();
  const testEmail = formData.get("email");
  const testPassword = formData.get("password");
  if(testEmail === null || testPassword === null){
    return new Response("Email and password are required", { status: 400 });
  }

  const email = purify.sanitize(testEmail.toString());
  const password = purify.sanitize(testPassword.toString());

  // Then, sign in the user with the provided email and password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return new Response(error.message, { status: 500 });
  }
  // If the user is signed in successfully, set the access token and refresh token as cookies
  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });
  
  // Also, get the user's information from the database and set it as a cookie
  const baseInfo = await supabase.from("base_user").select("username").eq("id", data?.user?.id).single();
  const creadorInfo = await supabase.from("creador")
  .select(`
  logo,
  support_link,
  support_type`)
  .eq("id", data?.user?.id).single();
  
  if(baseInfo.data?.username !== undefined && data?.user.email !== undefined){

    if(creadorInfo.data !== null){
      cookies.set("iscreador", "", {
        path: "/",
      });
    }

    const toSend: userDetails = {
      username: baseInfo.data?.username,
      email: data?.user?.email,
      creadorInfo: creadorInfo.data
    }

    return new Response(
      JSON.stringify(toSend), 
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        });
  }
  return new Response("Error while login", { status: 500 });
};