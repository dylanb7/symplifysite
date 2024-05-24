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

const formSchema = z.object({
  password: z.string().min(6),
});

const UpdatePassword = () => {
  const { toast } = useToast();

  const { isPending, mutateAsync } = api.user.updatePassword.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
