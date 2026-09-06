import React, { useState } from 'react';
import { UserProfile, ProgressMap } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { playTick, playChime } from '../utils/audio';
import {
  User,
  Shield,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Calendar,
  Briefcase,
  Target,
  Award,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Save,
  AlertTriangle,
  Github,
  Linkedin,
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  stats: {
    totalItems: number;
    doneItems: number;
    progressPct: number;
    bucketTotals: Record<string, number>;
    bucketDone: Record<string, number>;
  };
  progress: ProgressMap;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onExportDossier: () => void;
  onConfirmReset: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  stats,
  progress,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onExportBackup,
  onImportBackup,
  onExportDossier,
  onConfirmReset,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [pinInput, setPinInput] = useState(profile.pinHash || '');
  const [pinError, setPinError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute Days remaining to target date
  const daysRemaining = React.useMemo(() => {
    if (!profile.targetDate) return null;
    const target = new Date(profile.targetDate).getTime();
    const now = Date.now();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  }, [profile.targetDate]);

  // Weakness analyzer: find blocked or redo items
  const flaggedItems = React.useMemo(() => {
    const list: { key: string; status: 'redo' | 'blocked'; note: string }[] = [];
    Object.entries(progress).forEach(([key, val]) => {
      const item = val as { blocked?: boolean; redo?: boolean; note?: string };
      if (item.blocked) {
        list.push({ key, status: 'blocked', note: item.note || '' });
      } else if (item.redo) {
        list.push({ key, status: 'redo', note: item.note || '' });
      }
    });
    return list;
  }, [progress]);


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.isPinLocked && pinInput.length !== 4) {
      setPinError('PIN must be exactly 4 digits');
      return;
    }

    const updated: UserProfile = {
      ...formData,
      pinHash: formData.isPinLocked ? pinInput : '',
    };

    onUpdateProfile(updated);
    setIsEditing(false);
    setPinError('');
    setSaveSuccess(true);
    triggerHaptic('success');
    if (soundEnabled) playChime();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Profile Card */}
      <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#2954A6] text-[#FAF8F3] flex items-center justify-center font-serif text-2xl font-bold shadow-md">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'FD'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#1C1B19]">
                  {profile.name || 'Candidate Engineer'}
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E1E8D9] text-[#71875F]">
                  {profile.currentLevel || 'FDE Candidate'}
                </span>
              </div>
              <p className="font-mono text-xs text-[#55524A] mt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#2954A6]" />
                  {profile.targetRole || 'Forward Deployed Engineer'}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#1C1B19]">
                  <Target className="w-3.5 h-3.5 text-[#B8863A]" />
                  {profile.targetCompany || 'Palantir / Scale / Databricks'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              if (soundEnabled) playTick();
              setIsEditing(!isEditing);
              setFormData(profile);
              setPinInput(profile.pinHash || '');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8F3] hover:bg-white text-xs font-mono border border-[#E3DED0] text-[#1C1B19] shadow-sm active:scale-95 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancel Editing' : 'Edit Profile & Goals'}
          </button>
        </div>

        {profile.bio && (
          <p className="text-sm text-[#55524A] mt-5 pt-4 border-t border-[#E3DED0] leading-relaxed">
            "{profile.bio}"
          </p>
        )}

        {/* Social Links */}
        {(profile.githubUrl || profile.linkedinUrl) && (
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#E3DED0]/60">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-[#55524A] hover:text-[#1C1B19]"
              >
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-[#2954A6] hover:underline"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
          </div>
        )}

        {/* Target Countdown Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-[#FAF8F3] border border-[#E3DED0] rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-[#948E7E] uppercase block">
              Interview Target
            </span>
            <div className="font-serif text-xl font-bold text-[#1C1B19] mt-1">
              {daysRemaining !== null ? (
                daysRemaining >= 0 ? (
                  `${daysRemaining} Days`
                ) : (
                  <span className="text-[#B5453E]">Target Passed</span>
                )
              ) : (
                'Set Date'
              )}
            </div>
            <span className="text-[11px] text-[#55524A] font-mono">
              {profile.targetDate || 'No date set'}
            </span>
          </div>

          <div className="bg-[#FAF8F3] border border-[#E3DED0] rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-[#948E7E] uppercase block">
              Syllabus Completion
            </span>
            <div className="font-serif text-xl font-bold text-[#2954A6] mt-1">
              {stats.progressPct}%
            </div>
            <span className="text-[11px] text-[#55524A] font-mono">
              {stats.doneItems} / {stats.totalItems} milestones
            </span>
          </div>

          <div className="bg-[#FAF8F3] border border-[#E3DED0] rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-[#948E7E] uppercase block">
              Weekly Target
            </span>
            <div className="font-serif text-xl font-bold text-[#71875F] mt-1">
              {profile.targetWeeklyHours || 15} hrs
            </div>
            <span className="text-[11px] text-[#55524A] font-mono">Pacing goal</span>
          </div>

          <div className="bg-[#FAF8F3] border border-[#E3DED0] rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-[#948E7E] uppercase block">
              Security Lock
            </span>
            <div className="font-serif text-xl font-bold text-[#1C1B19] mt-1 flex items-center gap-1.5">
              <Shield
                className={`w-4 h-4 ${
                  profile.isPinLocked ? 'text-[#71875F]' : 'text-[#948E7E]'
                }`}
              />
              {profile.isPinLocked ? 'PIN Active' : 'Unlocked'}
            </div>
            <span className="text-[11px] text-[#55524A] font-mono">App Protection</span>
          </div>
        </div>
      </div>

      {/* Editing Form Modal / Collapsible */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-white border-2 border-[#2954A6]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E3DED0]">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C1B19]">
                Edit Candidate Information & Security
              </h3>
              <p className="text-xs text-[#55524A] font-mono">
                Stored locally on your device for interview preparation
              </p>
            </div>
            {saveSuccess && (
              <span className="flex items-center gap-1 text-xs font-mono text-[#71875F] bg-[#E1E8D9] px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#55524A] mb-1">
                FULL NAME
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rishabh Verma"
                className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#55524A] mb-1">
                TARGET COMPANY
              </label>
              <input
                type="text"
                value={formData.targetCompany}
                onChange={(e) =>
                  setFormData({ ...formData, targetCompany: e.target.value })
                }
                placeholder="Palantir / Scale AI / Databricks"
                className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#55524A] mb-1">
                TARGET ROLE
              </label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) =>
                  setFormData({ ...formData, targetRole: e.target.value })
                }
                placeholder="Forward Deployed Engineer"
                className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#55524A] mb-1">
                TARGET READINESS DATE
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  setFormData({ ...formData, targetDate: e.target.value })
                }
                className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#55524A] mb-1">
                WEEKLY STUDY TARGET (HOURS)
              </label>
              <input
                type="number"
                min="1"
                max="80"
                value={formData.targetWeeklyHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetWeeklyHours: parseInt(e.target.value) || 15,
                  })
                }
                className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#55524A] mb-1">
                ENGINEERING SENIORITY
              </label>
              <select
                value={formData.currentLevel}
                onChange={(e) =>
                  setFormData({ ...formData, currentLevel: e.target.value })
                }
                className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
              >
                <option value="Junior / Student">Junior / Student</option>
                <option value="Mid-Level SWE">Mid-Level SWE (2-4 yrs)</option>
                <option value="Senior SWE">Senior SWE (5+ yrs)</option>
                <option value="Staff / Architect">Staff / Solutions Architect</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#55524A] mb-1">
              STUDY MOTTO / CANDIDATE STATEMENT
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Deploying high-velocity systems at the intersection of enterprise data, clients, and applied AI."
              className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#55524A] mb-1">
                GITHUB PROFILE URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                placeholder="https://github.com/vermarishav"
                className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#55524A] mb-1">
                LINKEDIN PROFILE URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
              />
            </div>
          </div>

          {/* PIN Lock Settings */}
          <div className="bg-[#FAF8F3] border border-[#E3DED0] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2954A6]" />
                <div>
                  <h4 className="text-sm font-semibold text-[#1C1B19]">
                    Security PIN Lock
                  </h4>
                  <p className="text-xs text-[#55524A]">
                    Require a 4-digit PIN whenever this application is opened
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPinLocked}
                  onChange={(e) =>
                    setFormData({ ...formData, isPinLocked: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E3DED0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E3DED0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2954A6]" />
              </label>
            </div>

            {formData.isPinLocked && (
              <div className="pt-3 border-t border-[#E3DED0] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#55524A] mb-1">
                    4-DIGIT PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full bg-white border border-[#E3DED0] rounded-xl px-3.5 py-2.5 text-lg font-mono tracking-widest text-[#1C1B19] text-center focus:outline-none focus:border-[#2954A6]"
                  />
                  {pinError && (
                    <p className="text-[11px] text-[#B5453E] mt-1 font-mono">
                      {pinError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#55524A] mb-1">
                    SECURITY QUESTION (FOR RESET)
                  </label>
                  <input
                    type="text"
                    value={formData.securityQuestion}
                    onChange={(e) =>
                      setFormData({ ...formData, securityQuestion: e.target.value })
                    }
                    placeholder="First school name, city, or favorite tech?"
                    className="w-full bg-white border border-[#E3DED0] rounded-xl px-3.5 py-2 text-xs text-[#1C1B19] focus:outline-none focus:border-[#2954A6] mb-2"
                  />
                  <input
                    type="text"
                    value={formData.securityAnswer}
                    onChange={(e) =>
                      setFormData({ ...formData, securityAnswer: e.target.value })
                    }
                    placeholder="Answer..."
                    className="w-full bg-white border border-[#E3DED0] rounded-xl px-3.5 py-2 text-xs text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl border border-[#E3DED0] text-xs font-mono text-[#55524A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2954A6] text-white text-xs font-mono font-medium shadow-md hover:bg-[#1E4085] flex items-center gap-2 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </form>
      )}

      {/* App Preferences & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Night Mode Card */}
        <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF8F3] border border-[#E3DED0] flex items-center justify-center">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-[#E2AC54]" />
              ) : (
                <Sun className="w-5 h-5 text-[#B8863A]" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1C1B19]">Night Mode</h4>
              <p className="text-xs text-[#55524A]">
                {theme === 'dark' ? 'OLED Dark Active' : 'Warm Paper Active'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              if (soundEnabled) playTick();
              onToggleTheme();
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono bg-[#FAF8F3] border border-[#E3DED0] hover:bg-white text-[#1C1B19] active:scale-95 transition-all shadow-sm"
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* Sound & Haptics Card */}
        <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF8F3] border border-[#E3DED0] flex items-center justify-center">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#71875F]" />
              ) : (
                <VolumeX className="w-5 h-5 text-[#948E7E]" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1C1B19]">
                Audio & Haptics
              </h4>
              <p className="text-xs text-[#55524A]">
                {soundEnabled ? 'Synthesizer & Clicks On' : 'Muted'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleSound();
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono bg-[#FAF8F3] border border-[#E3DED0] hover:bg-white text-[#1C1B19] active:scale-95 transition-all shadow-sm"
          >
            {soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          </button>
        </div>
      </div>

      {/* Weakness Radar / Friction Watchlist */}
      {flaggedItems.length > 0 && (
        <div className="bg-[#F1E4CB]/50 border border-[#B8863A]/30 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3 text-[#B8863A]">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-serif text-base font-bold text-[#1C1B19]">
              Active Friction & Weakness Watchlist ({flaggedItems.length})
            </h3>
          </div>
          <p className="text-xs text-[#55524A] mb-4">
            Items you have flagged as Blocked or needing Redo. Revisit these before your mock interviews.
          </p>
          <div className="space-y-2">
            {flaggedItems.map((it) => (
              <div
                key={it.key}
                className="bg-[#FAF8F3] border border-[#E3DED0] rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold ${
                      it.status === 'blocked'
                        ? 'bg-[#FBE8E7] text-[#B5453E]'
                        : 'bg-[#F1E4CB] text-[#B8863A]'
                    }`}
                  >
                    {it.status}
                  </span>
                  <span className="font-mono text-[#55524A]">{it.key}</span>
                </div>
                {it.note && (
                  <span className="text-[#948E7E] italic truncate max-w-xs">
                    "{it.note}"
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Management & Export Section */}
      <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1C1B19]">
          Study Dossier & Data Management
        </h3>
        <p className="text-xs text-[#55524A]">
          Backup your entire study syllabus, notes, and records, or export a printable portfolio dossier.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => {
              triggerHaptic('medium');
              if (soundEnabled) playTick();
              onExportDossier();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2954A6] text-white text-xs font-mono font-medium shadow-sm hover:bg-[#1E4085] active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export Candidate Dossier (PDF/Print)
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              if (soundEnabled) playTick();
              onExportBackup();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E3DED0] text-[#1C1B19] text-xs font-mono hover:bg-white active:scale-95 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Download JSON Backup
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E3DED0] text-[#1C1B19] text-xs font-mono hover:bg-white active:scale-95 transition-all shadow-sm cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Restore Backup
            <input
              type="file"
              accept=".json"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              triggerHaptic('error');
              onConfirmReset();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBE8E7] border border-[#B5453E]/20 text-[#B5453E] text-xs font-mono hover:bg-[#B5453E] hover:text-white active:scale-95 transition-all ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
};
