import React from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import Image from "next/image";
import { SpinnerLoader } from "@/components/ui/spinner";

function Canvas({
  Loading = false,
  setWhiteBoardData,
  whiteBoardData,
}: {
  Loading?: boolean;
  setWhiteBoardData: (data: any) => void;
  whiteBoardData: string;
}) {

  return (
    <div style={{ height: "calc(100vh - 66px)" }}>
      {(Loading && !whiteBoardData) ? (
        <div className="flex items-center justify-center h-full">
          <SpinnerLoader/>
        </div>
      ) : (
        <Excalidraw
          theme="dark"
          initialData={{
            elements: whiteBoardData ? JSON.parse(whiteBoardData) : [],
            scrollToContent: true,
          }}
          onChange={(excalidrawElements, appState, files) => {
            setWhiteBoardData(JSON.stringify(excalidrawElements));
          }}
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
              <WelcomeScreen.Center.Logo>
                <Image src="/logo.svg" alt="logo" width={80} height={80} />
              </WelcomeScreen.Center.Logo>
              <WelcomeScreen.Center.Heading>
                Welcome to the Whiteboard
              </WelcomeScreen.Center.Heading>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      )}
    </div>
  );
}

export default Canvas;
