import { EditorContent } from "@tiptap/react";
import React, { useEffect, useRef , useState} from "react";

import { LinkMenu } from "@/components/workspace/editor/menus";

import { useBlockEditor } from "@/hooks/useBlockEditor";
import Canvas from "@/app/(user)/(protected)/(workspace)/workspace/_components/Canvas";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import "@/styles/index.css";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";

import * as Y from "yjs";
import { TiptapCollabProvider } from "@hocuspocus/provider";

import { SpinnerLoader } from "@/components/ui/spinner";

export const BlockEditor = ({
  ydoc,
  provider,
  params,
  user,
  onSave,
  whiteBoardData,
  documentData,
  isLoading,
  setSocketWhiteBoardData
}: {
  onSave: (content: string) => void;
  user?:any;
  whiteBoardData: string;
  documentData: string;
  isLoading: boolean;
  params: string;
  hasCollab: boolean;
  ydoc: Y.Doc;
  provider?: TiptapCollabProvider | null | undefined;
  setSocketWhiteBoardData: (data: string) => void;
}) => {
  const menuContainerRef = useRef(null);

  const { editor, users, collabState, saveContent } = useBlockEditor({ ydoc, provider, user, onSave , initialContent: documentData});

  if (!editor || !users) {
    return null;
  }

  return (
    <div className="flex h-full w-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorHeader editor={editor} saveContent={saveContent} collabState={collabState} users={users} />
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full items-stretch max-w-[2400px]"
        >
          <ResizablePanel
            minSize={30}
            className="overflow-hidden overflow-y-auto h-[calc(100vh-66px)]"
          >
            <EditorContent editor={editor} className="flex-1 overflow-y-auto h-[calc(100vh-66px)] overflow-hidden" />
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
            <TextMenu editor={editor} />
            <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
            <TableRowMenu editor={editor} appendTo={menuContainerRef} />
            <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
          </ResizablePanel>
          <ResizableHandle className="bg-transparent w-2 max-md:hidden" />
          <ResizablePanel
            minSize={30}
            className="overflow-hidden overflow-y-auto h-[calc(100vh-66px)]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <SpinnerLoader className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Canvas
                Loading={isLoading}
                setWhiteBoardData={setSocketWhiteBoardData}
                whiteBoardData={whiteBoardData}
              />)
            }
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default BlockEditor;
