
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { curriculum, LearningItem } from '../data/curriculum';
import { translations } from '../data/i18n';
import confetti from 'canvas-confetti';
import { Volume2, Mic, X, ArrowRight } from 'lucide-react';

// Extend Window interface for SpeechRecognition
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

interface Tile {
  id: string;
  char: string;
  isUsed: boolean;
}

const ActivityRunner: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const { language, ttsRate, addStar } = useStore();
  const t = translations[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [sessionStars, setSessionStars] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | 'neutral' }>({
    msg: '',
    type: 'neutral',
  });
  
  // Spelling Mode State
  const [shuffledTiles, setShuffledTiles] = useState<Tile[]>([]);
  const [userAnswer, setUserAnswer] = useState<Tile[]>([]);

  // Safe access to items
  const items: LearningItem[] = topic && (curriculum as any)[topic] ? (curriculum as any)[topic] : [];
  const currentItem = items[currentIndex];
  const isSpellingMode = topic === 'spelling';

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    // Only init speech if NOT in spelling mode
    if (isSpellingMode) return;

    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US'; 
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, [currentIndex, isSpellingMode]);

  // Setup Spelling Mode Tiles when item changes
  useEffect(() => {
    if (isSpellingMode && currentItem) {
      const chars = currentItem.content.toUpperCase().split('');
      const tiles: Tile[] = chars.map((char, idx) => ({
        id: `${char}-${idx}-${Math.random()}`,
        char,
        isUsed: false
      }));
      
      // Shuffle tiles
      setShuffledTiles([...tiles].sort(() => 0.5 - Math.random()));
      setUserAnswer([]);
      setFeedback({ msg: '', type: 'neutral' });
      
      // Auto-play audio for spelling
      setTimeout(() => speak(), 500);
    }
  }, [currentIndex, isSpellingMode, currentItem]);

  const handleVoiceInput = (transcript: string) => {
    if (!currentItem) return;

    const spoken = transcript.toLowerCase().trim();
    const target = currentItem.content.toLowerCase().trim();
    const isMatch = spoken.includes(target) || target.includes(spoken);

    if (isMatch) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const handleTileClick = (tile: Tile) => {
    if (tile.isUsed) return;
    
    // Mark as used in bank
    const newShuffled = shuffledTiles.map(t => t.id === tile.id ? { ...t, isUsed: true } : t);
    setShuffledTiles(newShuffled);
    
    // Add to answer
    const newAnswer = [...userAnswer, tile];
    setUserAnswer(newAnswer);
    
    // Check answer if full
    if (newAnswer.length === currentItem.content.length) {
      const attempt = newAnswer.map(t => t.char).join('');
      if (attempt === currentItem.content.toUpperCase()) {
        handleSuccess();
      } else {
        handleFailure();
        // Reset tiles after a delay
        setTimeout(() => {
           setShuffledTiles(shuffledTiles.map(t => ({ ...t, isUsed: false })));
           setUserAnswer([]);
        }, 1000);
      }
    }
  };

  const handleRemoveTile = (tileToRemove: Tile) => {
    // Remove from answer
    const newAnswer = userAnswer.filter(t => t.id !== tileToRemove.id);
    setUserAnswer(newAnswer);
    
    // Mark as unused in bank
    const newShuffled = shuffledTiles.map(t => t.id === tileToRemove.id ? { ...t, isUsed: false } : t);
    setShuffledTiles(newShuffled);
  };

  const speak = () => {
    if (!currentItem) return;
    const utterance = new SpeechSynthesisUtterance(currentItem.content);
    if (currentItem.example && !isSpellingMode) {
        // Pause briefly then say example (Only in standard mode)
        utterance.text = `${currentItem.content}. ${currentItem.example}`;
    }
    utterance.lang = 'en-US';
    utterance.rate = ttsRate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setFeedback({ msg: t.tapToSpeak, type: 'neutral' });
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Microphone start failed", e);
        setIsListening(false);
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleSuccess = () => {
    setFeedback({ msg: t.goodJob, type: 'success' });
    addStar();
    setSessionStars(prev => prev + 1);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#84CC16', '#FFB799', '#FFFDF5']
    });

    setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setFeedback({ msg: '', type: 'neutral' });
      } else {
        finishLesson(sessionStars + 1);
      }
    }, 2000);
  };

  const handleFailure = () => {
    setFeedback({ msg: t.tryAgain, type: 'error' });
    setTimeout(() => setFeedback({ msg: '', type: 'neutral' }), 2000);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback({ msg: '', type: 'neutral' });
    } else {
      finishLesson(sessionStars);
    }
  };

  const finishLesson = (finalStars: number) => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
    });
    navigate('/complete', { state: { stars: finalStars, topic } });
  };

  if (!items.length) {
    return <div className="p-8 text-center text-xl">Topic not found. <button onClick={() => navigate('/')} className="underline text-green-500">Go Back</button></div>;
  }

  const progressPercentage = ((currentIndex) / items.length) * 100;

  return (
    <div className="min-h-screen w-full flex flex-col bg-cream-50 overflow-hidden relative">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 rounded-full bg-white border-2 border-peach-400 text-midnight-900 hover:bg-peach-400 transition-colors"
          aria-label={t.exit}
        >
          <X size={24} />
        </button>
        
        <div className="flex-1 mx-4 h-4 bg-white rounded-full border-2 border-midnight-900/10 overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-20">
        
        {/* Card or Question */}
        <div 
          key={`${currentIndex}-${feedback.type}`}
          className={`relative w-full max-w-sm aspect-square bg-white rounded-3xl shadow-xl border-b-8 border-r-8 border-peach-400 flex flex-col items-center justify-center mb-6 transform transition-transform hover:scale-[1.02] animate-bounce-slight ${isSpellingMode ? 'aspect-video h-48' : ''}`}
        >
          
          {isSpellingMode ? (
            <div className="flex flex-col items-center">
               <div className="text-8xl select-none">
                 {currentItem.example?.split(' ').pop() || '❓'}
               </div>
            </div>
          ) : (
            <>
              <div className="text-9xl font-bold text-midnight-900 select-none">
                {currentItem.content}
              </div>
              {currentItem.example && (
                <div className="mt-4 text-2xl text-gray-500 font-medium opacity-80">
                  {currentItem.example}
                </div>
              )}
            </>
          )}
        </div>

        {/* Spelling Interface */}
        {isSpellingMode && (
           <div className="w-full max-w-md mb-6 space-y-4">
             {/* Answer Area */}
             <div className="flex justify-center flex-wrap gap-2 min-h-[4rem] px-2">
               {Array.from({ length: currentItem.content.length }).map((_, i) => {
                 const tile = userAnswer[i];
                 return (
                   <button
                     key={i}
                     onClick={() => tile && handleRemoveTile(tile)}
                     disabled={!tile}
                     className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl font-bold transition-all duration-300 ${
                       tile 
                         ? 'bg-indigo-500 border-b-4 border-indigo-700 text-white shadow-lg transform active:scale-95 hover:-translate-y-1' 
                         : 'bg-gray-50 border-2 border-dashed border-gray-300 text-gray-300 cursor-default'
                     }`}
                     aria-label={tile ? `Remove ${tile.char}` : 'Empty slot'}
                   >
                     {tile?.char || '_'}
                   </button>
                 );
               })}
             </div>

             {/* Letter Bank */}
             <div className="flex flex-wrap justify-center gap-2">
               {shuffledTiles.map((tile) => (
                 <button
                   key={tile.id}
                   onClick={() => handleTileClick(tile)}
                   className={`w-14 h-14 rounded-xl border-b-4 font-bold text-2xl transition-all duration-300 ${
                     tile.isUsed
                       ? 'opacity-0 scale-50 pointer-events-none'
                       : 'bg-white border-peach-400 text-midnight-900 shadow-sm hover:-translate-y-1 active:scale-95'
                   }`}
                   disabled={tile.isUsed}
                 >
                   {tile.char}
                 </button>
               ))}
             </div>
           </div>
        )}

        {/* Feedback Text */}
        <div className="h-12 flex items-center justify-center mb-4">
          {feedback.msg && (
            <span className={`text-2xl font-bold animate-bounce ${
              feedback.type === 'success' ? 'text-green-500' : 
              feedback.type === 'error' ? 'text-peach-400' : 'text-midnight-900'
            }`}>
              {feedback.msg}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
          
          <button
            onClick={speak}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-20 h-20 rounded-full bg-white border-4 border-green-500 flex items-center justify-center shadow-lg group-active:scale-95 transition-transform">
              <Volume2 size={32} className="text-green-500" />
            </div>
            <span className="font-bold text-midnight-900 text-sm md:text-base">{t.hearIt}</span>
          </button>

          {!isSpellingMode && (
            <button
              onClick={startListening}
              disabled={isListening}
              className={`flex flex-col items-center gap-2 group ${isListening ? 'opacity-80' : ''}`}
            >
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-lg transition-all ${
                isListening 
                  ? 'bg-peach-400 border-peach-400 scale-110 animate-pulse' 
                  : 'bg-midnight-900 border-midnight-900 group-active:scale-95'
              }`}>
                <Mic size={40} className="text-white" />
              </div>
              <span className="font-bold text-midnight-900 text-sm md:text-base">{isListening ? '...' : t.sayIt}</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center shadow-lg group-active:scale-95 transition-transform hover:border-peach-400">
              <ArrowRight size={32} className="text-gray-500 group-hover:text-peach-400" />
            </div>
            <span className="font-bold text-gray-500 text-sm md:text-base">{t.next}</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default ActivityRunner;
