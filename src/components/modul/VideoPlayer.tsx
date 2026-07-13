"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface Checkpoint {
  timestamp: number;
  question: string;
  options: string[];
  answer: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  subtitleUrl?: string;
  hasSignLanguage?: boolean;
  signLanguageUrl?: string;
  onPause?: () => void;
  checkpoints?: Checkpoint[];
}

export default function VideoPlayer({
  videoUrl,
  subtitleUrl,
  hasSignLanguage,
  signLanguageUrl,
  onPause,
  checkpoints = [],
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const signLanguageVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [triggeredCheckpoints, setTriggeredCheckpoints] = useState<Set<number>>(new Set());

  // Handle checkpoints
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const currentTime = videoRef.current.currentTime;
    
    checkpoints.forEach((checkpoint) => {
      // Trigger if current time is within 0.5s of the checkpoint timestamp
      if (
        Math.abs(currentTime - checkpoint.timestamp) < 0.5 &&
        !triggeredCheckpoints.has(checkpoint.timestamp)
      ) {
        // Pause the video
        videoRef.current?.pause();
        if (signLanguageVideoRef.current) {
          signLanguageVideoRef.current.pause();
        }
        setIsPlaying(false);
        
        // Mark as triggered
        setTriggeredCheckpoints((prev) => new Set(prev).add(checkpoint.timestamp));
        
        // Call callback
        if (onPause) {
          onPause();
        }
      }
    });
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (signLanguageVideoRef.current) signLanguageVideoRef.current.pause();
      } else {
        videoRef.current.play();
        if (signLanguageVideoRef.current) signLanguageVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg group">
        {/* Badges Section on top-right */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-30 pointer-events-none">
          {subtitleUrl && (
            <span className="bg-gema-navy/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-md font-gilroy font-bold shadow-sm">
              CC
            </span>
          )}
          {hasSignLanguage && (
            <span className="bg-gema-tosca/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-md font-gilroy font-bold shadow-sm">
              🤟 Isyarat
            </span>
          )}
        </div>

        {/* Main Video */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          {subtitleUrl && (
            <track
              kind="subtitles"
              src={subtitleUrl}
              srcLang="id"
              label="Bahasa Indonesia"
              default
            />
          )}
        </video>

        {/* Global style for Subtitles High Contrast */}
        <style dangerouslySetInnerHTML={{
          __html: `
            video::cue {
              background-color: rgba(0, 0, 0, 0.8);
              color: white;
              font-size: 1.25rem; /* text-lg minimum */
              font-family: var(--font-gilroy), sans-serif;
              text-shadow: 1px 1px 2px black;
              padding: 0.2em 0.5em;
            }
          `
        }} />

        {/* Sign Language Video Overlay */}
        {hasSignLanguage && signLanguageUrl && (
          <div className="absolute bottom-16 right-4 w-40 h-28 rounded-xl border-2 border-white shadow-lg overflow-hidden bg-gema-navy z-10 pointer-events-none">
            <video
              ref={signLanguageVideoRef}
              src={signLanguageUrl}
              className="w-full h-full object-cover"
              muted // Sign language usually muted
            />
          </div>
        )}

        {/* Custom Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
            <button
              onClick={togglePlay}
              className="w-20 h-20 min-h-[48px] bg-gema-tosca text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Play Video"
            >
              <Play fill="currentColor" size={32} className="ml-2" />
            </button>
          </div>
        )}

        {/* Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-gema-mint transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gema-tosca rounded-full"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} />}
            </button>
            <button
              onClick={toggleMute}
              className="text-white hover:text-gema-mint transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gema-tosca rounded-full"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
            </button>
          </div>

          <button
            onClick={handleFullscreen}
            className="text-white hover:text-gema-mint transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gema-tosca rounded-full"
            aria-label="Fullscreen"
          >
            <Maximize size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
