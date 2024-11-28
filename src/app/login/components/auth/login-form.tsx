"use client";

import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import { authenticateUser, LoginInput, loginSchema } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";

// const loginSchema = z.object({
//     Pno: z.string().min(10, "Nomor Tlp harus 10 digits").regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format (e.g., +1234567890)"),
//     password: z.string().min(8, "Password minimal 8 karakter").regex(/^[a-zA-Z\s]*$/, "Name must contain only letters and spaces"),
// });

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
      });


    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginInput) {
        try {
            setIsLoading(true);
            const user = await authenticateUser(values);
            
            console.log(user);
            
            login(user);

            toast({
                title: "Login successful!",
                description: `Welcome back, ${user.name}`,
            });

            router.push("/homepage");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Login failed",
                description: error instanceof Error ? error.message : "Please try again",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="you@example.com"
                                    type="Pno"
                                    disabled={isLoading}
                                    {...field}
                                    className="bg-white dark:bg-gray-950"
                                />
                            </FormControl>
                            <FormMessage />
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
                                <div className="relative">
                                    <Input
                                        placeholder="Enter your password"
                                        type={showPassword ? "text" : "password"}
                                        {...field}
                                        className="bg-white dark:bg-gray-950 pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    >
                        Sign In
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    </Button>
                </div>
            </form>
        </Form>
    );
}