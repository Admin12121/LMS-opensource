import React, { useEffect, useState } from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { FILE } from "@/schemas";
import Image from "next/image";
function Canvas({
  onSaveTrigger,
  fileId,
  fileData,
}: {
  onSaveTrigger?: any;
  fileId: any;
  fileData: FILE;
}) {
  const [whiteBoardData, setWhiteBoardData] = useState<any>();

  return (
    <div style={{ height: "calc(100vh - 66px)" }}>
        <Excalidraw
          theme="dark"
          initialData={{
            // elements: fileData?.whiteboard && JSON.parse(fileData?.whiteboard),
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
        </Excalidraw>
    </div>
  );
}

export default Canvas;
