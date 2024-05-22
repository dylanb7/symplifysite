/* eslint-disable react-hooks/exhaustive-deps */
import { type GetServerSidePropsContext, type NextPage } from "next";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createClient } from "~/utils/supabase/component";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";

import { useRouter } from "next/router";
import { createSClient } from "~/utils/supabase/server";
import { type AuthError, type User } from "@supabase/supabase-js";

const formSchema = z.object({
  password: z.string().min(0),
});

const UpdatePassword = ({
  user,
  error,
}: {
  user: User | null;
  error: AuthError | null;
}) => {
  const { asPath } = useRouter();

  const supabaseClient = createClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const query = asPath?.split("#")?.at(1) ?? [];
    const params = Object.fromEntries(new URLSearchParams(query));

    const refresh = params.refresh_token;
    const access = params.access_token;

    if (refresh && access) {
      await supabaseClient.auth.exchangeCodeForSession(access);
      /*await supabaseClient.auth.setSession({
        access_token: access,
        refresh_token: refresh,
      });*/
    }
    const { error } = await supabaseClient.auth.updateUser({
      password: values.password,
    });
    setLoading(false);
    if (error) {
      toast({ title: error.message });
    } else {
      toast({ title: "✅" });
    }
  }

  return (
    <main className="mt-20 flex h-full w-full flex-col items-center justify-center">
      <div className="mx-auto flex max-w-lg flex-col items-start justify-start gap-2">
        <Label>
          {user?.email} {error?.message}
        </Label>
        <Label className="text-2xl">Neues Passwort</Label>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ihr neus Passwort</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              {loading
                ? "Passwort aktualisieren ..."
                : "Passwort aktualisieren"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const client = createSClient(context);
  const { data, error } = await client.auth.getUser();

  return {
    props: {
      user: data.user,
      error: error,
    },
  };
};

export default UpdatePassword;
