"use client";
import * as React from "react";
import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { store, AppStore } from "@/lib/store/store";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "sonner";
import { Spinner } from "@nextui-org/spinner";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = store();
  }
  return (
    <NextThemesProvider {...props}>
        <Toaster
          icons={{ loading: <Spinner size="sm" color="secondary" /> }}
          invert={true}
          pauseWhenPageIsHidden={true}
          theme="system"
          position="top-right"
        />      
      <Provider store={storeRef.current}>{children}</Provider>
    </NextThemesProvider>
  );
}
