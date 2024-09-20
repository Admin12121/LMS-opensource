import { Icon } from "@/components/workspace/editor/ui/Icon";
import { EditorInfo } from "./EditorInfo";
import { EditorUser } from "../types";
import { WebSocketStatus } from "@hocuspocus/provider";
// import { Toolbar } from '@/components/workspace/editor/ui/Toolbar'
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import deepEqual from "fast-deep-equal";
import { Menubar } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";

export type EditorHeaderProps = {
  editor: Editor;
  collabState: WebSocketStatus;
  users: EditorUser[];
  saveContent: () => void;
};

export const EditorHeader = ({
  editor,
  collabState,
  users,
  saveContent,
}: EditorHeaderProps) => {
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
      };
      return { characters: characters(), words: words() };
    },
    equalityFn: deepEqual,
  });

  return (
    <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="flex items-center gap-x-1.5">
          {/* <Toolbar.Button
            tooltip={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            onClick={toggleSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? 'bg-transparent' : ''}
          >
            <Icon name={isSidebarOpen ? 'PanelLeftClose' : 'PanelLeft'} />
          </Toolbar.Button> */}
        </div>
      </div>
      <div>
        <Menubar className="h-10">
          {/* <Button onClick={() => setType("Document")} variant={type === "Document" ? "default" : "ghost"} size="sm">Document</Button>
          <Button onClick={() => setType("Both")} variant={type === "Both" ? "default" : "ghost"} size="sm">Both</Button>
          <Button onClick={() => setType("Canvas")} variant={type === "Canvas" ? "default" : "ghost"} size="sm">Canvas</Button> */}
          <Button variant="ghost" size="sm">Document</Button>
          <Button variant="ghost" size="sm">Both</Button>
          <Button variant="ghost" size="sm">Canvas</Button>
        </Menubar>
      </div>
      <EditorInfo
        characters={characters}
        words={words}
        collabState={collabState}
        users={users}
        onSave={saveContent}
      />
    </div>
  );
};
