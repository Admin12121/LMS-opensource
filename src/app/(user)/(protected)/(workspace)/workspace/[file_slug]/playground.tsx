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
import { useGetFileListQuery , useUpdateFileMutation} from "@/lib/store/Service/User_Auth_Api";

function Workspace({ accessToken, params }: any) {
  const [fileData, setFileData] = useState<FILE | any>();
  const [initialDocumentData, setInitialDocumentData] = useState<any>(null);
  const [initialWhiteBoardData, setInitialWhiteBoardData] = useState<any>(null);
  const [type, setType] = useState<string>("Both");
  const [documentData, setDocumentData] = useState<any>(null);
  const [whiteBoardData, setWhiteBoardData] = useState<any>(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const { data, refetch, isLoading } = useGetFileListQuery({ accessToken, slug: params });
  const [updateFile, {isLoading:isLoadingUpdate}] = useUpdateFileMutation();

  useEffect(()=>{
    setFileData(data);
    setInitialDocumentData(data?.document);
    setInitialWhiteBoardData(data?.whiteboard);
  },[data]);

  useEffect(() => {
    const isDocumentChanged = JSON.stringify(documentData) !== JSON.stringify(initialDocumentData);
    const isWhiteBoardChanged = JSON.stringify(whiteBoardData) !== JSON.stringify(initialWhiteBoardData);
    setIsSaveEnabled(isDocumentChanged || isWhiteBoardChanged);
  }, [documentData, whiteBoardData, initialDocumentData, initialWhiteBoardData]);

  const handleSave = async () => {
    const payload = {
      document: JSON.stringify(documentData),
      whiteboard: JSON.stringify(whiteBoardData),
    };
    await updateFile({ accessToken, data: payload, slug: params });
    setInitialDocumentData(documentData);
    setInitialWhiteBoardData(whiteBoardData); 
    setIsSaveEnabled(false);
  };

  return (
    <div className="w-full">
      <WorkspaceHeader fileName={fileData?.filename} setType={setType} type={type} onSave={() => handleSave()} isSaveEnabled={isSaveEnabled} isLoadingUpdate={isLoadingUpdate} />
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
                Loading={isLoading}
                fileData={fileData}
                setDocumentData={setDocumentData}
                documentData={documentData}
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
                Loading={isLoading}
                fileData={fileData}
                setWhiteBoardData={setWhiteBoardData}
                whiteBoardData={whiteBoardData}
              />
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

export default Workspace;