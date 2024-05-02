/* eslint-disable react-hooks/exhaustive-deps */
import { type UserResponse } from "@supabase/supabase-js";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
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
import { toast } from "~/components/ui/use-toast";
import { createClient } from "~/utils/supabase/component";
import { Input } from "~/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/loading-spinner";

const formSchema = z.object({
  email: z.string().min(0, {
    message: "Email must be included.",
  }),
  password: z.string().min(0, {
    message: "Password must be included.",
  }),
});

const LoginPage: NextPage = () => {
  const { replace } = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentUser, setUser] = useState<UserResponse | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const supabaseClient = createClient();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log(values);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setLoading(false);
    if (error) {
      toast({ title: error.code, description: error.message });
    }
  }

  useEffect(() => {
    if (!mounted) setMounted(true);
    const getUser = async () => {
      setLoading(true);
      const user = await supabaseClient.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    if (!currentUser) {
      void getUser();
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (mounted && currentUser?.data.user) {
    toast({ description: "Already logged in" });
    void replace("/");
  }

  return (
    <main className="mt-20 flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <Label className="text-2xl">Sign in</Label>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Sign In</Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default LoginPage;
