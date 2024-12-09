"use client";

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
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { RoleSelector } from "./components/role-selector";
import React from "react";
import Link from "next/link";
import { cp } from "fs";
import { registerAccount } from "./components/register";
import { useAuth } from "@/context/auth-context";

const banks = [
    "GoPay",
    "OVO",
    "Virtual Account BCA",
    "Virtual Account BNI",
    "Virtual Account Mandiri",
];

const baseSchema = {
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    gender: z.enum(["L", "P"], {
        required_error: "Please select your gender",
    }),
    noHP: z.string().min(10, "Phone number must be at least 10 digits"),
    birthDate: z.string().min(1, "Birth date is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
};

export const userSchema = z.object(baseSchema);

export const workerSchema = z.object({
    ...baseSchema,
    bankName: z.string().min(1, "Bank name is required"),
    accountNumber: z.string().min(10, "Account number must be at least 10 digits"),
    npwp: z.string().min(15, "NPWP must be at least 15 characters").max(20,"NPWP must not exceed 20 characters"),
    photoUrl: z.string().optional(),
});

interface RegisterFormProps {
    role: "user" | "worker" | null;
}

export function RegisterForm({ role }: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const { login } = useAuth();

    const form = useForm<z.infer<typeof workerSchema>>({
        resolver: zodResolver(role === "worker" ? workerSchema : userSchema),
        defaultValues: {
            name: "",
            password: "",
            gender: "L",
            noHP: "",
            birthDate: "",
            address: "",
            ...(role === "worker" && {
                bankName: "",
                accountNumber: "",
                npwp: "",
                photoUrl: "",
            }),
        },
    });

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
                form.setValue("photoUrl", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    async function onSubmit(values: z.infer<typeof workerSchema>) {
        
        let account_data = [
            ...Object.values(values),
            role ?? 'guest'
        ]
        console.log(account_data);
        let user = await registerAccount(account_data);

        if (!user){
            throw Error;
        }
        
        login(user);
        

        toast({
            title: "Register successful!",
            description: `Welcome ${values.name}`,
        });
        router.push("/homepage");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* <form action={registerAccount} className="space-y-6"> */}
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
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
                                            className="pr-10"
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

                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="L" id="L" />
                                            <Label htmlFor="L">Male</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="P" id="P" />
                                            <Label htmlFor="P">Female</Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="noHP"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+62" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Birth Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your complete address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {role === "worker" && (
                        <>
                            <FormField
                                control={form.control}
                                name="photoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile Photo</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-4">
                                                {photoPreview && (
                                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-muted">
                                                        <Image
                                                            src={photoPreview}
                                                            alt="Profile preview"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bankName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Name</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your bank" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {banks.map((bank) => (
                                                    <SelectItem key={bank} value={bank}>
                                                        {bank}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your account number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="npwp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NPWP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your NPWP number" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Your tax identification number
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>

                <div className="space-y-4">
                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    >
                        Register
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/"
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </Form>
    );
}

export default function RegisterPage() {
    const [selectedRole, setSelectedRole] = React.useState<"user" | "worker" | null>(null);
    return(
    <Card className="w-full max-w-lg p-8">
        <div className="flex flex-col items-center space-y-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an Account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Please select your role to get started
                </p>
            </div>

            <RoleSelector
                selectedRole={selectedRole}
                onRoleSelect={setSelectedRole}
            />

            {selectedRole && <RegisterForm role={selectedRole} />}
        </div>
    </Card>
    );
}