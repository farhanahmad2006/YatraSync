// Changes made by @MdFarhanAhmad
import React from 'react';
import { X, CheckCheck, ShieldAlert, Bot } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
  onConfirmReplan: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  destinationName,
  onConfirmReplan
}) => {
  if (!isOpen) return null;

  return (
    <div id="whatsapp-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div id="whatsapp-modal-box" className="bg-[#eef2f5] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-300 text-left">
        
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              <Bot className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm">YatraSync Official Bot</span>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 text-[#075e54] text-[9px] flex items-center justify-center font-black">✓</span>
              </div>
              <span className="text-[11px] text-emerald-200 block">Autonomous Travel Operations • Online</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="p-4 space-y-3 text-xs bg-[#e5ddd5] min-h-[340px] flex flex-col justify-end">
          
          <div className="bg-white p-3 rounded-2xl rounded-tl-none max-w-[88%] shadow-xs space-y-1.5 text-slate-800">
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>TRANSIT DISRUPTION DETECTED</span>
            </div>
            <p className="leading-relaxed">
              <strong>Alert for your journey to {destinationName}:</strong> Inbound express service is delayed by 3 hours due to heavy fog / signal clearance.
            </p>
            <span className="text-[9px] text-slate-400 block text-right">10:42 AM</span>
          </div>

          <div className="bg-[#dcf8c6] p-3 rounded-2xl rounded-tl-none max-w-[88%] shadow-xs space-y-1.5 text-slate-800 self-start">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900">
              <span>AUTONOMOUS REPLAN EXECUTED (&lt;8s)</span>
            </div>
            <p className="leading-relaxed">
              1. Your verified homestay host has been briefed via WhatsApp Business. Late check-in window held at no extra penalty.
            </p>
            <p className="leading-relaxed">
              2. Your certified storyteller chauffeur's pickup schedule is synchronized with the new ETA.
            </p>
            <div className="flex items-center justify-between pt-1 text-[9px] text-slate-500">
              <span>Action: Verified Autonomous Sync</span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <span>Delivered</span>
                <CheckCheck className="w-3 h-3 text-blue-500" />
              </span>
            </div>
          </div>

        </div>

        {/* Modal Action Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500">WhatsApp live hook active</span>
          <button
            onClick={() => {
              onConfirmReplan();
              onClose();
            }}
            className="px-4 py-2 bg-[#075e54] hover:bg-[#128c7e] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <span>Acknowledge & Confirm</span>
          </button>
        </div>

      </div>
    </div>
  );
};



