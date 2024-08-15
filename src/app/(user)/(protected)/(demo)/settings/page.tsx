import { auth, signOut } from "@/auth";
import { AdminPanel1 } from "@/components/admin-panel/admin-panel1";
import { cookies } from "next/headers"

const Settings = async () => {
  const session = await auth();
  const layout = cookies().get("react-resizable-panels:layout:mail")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
    return (
    <div className="h-full">
      {/* <h1>Settings</h1>
      {JSON.stringify(session)}
      <form action={async () =>{
        "use server";
        await signOut();
        window.location.href = "/";
      }}>
        <Button type="submit" className="w-50">
          Logout
        </Button>
      </form> */}
        <AdminPanel1
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        >
          <div>
            <h1>Settings</h1>
          </div>
        </AdminPanel1>
    </div>
  );
};

export default Settings;
