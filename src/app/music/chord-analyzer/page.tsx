"use client";

import { useState } from "react";
import { Music, Play } from "lucide-react";

interface Chord {
  name: string;
  notes: string[];
  intervals: string[];
}

export default function ChordAnalyzer() {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [analyzedChord, setAnalyzedChord] = useState<Chord | null>(null);

  const allNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  const commonChords: Record<string, Chord> = {
    "C": { name: "C Major", notes: ["C", "E", "G"], intervals: ["根音", "大三度", "纯五度"] },
    "Cm": { name: "C Minor", notes: ["C", "Eb", "G"], intervals: ["根音", "小三度", "纯五度"] },
    "C7": { name: "C Dominant 7th", notes: ["C", "E", "G", "Bb"], intervals: ["根音", "大三度", "纯五度", "小七度"] },
    "Cmaj7": { name: "C Major 7th", notes: ["C", "E", "G", "B"], intervals: ["根音", "大三度", "纯五度", "大七度"] },
    "Cm7": { name: "C Minor 7th", notes: ["C", "Eb", "G", "Bb"], intervals: ["根音", "小三度", "纯五度", "小七度"] },
    "D": { name: "D Major", notes: ["D", "F#", "A"], intervals: ["根音", "大三度", "纯五度"] },
    "Dm": { name: "D Minor", notes: ["D", "F", "A"], intervals: ["根音", "小三度", "纯五度"] },
    "E": { name: "E Major", notes: ["E", "G#", "B"], intervals: ["根音", "大三度", "纯五度"] },
    "Em": { name: "E Minor", notes: ["E", "G", "B"], intervals: ["根音", "小三度", "纯五度"] },
    "F": { name: "F Major", notes: ["F", "A", "C"], intervals: ["根音", "大三度", "纯五度"] },
    "Fm": { name: "F Minor", notes: ["F", "Ab", "C"], intervals: ["根音", "小三度", "纯五度"] },
    "G": { name: "G Major", notes: ["G", "B", "D"], intervals: ["根音", "大三度", "纯五度"] },
    "Gm": { name: "G Minor", notes: ["G", "Bb", "D"], intervals: ["根音", "小三度", "纯五度"] },
    "A": { name: "A Major", notes: ["A", "C#", "E"], intervals: ["根音", "大三度", "纯五度"] },
    "Am": { name: "A Minor", notes: ["A", "C", "E"], intervals: ["根音", "小三度", "纯五度"] },
    "B": { name: "B Major", notes: ["B", "D#", "F#"], intervals: ["根音", "大三度", "纯五度"] },
    "Bm": { name: "B Minor", notes: ["B", "D", "F#"], intervals: ["根音", "小三度", "纯五度"] },
  };

  const noteToFreq: Record<string, number> = {
    "C": 261.63, "C#": 277.18, "D": 293.66, "D#": 311.13, "E": 329.63,
    "F": 349.23, "F#": 369.99, "G": 392.00, "G#": 415.30, "A": 440.00,
    "A#": 466.16, "B": 493.88, "Eb": 311.13, "Ab": 415.30, "Bb": 466.16
  };

  const toggleNote = (note: string) => {
    if (selectedNotes.includes(note)) {
      setSelectedNotes(selectedNotes.filter(n => n !== note));
    } else {
      setSelectedNotes([...selectedNotes, note]);
    }
  };

  const analyzeChord = () => {
    if (selectedNotes.length === 0) return;

    // 简单匹配常见和弦
    for (const [key, chord] of Object.entries(commonChords)) {
      const sortedChordNotes = [...chord.notes].sort();
      const sortedSelectedNotes = [...selectedNotes].sort();
      
      if (JSON.stringify(sortedChordNotes) === JSON.stringify(sortedSelectedNotes)) {
        setAnalyzedChord(chord);
        return;
      }
    }

    // 如果没有匹配，尝试找包含关系的和弦
    for (const [key, chord] of Object.entries(commonChords)) {
      const allMatched = chord.notes.every(note => selectedNotes.includes(note));
      if (allMatched) {
        setAnalyzedChord(chord);
        return;
      }
    }

    setAnalyzedChord({
      name: "未知和弦",
      notes: selectedNotes,
      intervals: ["自定义音程"]
    });
  };

  const playChord = () => {
    if (!analyzedChord) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    analyzedChord.notes.forEach((note, index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      const freq = noteToFreq[note] || 440;
      osc.frequency.value = freq;
      osc.type = "triangle";
      
      gain.gain.value = 0.2;
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      
      osc.start(audioContext.currentTime + index * 0.05);
      osc.stop(audioContext.currentTime + 1);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              <Music className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">和弦分析器</h1>
              <p className="text-slate-600 dark:text-slate-400">选择音符来识别和弦</p>
            </div>
          </div>

          {/* Note Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">选择音符</h3>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {allNotes.map((note) => (
                <button
                  key={note}
                  onClick={() => toggleNote(note)}
                  className={`py-3 px-4 rounded-xl font-bold text-lg transition-all ${
                    selectedNotes.includes(note)
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Notes Display */}
          {selectedNotes.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">已选择音符:</div>
              <div className="flex gap-2 flex-wrap">
                {selectedNotes.map((note) => (
                  <div
                    key={note}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-md font-bold text-blue-600 dark:text-blue-400"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={analyzeChord}
              disabled={selectedNotes.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              分析和弦
            </button>

            <button
              onClick={() => {
                setSelectedNotes([]);
                setAnalyzedChord(null);
              }}
              className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-4 px-6 rounded-xl font-bold text-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              清空选择
            </button>
          </div>

          {/* Analysis Result */}
          {analyzedChord && (
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analyzedChord.name}
                </h3>
                <button
                  onClick={playChord}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Play className="w-5 h-5" />
                  播放和弦
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">组成音符:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {analyzedChord.notes.map((note) => (
                      <div
                        key={note}
                        className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 shadow font-bold text-purple-600 dark:text-purple-400"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">音程关系:</h4>
                  <div className="space-y-1">
                    {analyzedChord.intervals.map((interval, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
                      >
                        {interval}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Common Chords Reference */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">常见和弦参考</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Object.entries(commonChords).map(([key, chord]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedNotes(chord.notes);
                    setAnalyzedChord(chord);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  {chord.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
