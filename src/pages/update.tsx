"use client";

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
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "~/utils/supabase/component";
import { useEffect, useState } from "react";

const formSchema = z.object({
  password: z.string().min(6),
});

const UpdatePassword = () => {
  const { toast } = useToast();

  const { isPending, mutateAsync } = api.user.updatePassword.useMutation();

  const [hash, setHash] = useState<undefined | Record<string, string>>(
    undefined,
  );

  const params = useParams();

  useEffect(() => {
    setHash(
      Object.fromEntries(
        new URLSearchParams(window.location.hash.replace("#", "")),
      ),
    );
    console.log("Hash:", window.location.hash);
  }, [params]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const client = createClient();
    const access_token = hash?.access_token;
    const refresh_token = hash?.refresh_token;
    const session = await client.auth.getSession();
    if (!session.data && access_token && refresh_token) {
      const sesh = await client.auth.setSession({
        access_token,
        refresh_token,
      });
      if (sesh.error) {
        toast({
          title: sesh.error.code,
          description: sesh.error.message,
        });
      }
    }
    const val = await mutateAsync({ password: values.password });
    if (val?.error) {
      toast({ title: val.error.code, description: val.error.message });
    } else {
      toast({ title: "✅" });
    }
  }

  return (
    <main className="mt-20 flex h-full w-full flex-col items-center justify-center">
      <div className="mx-auto flex max-w-lg flex-col items-start justify-start gap-2">
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
              {isPending
                ? "Passwort aktualisieren ..."
                : "Passwort aktualisieren"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default UpdatePassword;
