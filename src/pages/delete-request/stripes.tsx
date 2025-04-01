import { NextPage } from "next";

import { useForm } from "react-hook-form";
import { Resend } from "resend";
import { z } from "zod";
import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";

//const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
  email: z.string().email(),
});

const DeleteRequest: NextPage = () => {
  const form = useForm<z.infer<typeof formSchema>>();

  const { toast } = useToast();

  const formSubmit = async (value: z.infer<typeof formSchema>) => {
    const res = await fetch("/api/send-delete", {
      method: "POST",
      body: JSON.stringify(value),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      toast({ title: "Email sent" });
    } else {
      toast({
        title: "Something went wrong",
        description: JSON.stringify(res.json),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-4">
      <div className="mx-auto mt-16 flex max-w-prose flex-col items-center justify-center">
        <Label className="text-2xl font-bold">Account Deletion Request</Label>
        <Label className="my-6">
          Notify the Stripes team that you want an account deletion by providing
          the email address you used to create your Stripes account.
        </Label>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(formSubmit)}
            className="flex flex-col justify-center space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="email" {...field} type="email" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Request Account Deletion</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DeleteRequest;
