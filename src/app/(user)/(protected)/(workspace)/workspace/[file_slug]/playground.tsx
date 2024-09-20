"use client";
import React, { useEffect, useState, useRef } from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import Editor from "../_components/Editor";
import { FILE } from "@/schemas";
import Canvas from "../_components/Canvas";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  useGetFileListQuery,
  useUpdateFileMutation,
} from "@/lib/store/Service/User_Auth_Api";

function Workspace({ user, accessToken, params }: any) {
  const [fileData, setFileData] = useState<FILE | any>();
  const [documentData, setDocumentData] = useState<string>('');
  const [socketDocumentData, setSocketDocumentData] = useState<string>('');
  const [socketWhiteBoardData, setSocketWhiteBoardData] = useState<string>('');
  const [whiteBoardData, setWhiteBoardData] = useState<string>('');
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const { data, refetch, isLoading } = useGetFileListQuery({
    accessToken,
    slug: params,
  });
  const [updateFile, { isLoading: isLoadingUpdate }] = useUpdateFileMutation();
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const documentUpdateFromSocket = useRef(false);
  const whiteBoardUpdateFromSocket = useRef(false);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setFileData(data);
  }, [data]);

  useEffect(() => {
    if (fileData) {
      setDocumentData(fileData.document);
      setWhiteBoardData(fileData.whiteboard);
    }
  }, [fileData]);

  useEffect(() => {
    const socketUrl = `ws://localhost:8000/ws/canvas/${params}/collaboration/?token=${accessToken}`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "collaboration_message") {
        const sender = data.user.email;
        if (sender !== user.email) {
          if (data.document) {
            documentUpdateFromSocket.current = true;
            updateDocumentData(data.document);
          }
          if (data.whiteboard) {
            whiteBoardUpdateFromSocket.current = true;
            updateWhiteboardData(data.whiteboard);
          }
        }
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(socket);
    return () => {
      socket.close();
    };
  }, [params, accessToken]);

  const updateDocumentData = (newDocumentData: any) => {
    // Check if the update came from the socket or local user
    if (!documentUpdateFromSocket.current) {
      setDocumentData(newDocumentData);
    }
    documentUpdateFromSocket.current = false;
  };

  const updateWhiteboardData = (newWhiteboardData: any) => {
    // Similar logic for whiteboard updates
    if (!whiteBoardUpdateFromSocket.current) {
      setWhiteBoardData(newWhiteboardData);
    }
    whiteBoardUpdateFromSocket.current = false;
  };

  // Debounce function for saving changes to avoid flooding server with requests
  const debounceSave = (saveFunction: () => void, delay: number) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(saveFunction, delay);
  };

  const handleSave = async () => {
    const payload = {
      document: JSON.stringify(documentData),
      whiteboard: JSON.stringify(whiteBoardData),
    };
    await updateFile({ accessToken, data: payload, slug: params });
    setIsSaveEnabled(false);
  };

  const sendUpdate = (type: string, data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const payload = {
        type: "collaboration_message",
        [type]: data,
        user: {
          email: user.email, // Track user info
          name: user.name,   // Track user's name
        },
      };
      ws.send(JSON.stringify(payload));
    }
  };

  useEffect(() => {
    if (localChanges) {
      debounceSave(() => {
        sendUpdate('document', socketDocumentData);
        sendUpdate('whiteboard', socketWhiteBoardData);
        setLocalChanges(false);
      }, 300);
    }
  }, [socketWhiteBoardData, socketDocumentData, ws]);

  return (
    <div className="w-full">
      <WorkspaceHeader
        fileName={fileData?.filename}
        onSave={handleSave}
        isSaveEnabled={isSaveEnabled}
        isLoadingUpdate={isLoadingUpdate}
      />
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full items-stretch max-w-[2400px]"
      >
        <ResizablePanel
          minSize={30}
          className="overflow-hidden overflow-y-auto h-[calc(100vh-66px)]"
        >
          <Editor
            setLocalChanges={setLocalChanges}
            Loading={isLoading}
            setDocumentData={setSocketDocumentData}
            documentData={documentData}
          />
          {/* <TiptapEditor/> */}
        </ResizablePanel>
        <ResizableHandle className="bg-transparent w-2 max-md:hidden" />
        <ResizablePanel
          minSize={30}
          className="overflow-hidden overflow-y-auto h-[calc(100vh-66px)]"
        >
          {<Canvas
            Loading={isLoading}
            setWhiteBoardData={setSocketWhiteBoardData}
            whiteBoardData={whiteBoardData}
          />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default Workspace;
