/* eslint-disable react-hooks/exhaustive-deps */

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
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";

const formSchema = z.object({
  password: z.string().min(0),
});

const UpdatePassword = () => {
  const [supabaseClient] = useState(() => createClient());
  const [loading, setLoading] = useState(false);

  /*const setSession = useCallback(async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    if (!data.session || error) {
      await supabaseClient.auth.setSession();
    }
  }, []);*/

  useEffect(() => {
    const sub = supabaseClient.auth.onAuthStateChange((event, session) => {
      toast({ description: `${event} ${session?.expires_in}` });
    });
    return sub.data.subscription.unsubscribe();
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

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
        <Label className="text-2xl">Neues Passwort</Label>
        <Form {...form}>
          <form
            onSubmit={() => {
              form.handleSubmit(onSubmit);
            }}
            className=" space-y-8"
          >
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

export default UpdatePassword;
