export const prerender = false
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username")?.toString();
  const supportLink = formData.get("support_link")?.toString();

  //const actualUsername = await supabase.from("base_user").select("username");

  const { error } = await supabase.from("users").update({
    username: username,
    support_link: supportLink,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response("Success", { status: 200 });
};