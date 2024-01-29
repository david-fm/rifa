import { s as supabase } from './register_jNYZE3TQ.mjs';

const prerender = false;
const POST = async ({
  request,
  cookies,
  redirect
}) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    return new Response("Email and password are required", {
      status: 400
    });
  }
  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    return new Response(error.message, {
      status: 500
    });
  }
  const {
    access_token,
    refresh_token
  } = data.session;
  cookies.set("sb-access-token", access_token, {
    path: "/"
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/"
  });
  return redirect("/dashboard");
};

export { POST, prerender };
