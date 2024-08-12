import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
const Settings = async () => {
  const session = await auth();
    return (
    <div>
      <h1>Settings</h1>
      {JSON.stringify(session)}
      <form action={async () =>{
        "use server";
        await signOut();
        window.location.href = "/";
      }}>
        <Button type="submit" className="w-50">
          Logout
        </Button>
      </form>
    </div>
  );
};

export default Settings;
