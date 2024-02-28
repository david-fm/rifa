// import type { APIRoute } from "astro";
// import type {userDetails} from "../../../types/localStorage";




// export const POST: APIRoute = async ({ request, cookies }) => {
  
//   const serverURL = import.meta.env.API;
//   //console.log(request);
//   const formData = await request.formData();
//   fetch(serverURL + "api-auth/login/", {
//     method: "POST",
//     body: formData
//   }).then(async (response) => {
//     if (response.ok) {
//       const data = await response.json();
//       console.log(data);
//       cookies.set("access-token", data["token"], { path: "/" , httpOnly: true});
//       cookies.set("iscreador", data["iscreador"], { path: "/" });

//       const toSend : userDetails = {
//         username: data["username"],
//         email: data["email"],
//         creadorInfo: data["creadorInfo"]
//       }
//       const strToSend = JSON.stringify(toSend);
//       return new Response(strToSend, 
//         { 
//           status: 200, 
//           headers: { "content-type": "application/json" }
//         });
//     }
//     return new Response("Error while login", { status: 500 });
//   });

//   return new Response("Error while login", { status: 500 });
// };