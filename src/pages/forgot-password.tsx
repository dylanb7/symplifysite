/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
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
import { Input } from "~/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button, buttonVariants } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/loading-spinner";
import Link from "next/link";

export const loginSchema = z.object({
  email: z.string().min(0, {
    message: "Email must be included.",
  }),
});

const LoginPage: NextPage = () => {
  const { replace } = useRouter();

  const { mutateAsync, isPending } = api.user.forgotPassword.useMutation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const ret = await mutateAsync({ ...values });
    if (ret?.error) {
      toast({
        title: ret.error.code,
        description: ret.error.message,
      });
    } else if (ret?.data) {
      void replace("/");
    }
  }

  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <main className="mt-20 flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <Label className="text-2xl">Passwort vergessen?</Label>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              Anweisungen zum Zurücksetzen des Passworts senden
            </Button>
          </form>
        </Form>
        <Link href={"/login"} className={buttonVariants({ variant: "link" })}>
          Login
        </Link>
      </div>
    </main>
  );
};

export default LoginPage;
