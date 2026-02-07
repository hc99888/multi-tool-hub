"use client";

import { useState } from "react";
import { Clock, Zap } from "lucide-react";

export default function BPMCalculator() {
  const [bpm, setBpm] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const handleTap = () => {
    const now = Date.now();
    const newTimes = [...tapTimes, now].slice(-8); // 保留最近8次点击
    setTapTimes(newTimes);

    if (newTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTimes.length; i++) {
        intervals.push(newTimes[i] - newTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setBpm(calculatedBpm);
      setIsRunning(true);
    }
  };

  const resetTap = () => {
    setTapTimes([]);
    setIsRunning(false);
    setBpm(120);
  };

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playClick = async () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
    
    const osc = (audioContext || new (window.AudioContext || (window as any).webkitAudioContext)()).createOscillator();
    const gain = (audioContext || new (window.AudioContext || (window as any).webkitAudioContext)()).createGain();
    
    osc.connect(gain);
    gain.connect((audioContext || new (window.AudioContext || (window as any).webkitAudioContext)()).destination);
    
    osc.frequency.value = 1000;
    gain.gain.value = 0.3;
    
    osc.start();
    osc.stop((audioContext || new (window.AudioContext || (window as any).webkitAudioContext)()).currentTime + 0.05);
  };

  const toggleMetronome = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    playClick();
    
    const interval = (60000 / bpm);
    const timer = setInterval(() => {
      if (!isPlaying) {
        clearInterval(timer);
        return;
      }
      playClick();
    }, interval);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">BPM计算器</h1>
              <p className="text-slate-600 dark:text-slate-400">通过点击或输入来计算节拍速度</p>
            </div>
          </div>

          {/* BPM Display */}
          <div className="text-center mb-8">
            <div className="text-8xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {bpm}
            </div>
            <div className="text-xl text-slate-600 dark:text-slate-400 font-medium">BPM</div>
          </div>

          {/* Manual Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              手动输入BPM
            </label>
            <input
              type="range"
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-slate-500 mt-1">
              <span>40</span>
              <span>240</span>
            </div>
          </div>

          {/* Tap Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={handleTap}
              onMouseDown={() => setIsRunning(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-8 rounded-xl font-bold text-xl hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              <Zap className="w-8 h-8 mx-auto mb-2" />
              点击这里
            </button>

            <button
              onClick={resetTap}
              className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-6 px-8 rounded-xl font-bold text-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              重置
            </button>
          </div>

          {/* Metronome */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">节拍器</h3>
            <button
              onClick={toggleMetronome}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                isPlaying
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl"
              }`}
            >
              {isPlaying ? "停止播放" : "播放节拍"}
            </button>
          </div>

          {/* Tap History */}
          {tapTimes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                点击记录 ({tapTimes.length} 次)
              </h3>
              <div className="flex gap-2 flex-wrap">
                {tapTimes.map((time, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold"
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
