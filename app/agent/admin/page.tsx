
'use client';

import React, { useState } from 'react';
import { PhoneCall, Loader2, Signal, Mic } from 'lucide-react';

export default function AdminDialerPage() {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleCall = async () => {
    if (!phoneNumber || phoneNumber.length < 13) { 
      setStatus('Please enter a valid 10-digit number.');
      return;
    }

    setLoading(true);
    setStatus('Initiating secure telecom connection...');

    try {
      const res = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerNumber: phoneNumber }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`Success! Ringing ${phoneNumber}... Pick up the phone! 📱`);
      } else {
        setStatus(`Error: ${data.error || 'Failed to initiate call.'}`);
      }
    } catch (err) {
      setStatus('Network error occurred. Please check your connection.');
    }
    setLoading(false);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setStatus('Error: Voice input is not supported. Please use Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; 
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Listening... Say the 10 digit number out loud! 🎙️');
      setPhoneNumber('+91'); // Reset input
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const extractedDigits = transcript.replace(/\D/g, '');

      if (extractedDigits.length > 0) {
        const finalNumber = '+91' + extractedDigits.slice(0, 10);
        setPhoneNumber(finalNumber);
        setStatus('Number captured! Click the button below to call.');
      } else {
        setStatus("Didn't catch any numbers. Please try again.");
      }
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setStatus('Error hearing voice. Try speaking louder.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        <div className="bg-emerald-600 p-8 text-center relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full shadow-inner backdrop-blur-md">
              <PhoneCall className="w-10 h-10 text-white drop-shadow-md" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white relative tracking-tight">Krishi Command</h2>
          <p className="text-emerald-100 mt-2 text-sm relative font-medium uppercase tracking-widest">
            Voice-Activated Network
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider text-center">
              Target Mobile Number
            </label>
            
            <div className="relative flex items-center">
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                maxLength={13}
                className={`w-full pl-6 pr-16 py-5 text-2xl tracking-widest font-mono text-center text-slate-800 bg-slate-50 border-2 rounded-2xl outline-none shadow-inner transition-all ${
                  isListening ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/20'
                }`}
              />
              
              <button 
                onClick={startListening}
                disabled={loading || isListening}
                className={`absolute right-3 p-3 rounded-xl transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                }`}
                title="Dictate Number"
              >
                {isListening ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <button 
            onClick={handleCall} 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 hover:bg-emerald-600 active:bg-emerald-700 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
               <><Loader2 className="w-6 h-6 animate-spin" /> Dialing Network...</>
            ) : (
               <><Signal className="w-6 h-6" /> Initiate AI Agent Call</>
            )}
          </button>

          {status && (
            <div className={`p-4 rounded-xl text-sm font-semibold text-center animate-in fade-in slide-in-from-bottom-2 duration-300 border-l-4 shadow-sm ${
              status.includes('Error') || status.includes('valid')
                ? 'bg-red-50 text-red-700 border-red-500' 
                : status.includes('Listening') 
                ? 'bg-amber-50 text-amber-700 border-amber-500'
                : 'bg-emerald-50 text-emerald-700 border-emerald-500'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}