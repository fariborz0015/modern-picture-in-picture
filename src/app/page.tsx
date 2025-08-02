"use client";

import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import PipCallWindow from "./components/PipCallWindow";

export default function PictureInPictureDemo() {
  const pipButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isPipActive, setIsPipActive] = useState(false);

  const handleEnterPiP = async () => {
    if (!("documentPictureInPicture" in window)) {
      setIsSupported(false);
      alert("Document PiP is not supported in this browser.");
      return;
    }

    try {
      setIsPipActive(true);
      const pipWindow = await (window as typeof window & {
        documentPictureInPicture: {
          requestWindow: (options: { width: number; height: number }) => Promise<Window>;
        };
      }).documentPictureInPicture.requestWindow({
        width: 480,
        height: 480,
      });

      // کپی کردن تمام stylesheets از صفحه اصلی
      const originalStylesheets = document.head.querySelectorAll('link[rel="stylesheet"], style');
      originalStylesheets.forEach((stylesheet) => {
        const clonedStylesheet = stylesheet.cloneNode(true);
        pipWindow.document.head.appendChild(clonedStylesheet);
      });

      // اضافه کردن استایل‌های پایه
      const baseStyle = pipWindow.document.createElement('style');
      baseStyle.textContent = `
        body { 
          margin: 0; 
          padding: 0;
          height: 100vh;
          overflow: hidden;
        }
        #pip-root {
          height: 100vh;
          width: 100vw;
        }
      `;
      pipWindow.document.head.appendChild(baseStyle);

      // ساخت div برای render کردن React component
      const rootDiv = pipWindow.document.createElement('div');
      rootDiv.id = 'pip-root';
      pipWindow.document.body.appendChild(rootDiv);

      // Render کردن React component در PiP window
      const root = createRoot(rootDiv);
      root.render(
        <PipCallWindow 
          onEndCall={() => {
            pipWindow.close();
          }}
        />
      );

      pipWindow.addEventListener("pagehide", () => {
        setIsPipActive(false);
        root.unmount(); // تمیز کردن React root وقتی PiP window بسته می‌شه
      });
    } catch (err) {
      console.error("Failed to enter PiP:", err);
      setIsPipActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002 2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Picture in Picture
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Experience the next-generation floating window for video calls and interactive content
          </p>
        </div>

        {/* Main Demo Card */}
        <div 
          ref={containerRef} 
          className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full transform transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:bg-white/15"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Demo: Meet-style PiP
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Click the button below to experience the floating call window
            </p>
          </div>

          <button
            ref={pipButtonRef}
            onClick={handleEnterPiP}
            disabled={!isSupported || isPipActive}
            className={`
              w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform
              ${isSupported && !isPipActive
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-white/20'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500'
              }
            `}
          >
            {isPipActive ? 'Floating Window Active...' : 'Open Picture-in-Picture'}
          </button>

          {!isSupported && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg">
              <p className="text-red-200 text-sm text-center">
                Your browser doesn&apos;t support this feature
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            {
              title: "Better Focus",
              description: "Make calls while multitasking with other apps",
              svg: <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            },
            {
              title: "High Performance",
              description: "Optimized performance with zero lag",
              svg: <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            },
            {
              title: "Beautiful Design",
              description: "Modern and attractive user interface",
              svg: <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" /></svg>
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
              <div className="mb-4 flex justify-center">
                {feature.svg}
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Developer Info */}
        <div className="mt-20 max-w-4xl w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Meet the Developer</h3>
              <p className="text-gray-300">Connect with me on various platforms</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="https://github.com/fariborz0015" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/15 group"
              >
                <div className="mb-4">
                  <svg className="w-10 h-10 text-white group-hover:text-gray-300 transition-colors mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <h4 className="text-white font-semibold mb-2">GitHub</h4>
                <p className="text-gray-300 text-sm">fariborz0015</p>
                <p className="text-gray-400 text-xs mt-1">View my projects</p>
              </a>

              <a 
                href="https://www.linkedin.com/in/fariborzamm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/15 group"
              >
                <div className="mb-4 w-full flex justify-center">
                  <Icon
                    icon="mdi:linkedin" 
                    className="text-blue-400 text-4xl group-hover:text-blue-300 transition-colors"
                  ></Icon>
                </div>
                <h4 className="text-white font-semibold mb-2">LinkedIn</h4>
                <p className="text-gray-300 text-sm">fariborzamm</p>
                <p className="text-gray-400 text-xs mt-1">Professional network</p>
              </a>

              <a 
                href="https://fariborzz.ir" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/15 group"
              >
                <div className="mb-4 w-full flex justify-center">
                  <Icon
                    icon="material-symbols:language" 
                    className="text-purple-400 text-4xl group-hover:text-purple-300 transition-colors"
                  ></Icon>
                </div>
                <h4 className="text-white font-semibold mb-2">Website</h4>
                <p className="text-gray-300 text-sm">fariborzz.ir</p>
                <p className="text-gray-400 text-xs mt-1">Personal portfolio</p>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            Built with ❤️ for better user experience by Fariborz
          </p>
        </div>
      </div>
    </div>
  );
}