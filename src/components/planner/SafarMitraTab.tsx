// Changes made by @MdFarhanAhmad
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, Mic, Send, Bot, User, MapPin } from 'lucide-react';
import { CuratedSpot } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface SafarMitraTabProps {
  destinationKey: string;
  destinationName: string;
  gems: CuratedSpot[];
  eats: CuratedSpot[];
  selectedLanguage: string;
  currentTripState: any;
}

export const SafarMitraTab: React.FC<SafarMitraTabProps> = ({
  destinationKey,
  destinationName,
  gems,
  eats,
  selectedLanguage,
  currentTripState
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `**Namaste!** I am SafarMitra, your certified local AI travel companion for **${destinationName}**. I can answer questions about local homestays, storyteller drivers, authentic regional food, and safe transit corridors. Ask me anything in English, Hindi, Malayalam, or other regional languages!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [gemView, setGemView] = useState<'gems' | 'eats'>('gems');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\*\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          destinationKey,
          currentPlan: currentTripState,
          language: selectedLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI assistant service');
      }

      const data = await response.json();
      const aiReply = data.reply || `For ${destinationName}, I recommend booking your local storyteller chauffeur and staying in certified homestays!`;

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(aiReply);
    } catch (err) {
      const errorMsg: Message = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: `**SafarMitra Advisory:** Main safety corridors around ${destinationName} and heritage hubs are active with verified local storyteller chauffeurs. You can also contact Tourist Police Helpline at 112.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const simulateSpeech = () => {
    const prompt = `What are the safest and most authentic experiences in ${destinationName}?`;
    sendMessage(prompt);
  };

  return (
    <div id="content-ai-guide" className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-subtle-card flex flex-col h-[620px] overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 bg-[#faf8f5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Sparkles className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-950 text-sm">SafarMitra AI — Destination Companion</h4>
                <p className="text-[11px] text-slate-500">Context synced with {destinationName} & your route</p>
              </div>
            </div>
            
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-semibold text-slate-800 flex items-center gap-1.5 shadow-xs transition"
            >
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-orange-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{voiceEnabled ? "Voice: ON" : "Voice: OFF"}</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                    <Bot className="w-4 h-4 text-orange-400" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-[#faf8f5] border border-slate-200 text-slate-900 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">
                    {m.text.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </p>
                  <span className={`text-[9px] block mt-1 text-right ${m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                <span>SafarMitra is analyzing local destination knowledge...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-slate-500 font-semibold shrink-0">Prompts:</span>
            <button
              onClick={() => handleQuickPrompt("What are curated hidden gems here not crowded by tourists?")}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-800 shrink-0 shadow-xs"
            >
              Hidden Gems
            </button>
            <button
              onClick={() => handleQuickPrompt("Is this area safe for solo women travelers at night?")}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-800 shrink-0 shadow-xs"
            >
              Solo Safety
            </button>
            <button
              onClick={() => handleQuickPrompt("Best authentic regional breakfast and dinner specialties?")}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-800 shrink-0 shadow-xs"
            >
              Authentic Food
            </button>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputValue);
            }}
            className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <input
              id="safarmitra-chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask SafarMitra anything about ${destinationName}, safety, or food...`}
              className="flex-1 text-xs px-4 py-2.5 bg-[#faf8f5] rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              type="button"
              onClick={simulateSpeech}
              title="Voice Input (Simulated Speech)"
              className="p-2.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </form>

        </div>

        {/* Curated Local Directory */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle-card space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold uppercase tracking-wider text-slate-950 text-[11px]">
                Curated Local Insights
              </h4>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{destinationName}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl font-semibold text-center">
              <button
                onClick={() => setGemView('gems')}
                className={`py-1.5 rounded-lg transition text-xs ${gemView === 'gems' ? 'bg-white text-slate-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Hidden Gems
              </button>
              <button
                onClick={() => setGemView('eats')}
                className={`py-1.5 rounded-lg transition text-xs ${gemView === 'eats' ? 'bg-white text-slate-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Iconic Eats
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {(gemView === 'gems' ? gems : eats).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#faf8f5] border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-950">{item.title}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded font-semibold border border-slate-200 text-orange-800">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
