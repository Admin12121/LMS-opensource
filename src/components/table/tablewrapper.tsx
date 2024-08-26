import { Metadata } from "next"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

interface TaskPageProps {
  accessToken: string | null;
}

export default function TaskPage({ accessToken }: TaskPageProps ) {
  return (
    <>
      <div className="h-[calc(100vh-100px)] overflow-hidden flex-1 flex-col space-y-8 py-8 px-0 md:flex">
         <DataTable accessToken={accessToken} columns={columns} />
      </div>
    </>
  )
}