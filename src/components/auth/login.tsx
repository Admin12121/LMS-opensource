"use client";

import Cardwrapper from "./cardwrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../schemas";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import LoginError from "./login-error";
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
import { useState, useEffect } from "react";
import Link from "next/link";
import useApi from '@/lib/useApi';

const Login = () => {
  const { data, error, isLoading, fetchData } = useApi<any>(); 
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<string>("");
  const errorParam = searchParams.get("error");
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    fetchData({
      url: '/api/auth/login',
      method: 'POST',
      data: values
    });
  };

  useEffect(()=>{
    if(data){
      setSuccess("Login Successfull");
      if(data.redirectUrl){
        window.location.href = data.redirectUrl;
      }
    }
  },[data])

  if (errorParam) {
    return <LoginError errorParam={errorParam}/>;
  }

  return (
    <Cardwrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
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
                      disabled={isLoading}
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
          <Button size="sm" variant="link" asChild className="px-0 !mt-2 font-normal">
            <Link href="/auth/reset-password">Forgot Password?</Link>
          </Button>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isLoading} loading={isLoading} type="submit" className="w-full !mt-2">
            Login
          </Button>
        </form>
      </Form>
    </Cardwrapper>
  );
};

export default Login;
