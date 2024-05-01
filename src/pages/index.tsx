import type { GetServerSidePropsContext, NextPage } from "next";
import { redirect } from "next/navigation";
import { CreateAccessCode } from "~/components/create_code";
import { PseudLookup } from "~/components/pseud_lookup";
import { createClient } from "~/utils/supabase/component";
import { createSClient } from "~/utils/supabase/server";

const HomePage: NextPage = async () => {
  const supabaseClient = createClient();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="m-4 flex flex-col justify-start gap-2">
      <div>
        <button
          onClick={() => supabaseClient.auth.signOut()}
          style={{
            backgroundColor: "var(--accent)",
            border: "none",
            padding: "6px 10px",
            fontSize: "large",
            color: "white",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Sign out
        </button>
      </div>
      <CreateAccessCode />
      <PseudLookup />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createSClient(context);

  const { data, error } = await supabase.auth.getUser();

  if (error ?? !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data.user,
    },
  };
}

export default HomePage;
