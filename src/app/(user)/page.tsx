import Image from "next/image";
import { Button } from "@/components/ui/button";
import LoginButton from "@/components/auth/login-button";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full bg-blue-400 w-full">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-bold text-white drop-shadow-md">
          Welcome to the Home Page
        </h1>
        <p className="text-white text-lg">
          This is a simple home page with a gradient background.
        </p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
