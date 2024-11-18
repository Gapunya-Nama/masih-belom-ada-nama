"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRef } from "react";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function InputForm() {
  const { toast } = useToast();
  const h1Ref = useRef<HTMLHeadingElement>(null); // Correctly type the ref for the <h1>

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleMouseOver = (event: React.MouseEvent<HTMLHeadingElement>) => {
    let iterations = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const element = event.target as HTMLHeadingElement;
    const originalText = element.innerText; // Save the original text

    const interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (letter === " ") return " "; // Keep spaces intact
          return iterations > index
            ? originalText[index]
            : letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      iterations += 1;

      if (iterations > originalText.length) {
        clearInterval(interval);
        element.innerText = originalText; // Restore the original text
      }
    }, 30);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      {/* Add AnimatedText functionality to the heading */}
      <div className="pt-16">
      <h1 ref={h1Ref} onMouseOver={handleMouseOver} className="cursor-pointer">
        Sijarta
      </h1>
      
      {/* Form Implementation */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      {/* Collapsible Section */}
      <Collapsible>
        <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
        <CollapsibleContent>
          Yes. Free to use for personal and commercial projects. No attribution
          required.
        </CollapsibleContent>
      </Collapsible>
      </div>
    </>
  );
}
