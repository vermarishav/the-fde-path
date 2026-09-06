import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { playTick } from '../utils/audio';

interface PinLockModalProps {
  correctPin: string;
  securityQuestion?: string;
  securityAnswer?: string;
  onUnlock: () => void;
  onResetPin: () => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  correctPin,
  securityQuestion,
  securityAnswer,
  onUnlock,
  onResetPin,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  const handleKeyPress = (digit: string) => {
    if (enteredPin.length >= 4) return;
    triggerHaptic('light');
    playTick();
    setHasError(false);

    const nextPin = enteredPin + digit;
    setEnteredPin(nextPin);

    if (nextPin.length === 4) {
      if (nextPin === correctPin) {
        triggerHaptic('success');
        setTimeout(() => {
          onUnlock();
        }, 120);
      } else {
        triggerHaptic('error');
        setHasError(true);
        setTimeout(() => {
          setEnteredPin('');
        }, 500);
      }
    }
  };

  const handleDelete = () => {
    triggerHaptic('light');
    playTick();
    setHasError(false);
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityAnswer || answerInput.trim().toLowerCase() === securityAnswer.trim().toLowerCase()) {
      triggerHaptic('success');
      onResetPin();
      setIsForgotMode(false);
    } else {
      triggerHaptic('error');
      setRecoveryError('Incorrect answer. Please check your spelling.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121316]/95 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-3xl bg-[#1C2638] border border-[#2D384D] flex items-center justify-center mb-6 shadow-xl">
          <Lock className="w-8 h-8 text-[#5487E8]" />
        </div>

        {!isForgotMode ? (
          <>
            <h2 className="font-serif text-2xl font-bold text-[#EDEAE2] tracking-tight mb-2">
              The FDE Path
            </h2>
            <p className="font-mono text-xs text-[#A8A498] mb-8">
              ENTER 4-DIGIT SECURITY PIN TO UNLOCK
            </p>

            {/* PIN Dots */}
            <div
              className={`flex items-center justify-center gap-5 mb-10 transition-transform ${
                hasError ? 'animate-bounce text-[#D9625A]' : ''
              }`}
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = enteredPin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      hasError
                        ? 'bg-[#D9625A] scale-110 shadow-[0_0_12px_rgba(217,98,90,0.5)]'
                        : isFilled
                        ? 'bg-[#5487E8] scale-110 shadow-[0_0_12px_rgba(84,135,232,0.5)]'
                        : 'bg-[#2D313A] border border-[#3E434F]'
                    }`}
                  />
                );
              })}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  className="h-14 rounded-2xl bg-[#1B1D22] border border-[#2D313A] text-2xl font-mono text-[#EDEAE2] hover:bg-[#262930] active:scale-95 transition-all flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsForgotMode(true);
                }}
                className="h-14 rounded-2xl text-[11px] font-mono text-[#706C62] hover:text-[#A8A498] active:scale-95 transition-all flex items-center justify-center"
              >
                Forgot?
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                className="h-14 rounded-2xl bg-[#1B1D22] border border-[#2D313A] text-2xl font-mono text-[#EDEAE2] hover:bg-[#262930] active:scale-95 transition-all flex items-center justify-center"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="h-14 rounded-2xl bg-[#1B1D22] border border-[#2D313A] text-sm font-mono text-[#EDEAE2] hover:bg-[#262930] active:scale-95 transition-all flex items-center justify-center"
              >
                ⌫
              </button>
            </div>
          </>
        ) : (
          /* Forgot PIN / Recovery Mode */
          <div className="w-full bg-[#1B1D22] border border-[#2D313A] p-6 rounded-3xl text-left">
            <div className="flex items-center gap-2 text-[#E2AC54] mb-4">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold text-[#EDEAE2]">Reset Security PIN</h3>
            </div>

            {securityQuestion ? (
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <p className="text-xs text-[#A8A498]">
                  Security Question:
                  <span className="block text-sm font-medium text-[#EDEAE2] mt-1">
                    {securityQuestion}
                  </span>
                </p>
                <div>
                  <label className="block text-[11px] font-mono text-[#706C62] mb-1">
                    YOUR ANSWER
                  </label>
                  <input
                    type="text"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Enter answer..."
                    className="w-full bg-[#121316] border border-[#2D313A] rounded-xl px-3 py-2.5 text-sm text-[#EDEAE2] focus:outline-none focus:border-[#5487E8]"
                  />
                  {recoveryError && (
                    <p className="text-[11px] text-[#D9625A] mt-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> {recoveryError}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#2D313A] text-xs font-mono text-[#A8A498] hover:text-[#EDEAE2]"
                  >
                    Back to PIN
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#5487E8] text-xs font-mono font-medium text-white flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Reset PIN <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#A8A498]">
                  No security question was configured. You can reset the PIN lock to access your notes and study syllabus.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsForgotMode(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#2D313A] text-xs font-mono text-[#A8A498]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic('success');
                      onResetPin();
                      setIsForgotMode(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#D9625A] text-xs font-mono font-medium text-white shadow-md"
                  >
                    Remove Lock
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
