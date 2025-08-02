import React from 'react';

interface PipCallWindowProps {
  onEndCall?: () => void;
}

export default function PipCallWindow({ onEndCall }: PipCallWindowProps) {
  const handleEndCall = () => {
    if (onEndCall) {
      onEndCall();
    } else {
      // Fallback برای وقتی که در PiP window هستیم
      if (typeof window !== 'undefined') {
        window.close();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white text-center p-5 m-0 font-['Inter',sans-serif] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 overflow-hidden">
      <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-7 border border-white/30 shadow-2xl w-full max-w-xs">
        <div className="w-16 h-16 bg-green-500/25 rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse border-2 border-green-500/40">
          <div className="w-7 h-7 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
        </div>
        
        <h3 className="m-0 mb-2 text-xl font-semibold text-slate-50">
          Call in Progress
        </h3>
        
        <p className="m-0 mb-6 text-sm text-slate-300 font-normal">
          Connecting participants...
        </p>
        
        <button
          onClick={handleEndCall}
          className="py-3.5 px-7 border-0 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl cursor-pointer text-[15px] font-semibold transition-all duration-300 shadow-[0_6px_20px_rgba(220,38,38,0.4)] w-full hover:shadow-[0_8px_25px_rgba(220,38,38,0.5)] hover:-translate-y-0.5"
        >
          End Call
        </button>
      </div>
    </div>
  );
}