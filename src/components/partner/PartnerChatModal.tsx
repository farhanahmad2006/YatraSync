// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { X, Send, Shield, Sparkles, CheckCheck } from 'lucide-react';
import { PartnerChatMessage } from '../../types';

interface PartnerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
  travelerName: string;
  driverName: string;
  messages: PartnerChatMessage[];
  onSendMessage: (text: string) => void;
  currentUserRole?: 'driver' | 'storyteller' | 'traveler' | 'support';
}

export const PartnerChatModal: React.FC<PartnerChatModalProps> = ({
  isOpen,
  onClose,
  assignmentId,
  travelerName,
  driverName,
  messages,
  onSendMessage,
  currentUserRole = 'driver'
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickReplies = [
    "I am waiting at Pillar 14 outside Gate B with YatraSync sign.",
    "AC is turned on and water bottles are ready.",
    "Baggage loaded safely; departing now.",
    "Traffic is smooth; ETA ~15 minutes."
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-left">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 h-[85vh] max-h-[700px]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#faf8f5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-200">
                Trip #{assignmentId}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>Masked & Verified</span>
              </div>
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-950 mt-1">
              {currentUserRole === 'driver' || currentUserRole === 'storyteller' ? travelerName : driverName}
            </h3>
            <p className="text-[11px] text-slate-500">
              Direct secure line • No personal phone numbers exposed
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.map((msg) => {
            const isMe = (currentUserRole === 'driver' && msg.senderRole === 'driver') ||
                         (currentUserRole === 'storyteller' && msg.senderRole === 'storyteller') ||
                         (currentUserRole === 'traveler' && msg.senderRole === 'traveler');
            const isSystem = msg.senderRole === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-1.5 rounded-xl max-w-sm text-center shadow-xs">
                    <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-700">YatraSync Dispatch</span>
                    {msg.text}
                    <span className="block text-[9px] text-amber-600/80 mt-0.5">{msg.timestamp}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] font-semibold text-slate-500 mb-0.5 px-1">
                  {msg.senderName}
                </span>
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Operational Reply Chips */}
        <div className="p-2.5 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(reply)}
              className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-medium transition active:scale-95 shrink-0"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-[#faf8f5] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to traveler or operations..."
            className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-slate-900 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl transition cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
