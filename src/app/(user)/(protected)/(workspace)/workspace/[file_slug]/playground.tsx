"use client";
import React, { useEffect, useState } from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import Editor from "../_components/Editor";
import { FILE } from "@/schemas";
import Canvas from "../_components/Canvas";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGetFileListQuery } from "@/lib/store/Service/User_Auth_Api";

function Workspace({ accessToken, params }: any) {
  const [triggerSave, setTriggerSave] = useState(false);
  const [fileData, setFileData] = useState<FILE | any>();
  const [type, setType] = useState<string>("Both");
  const { data, refetch, isLoading } = useGetFileListQuery({ accessToken, slug: params });

  useEffect(() => {
    setTriggerSave(false);
  }, [type]);

  return (
    <div className="w-full">
      <WorkspaceHeader setType={setType} type={type} onSave={() => setTriggerSave(!triggerSave)} />
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full items-stretch max-w-[2400px]"
        key={type}
      >
        {(type === "Document" || type === "Both") && (
          <ResizablePanel
            minSize={30}
            className="overflow-hidden overflow-y-auto h-[calc(100vh-66px)]"
          >
            <div className="h-screen">
              <Editor
                onSaveTrigger={triggerSave}
                fileId={params}
                fileData={fileData}
              />
            </div>
          </ResizablePanel>
        )}
        {type === "Both" && <ResizableHandle className="bg-transparent w-2 max-md:hidden" />}
        {(type === "Canvas" || type === "Both") && (
          <ResizablePanel
            minSize={30}
            className="overflow-hidden overflow-y-auto h-[calc(100vh-66px)]"
          >
            <div className="h-screen border-l">
              <Canvas
                onSaveTrigger={triggerSave}
                fileId={params}
                fileData={fileData}
              />
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

export default Workspace;