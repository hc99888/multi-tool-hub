"use client";

import { useState } from "react";
import { Music, Play, RefreshCw } from "lucide-react";

interface Note {
  note: string;
  octave: number;
  duration: number;
}

export default function MelodyGenerator() {
  const [melody, setMelody] = useState<Note[]>([]);
  const [style, setStyle] = useState<"major" | "minor" | "pentatonic">("major");
  const [length, setLength] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);

  const scales = {
    major: ["C", "D", "E", "F", "G", "A", "B"],
    minor: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
    pentatonic: ["C", "D", "E", "G", "A"]
  };

  const noteToFreq: Record<string, number> = {
    "C": 261.63, "C#": 277.18, "D": 293.66, "D#": 311.13, "E": 329.63,
    "F": 349.23, "F#": 369.99, "G": 392.00, "G#": 415.30, "A": 440.00,
    "A#": 466.16, "B": 493.88, "Eb": 311.13, "Ab": 415.30, "Bb": 466.16
  };

  const generateMelody = () => {
    const newMelody: Note[] = [];
    const currentScale = scales[style];

    for (let i = 0; i < length; i++) {
      // 随机选择音阶中的音符
      const note = currentScale[Math.floor(Math.random() * currentScale.length)];
      // 随机选择八度（4-6）
      const octave = Math.floor(Math.random() * 3) + 4;
      // 随机时长（0.25-1）
      const duration = Math.random() * 0.75 + 0.25;
      
      newMelody.push({ note, octave, duration });
    }

    setMelody(newMelody);
  };

  const playMelody = async () => {
    if (melody.length === 0 || isPlaying) return;
    
    setIsPlaying(true);
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let startTime = audioContext.currentTime;

    melody.forEach((noteData, index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      // 计算频率（根据八度调整）
      const baseFreq = noteToFreq[noteData.note] || 440;
      const freq = baseFreq * Math.pow(2, noteData.octave - 4);
      osc.frequency.value = freq;
      osc.type = "sine";
      
      const duration = noteData.duration;
      gain.gain.value = 0.3;
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
      
      startTime += duration;
    });

    // 播放完成后重置状态
    setTimeout(() => {
      setIsPlaying(false);
    }, melody.reduce((sum, note) => sum + note.duration * 1000, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white">
              <Music className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">旋律生成器</h1>
              <p className="text-slate-600 dark:text-slate-400">使用算法生成随机旋律</p>
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                音阶风格
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="major">大调音阶</option>
                <option value="minor">小调音阶</option>
                <option value="pentatonic">五声音阶</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                旋律长度
              </label>
              <input
                type="number"
                min="4"
                max="16"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={generateMelody}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              生成旋律
            </button>

            <button
              onClick={playMelody}
              disabled={melody.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              播放旋律
            </button>

            <button
              onClick={() => setMelody([])}
              className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-4 px-6 rounded-xl font-bold text-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              清空
            </button>
          </div>

          {/* Melody Display */}
          {melody.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                生成的旋律 ({melody.length} 个音符)
              </h3>
              <div className="flex flex-wrap gap-2">
                {melody.map((note, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 rounded-lg bg-white dark:bg-slate-800 shadow-md font-bold text-green-600 dark:text-green-400 text-center min-w-[80px]"
                  >
                    <div className="text-xl">{note.note}</div>
                    <div className="text-xs text-slate-500">八度: {note.octave}</div>
                    <div className="text-xs text-slate-500">时长: {note.duration.toFixed(2)}s</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">使用说明</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
              <li>• 选择音阶风格：大调音阶、小调音阶或五声音阶</li>
              <li>• 设置旋律长度：4-16个音符</li>
              <li>• 点击"生成旋律"创建随机旋律</li>
              <li>• 点击"播放旋律"聆听生成的旋律</li>
              <li>• 每次生成的旋律都是随机的，可以反复尝试</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
