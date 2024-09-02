
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
import { SpinnerLoader } from "@/components/ui/spinner";

interface VideoProps {
  src: string;
  autoplay?: boolean;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoProps) {
  const [isBuffering, setIsBuffering] = useState(false);

  const handleWaiting = () => {
    console.log("Video is buffering...");
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    console.log("Video started playing...");
    setIsBuffering(false);
  };

  const handleSeek = (event:any) => {
    console.log(`Seeking to: ${event.target.currentTime}`);
  };

  return (
    <div className="relative rounded-md">
      <Player
        primaryColor="#fff"
        accentColor="#ffffff40"
        className="rounded-md"
        thumbnailTime={20}
        poster={poster ? poster : ""}
        src={`${src}?user_id=6`}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onSeeking={handleSeek}  // Add an event listener for seeking
        controls  
        onEnded={()=>{}}
        autoPlay
      />
    </div>
  );
}
