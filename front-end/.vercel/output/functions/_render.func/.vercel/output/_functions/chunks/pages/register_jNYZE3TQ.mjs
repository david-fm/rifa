import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://lvzzvnpshvmlrkbxuxtx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2enp2bnBzaHZtbHJrYnh1eHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NTAwNzksImV4cCI6MjAyMjEyNjA3OX0.Ir6mXalXeaAQSf4LW8cn28BbVmBWpWlhtk2JoaOUZtY");

const prerender = false;
const POST = async ({
  request,
  redirect
}) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const passwordConfirmation = formData.get("passwordConfirmation")?.toString();
  if (!email || !password) {
    return new Response("Email and password are required", {
      status: 400
    });
  }
  if (password !== passwordConfirmation) {
    return new Response("Passwords do not match", {
      status: 400
    });
  }
  const {
    error
  } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) {
    return new Response(error.message, {
      status: 500
    });
  }
  return redirect("/signin");
};

const register = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

export { register as r, supabase as s };
