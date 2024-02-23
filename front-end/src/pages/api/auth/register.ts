export const prerender = false
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export const POST: APIRoute = async ({ request }) => {
  const purify = DOMPurify(new JSDOM().window);

  const formData = await request.formData();
  const testEmail = formData.get("email");
  const testPassword = formData.get("password");
  const testPasswordConfirmation = formData.get("passwordConfirmation");

  if(testEmail === null || testPassword === null || testPasswordConfirmation === null){
    return new Response("Email, password and password confirmation are required", { status: 400 });
  }
  

  const email = purify.sanitize(testEmail.toString());
  const password = purify.sanitize(testPassword.toString());
  const passwordConfirmation = purify.sanitize(testPasswordConfirmation.toString());

  if (password !== passwordConfirmation) {
      return new Response("Passwords do not match", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response("Success", { status: 200 });
};