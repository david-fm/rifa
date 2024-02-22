import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";



export const POST: APIRoute = async ({ request, cookies }) => {

  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  // First, check if the email and password are provided

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }
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
  

  const iscreador = creadorInfo.data !== null;
  if (iscreador) {
    cookies.set("iscreador", "true", {
      path: "/",
    });
  }

  

  return new Response(JSON.stringify({ username: baseInfo.data?.username, iscreador, creadorInfo: creadorInfo.data }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};