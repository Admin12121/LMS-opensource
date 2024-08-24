
// import React from "react";
// import Player from 'next-video/player';
// import Video from 'next-video';

// interface VideoProps {
//   src: string;
//   autoplay?: boolean;
// }

// export function VideoPlayer({ src}: VideoProps) {

//   return (
//     <Player primaryColor="#fff" accentColor="#ffffff40" className="rounded-md " thumbnailTime={20} src={src} />
//   );
// }


import React, { useState } from "react";
import Player from 'next-video/player';
import {SpinnerLoader} from "@/components/ui/spinner";

interface VideoProps {
  src: string;
  autoplay?: boolean;
}

export function VideoPlayer({ src }: VideoProps) {
  const [isBuffering, setIsBuffering] = useState(false);

  const handleWaiting = () => setIsBuffering(true);
  const handlePlaying = () => setIsBuffering(false);

  return (
    <div className="relative rounded-md">
      {isBuffering && (
        <div className="absolute z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <SpinnerLoader />
        </div>
      )}
      <Player
        primaryColor="#fff"
        accentColor="#ffffff40"
        className="rounded-md"
        thumbnailTime={20}
        src={src}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        controls
      />
    </div>
  );
}
