// export const prerender = false
// import type { APIRoute } from "astro";
// import { createServerClient, type CookieOptions } from "@supabase/ssr";

// import { JSDOM } from 'jsdom';
// import DOMPurify from 'dompurify';
// import { jwtDecode } from "jwt-decode";
// import { type Database, type JWToken } from "../../../types/supabase";

// export const POST: APIRoute = async ({ request, cookies }) => {

//   const supabase = createServerClient<Database>(
//     import.meta.env.SUPABASE_URL,
//     import.meta.env.SUPABASE_ANON_KEY,
//     {
//       cookies: {
//         get(key: string) {
//           return cookies.get(key)?.value;
//         },
//         set(key: string, value: string, options: CookieOptions) {
//           cookies.set(key, value, options);
//         },
//         remove(key: string, options) {
//           cookies.delete(key, options);
//         },
//       },
//     } 
//     );
//   const formData = await request.formData();
//   const purify = DOMPurify(new JSDOM().window);
  
//   const token:string | undefined= cookies.get("sb-access-token")?.value;
//   const refreshToken:string | undefined= cookies.get("sb-refresh-token")?.value;
//   if (token == undefined || refreshToken == undefined) {
//     return new Response("Unauthorized", { status: 401 });
//   }
  
//   //const supabaseUser = await supabase.auth.getUser(token)
//   const decoded = jwtDecode<JWToken>(token);
//   const id = decoded.sub;

//   let toReturn = {};
//   const isCreador = cookies.get("iscreador");
//   if(isCreador === undefined){
//     const username = formData.get("username")?.toString();
//     if(username === undefined){
//       return new Response("Username is required", { status: 400 });
//     }
//     const cleanedUsername = purify.sanitize(username);

//     const baseUserResponse = await supabase.from("base_user").update({
//       username: cleanedUsername,
//     })
//     .eq("id", id);
    
//     if (baseUserResponse.error) {
//       return new Response("Error while updating username", { status: 500 });
//     }
//     toReturn = {
//       username: cleanedUsername,
//     }
//   }
//   else{
//     const username = formData.get("username")?.toString();
//     if(username === undefined){
//       return new Response("Username is required", { status: 400 });
//     }
//     const cleanedUsername = purify.sanitize(username);

//     const supportLink = formData.get("support_link")?.toString();
//     if(supportLink === undefined){
//       return new Response("Support link is required", { status: 400 });
//     }
//     const clenaedSupportLink = purify.sanitize(supportLink);
    
//     const baseUserResponse = await supabase.from("base_user").update({
//       username: cleanedUsername,
//     })
//     .eq("id", id);
//     console.log(cleanedUsername, baseUserResponse);
//     if (baseUserResponse.error) {
//       return new Response("Error while updating username", { status: 500 });
//     }

//     const creadorResponse = await supabase.from("creador").update({
//       support_link: clenaedSupportLink,
//     })
//     .eq("id", id);

//     console.log(clenaedSupportLink, creadorResponse);
//     if (creadorResponse.error) {
//       return new Response("Error while updating suportLink", { status: 500 });
//     }

//     const image = formData.get("image");
//     const permittedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/giff"];
//     console.log(image);
//     if(image !== null){
      
//       const imageFile = image instanceof File ? image : image[0];
//       if (imageFile instanceof File && !permittedImageTypes.includes(imageFile.type) || imageFile instanceof String) {
//         return new Response("Invalid image type", { status: 400 });
//       }

//       let imageResponse = await supabase.storage.from("rifaUser").upload(`${id}.jpg`, imageFile);

//       if (imageResponse.error )
//       {        
//         imageResponse = await supabase.storage.from("rifaUser").update(`${id}.jpg`, imageFile);
//       }
//       if (imageResponse.error) {
//         return new Response("Error while uploading image", { status: 500 });
//       }

//     }
//     // const answer = {
//     //   username: baseUserResponse.data?.username,
//     //   support_link: supportLink,
//     // }
//     toReturn = {
//       username: cleanedUsername,
//       support_link: clenaedSupportLink,
//     }
//   }
  
//   return new Response( JSON.stringify(toReturn), { status: 200 });
// };