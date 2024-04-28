import type { APIRoute } from "astro";
import { supabase } from "../../../utils/supabaseServer";

export const POST: APIRoute = async ({ request, redirect }) => {
  const data = await request.formData();

  const password = data.get("password");

  if (typeof password === "string") {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      return new Response(error.message, { status: 500 });
    }
    return redirect("/updated");
  }
  return new Response("Invalid password", { status: 500 });
};
