import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link, Save } from "lucide-react";
import Image from "next/image";
import {
  Menubar,
} from "@/components/ui/menubar";

function WorkspaceHeader({ onSave, setType, type, isSaveEnabled, isLoadingUpdate, fileName }: any) {
  return (
    <div className="p-3 border-b flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} alt="logo" height={40} width={40} />
        <h2 className="lg:hidden">{fileName && fileName}</h2>
        <h2 className="hidden lg:block">
          {fileName && fileName.length > 10
            ? fileName.split(" ").slice(0, 10).join(" ") + "..."
            : fileName}
        </h2>
      </div>
      <div>
        <Menubar className="h-10">
          <Button onClick={() => setType("Document")} variant={type === "Document" ? "default" : "ghost"} size="sm">Document</Button>
          <Button onClick={() => setType("Both")} variant={type === "Both" ? "default" : "ghost"} size="sm">Both</Button>
          <Button onClick={() => setType("Canvas")} variant={type === "Canvas" ? "default" : "ghost"} size="sm">Canvas</Button>
        </Menubar>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <Button
          className="h-8 text-[12px]
        gap-2 bg-yellow-500 hover:bg-yellow-600"
          onClick={() => onSave()}
          disabled={!isSaveEnabled || isLoadingUpdate}
          loading={isLoadingUpdate}
        >
          <Save className="h-4 w-4" /> Save
        </Button>
        <Button
          className="h-8 text-[12px]
        gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Share <Link className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default WorkspaceHeader;