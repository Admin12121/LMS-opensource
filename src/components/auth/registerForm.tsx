"use client";

import React from "react";
import Cardwrapper from "./cardwrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../../schemas";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-message/form-error";
import { FormSuccess } from "../form-message/form-success";
import { useTransition, useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string >('');
  const [success, setSuccess] = useState<string >('');
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      axios.post('/api/auth/registration', values)
        .then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setSuccess('User created successfully');
          }
        })
        .catch((error) => {
          setError(error.response?.data?.error || 'An error occurred. Please try again.');
          console.error('API call error:', error);
        });
    });
  };

  return (
    <Cardwrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="text"
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="email"
                      placeholder="john@gmail.com"
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
                    <Input
                      {...field}
                      disabled={isPending}
                      type="password"
                      placeholder="********"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </Form>
    </Cardwrapper>
  );
};

export default RegisterForm;
