import { Auth } from "@supabase/auth-ui-react";
import { minimal } from "@supabase/auth-ui-shared";
import type { NextPage } from "next";
import { createClient } from "~/utils/supabase/component";

const LoginPage: NextPage = async () => {
  const supabaseClient = createClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return (
      <main className="mt-20 flex h-full w-full flex-col items-center justify-center">
        <Auth
          showLinks={false}
          providers={[]}
          appearance={{ theme: { default: minimal } }}
          supabaseClient={supabaseClient}
          view={"sign_in"}
        />
      </main>
    );
  }

  return (
    <>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default LoginPage;
