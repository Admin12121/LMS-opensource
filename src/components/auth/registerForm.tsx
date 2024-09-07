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
import useApi from '@/lib/useApi';


const RegisterForm = () => {
  const { data, error, isLoading, fetchData } = useApi<any>(); // Replace 'any' with your data type
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    fetchData({
      url: '/api/auth/registration',
      method: 'POST',
      data: values
    });
  };

  return (
    <Cardwrapper
      title="Signup"
      headerLabel="Network with people from around the world, join groups, create your own, watch courses and become the best version of yourself."
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
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      type="text"
                      placeholder="Name"
                      className="bg-themeBlack border-themeGray text-themeTextGray placeholder:text-[rgb(39 39 42 / 1)]"
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
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      type="email"
                      placeholder="Email"
                      className="bg-themeBlack border-themeGray text-themeTextGray placeholder:text-[rgb(39 39 42 / 1)]"
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
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      type="password"
                      placeholder="Password"
                      autoComplete="off"
                      className="bg-themeBlack border-themeGray text-themeTextGray placeholder:text-[rgb(39 39 42 / 1)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={data?.message} />
          <Button disabled={isLoading} loading={isLoading} type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </Form>
    </Cardwrapper>
  );
};

export default RegisterForm;
