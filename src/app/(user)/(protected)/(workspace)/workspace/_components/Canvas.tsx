import React, { useEffect, useState } from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { useUpdateFileMutation } from "@/lib/store/Service/User_Auth_Api"
import { FILE } from "@/schemas";
import Image from "next/image";
import { SpinnerLoader } from "@/components/ui/spinner";

function Canvas({
  fileData,
  Loading,
  setWhiteBoardData,
  whiteBoardData
}: {
  fileData: FILE;
  Loading:boolean;
  setWhiteBoardData: (data: any) => void;
  whiteBoardData: string;
}) {
  return (
    <div style={{ height: "calc(100vh - 66px)" }}>
        {Loading ? <div className="flex items-center justify-center h-full">
          <SpinnerLoader className="h-4 w-4 animate-spin" />
        </div> : <Excalidraw
          theme="dark"
          initialData={{
            elements: fileData?.whiteboard && JSON.parse(fileData?.whiteboard),
            scrollToContent: true
          }}
          onChange={(excalidrawElements, appState, files) =>
            setWhiteBoardData(excalidrawElements)
          }
          UIOptions={{
            canvasActions: {
              saveToActiveFile: false,
              loadScene: true,
              export: false,
              toggleTheme: true,
            },
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.LoadScene />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
          <WelcomeScreen>
          <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
          <WelcomeScreen.Center>
            <WelcomeScreen.Center.Logo >
              <Image src="/logo.svg" alt="logo" width={80} height={80} />
            </WelcomeScreen.Center.Logo>
            <WelcomeScreen.Center.Heading>
              Welcome to the Whiteboard
            </WelcomeScreen.Center.Heading>
          </WelcomeScreen.Center>
        </WelcomeScreen>
        </Excalidraw>}
    </div>
  );
}

export default Canvas;
