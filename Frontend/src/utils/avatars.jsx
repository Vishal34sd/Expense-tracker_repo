import React from "react";

export const AVATARS = [
  {
    id: "avatar1",
    name: "Cyber Fox",
    bgColor: "from-orange-500 to-amber-600",
    ringColor: "ring-orange-500",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#FF6B4A" />
        {/* Ears */}
        <polygon points="20,15 35,45 15,45" fill="#E84824" />
        <polygon points="23,22 32,42 18,42" fill="#FFE5D9" />
        <polygon points="80,15 85,45 65,45" fill="#E84824" />
        <polygon points="77,22 82,42 68,42" fill="#FFE5D9" />
        {/* Face */}
        <ellipse cx="50" cy="58" rx="34" ry="28" fill="#FF8264" />
        {/* Cheeks white patches */}
        <path d="M22 62 Q35 78 50 68 Q65 78 78 62 Q72 82 50 82 Q28 82 22 62 Z" fill="#FFFFFF" />
        {/* Cool Visor Glasses */}
        <rect x="25" y="44" width="50" height="15" rx="7" fill="#00E5FF" />
        <line x1="30" y1="51" x2="70" y2="51" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 2" />
        {/* Nose */}
        <polygon points="46,65 54,65 50,71" fill="#1A1A2E" />
        {/* Smile */}
        <path d="M44 73 Q50 78 56 73" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "avatar2",
    name: "Gamer Panda",
    bgColor: "from-emerald-500 to-teal-700",
    ringColor: "ring-emerald-500",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#00B4D8" />
        {/* Ears */}
        <circle cx="24" cy="28" r="14" fill="#1F2937" />
        <circle cx="76" cy="28" r="14" fill="#1F2937" />
        {/* Head */}
        <ellipse cx="50" cy="56" rx="36" ry="32" fill="#FFFFFF" />
        {/* Eye patches */}
        <ellipse cx="36" cy="52" rx="10" ry="13" fill="#1F2937" transform="rotate(-15 36 52)" />
        <ellipse cx="64" cy="52" rx="10" ry="13" fill="#1F2937" transform="rotate(15 64 52)" />
        {/* Eyes */}
        <circle cx="37" cy="50" r="3.5" fill="#FFFFFF" />
        <circle cx="63" cy="50" r="3.5" fill="#FFFFFF" />
        {/* Nose */}
        <ellipse cx="50" cy="64" rx="6" ry="4" fill="#1F2937" />
        {/* Mouth */}
        <path d="M44 70 Q50 76 56 70" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Gaming Headset Band */}
        <path d="M16 48 Q50 12 84 48" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* Ear Cushions */}
        <rect x="12" y="42" width="10" height="20" rx="5" fill="#F59E0B" />
        <rect x="78" y="42" width="10" height="20" rx="5" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "avatar3",
    name: "Crypto Cat",
    bgColor: "from-purple-600 to-indigo-700",
    ringColor: "ring-purple-500",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#7C3AED" />
        {/* Cat ears */}
        <polygon points="18,18 42,42 16,48" fill="#A78BFA" />
        <polygon points="22,24 38,40 20,44" fill="#F472B6" />
        <polygon points="82,18 58,42 84,48" fill="#A78BFA" />
        <polygon points="78,24 62,40 80,44" fill="#F472B6" />
        {/* Head */}
        <circle cx="50" cy="58" r="32" fill="#C4B5FD" />
        {/* Gold Sunglasses */}
        <polygon points="25,48 48,48 43,62 30,62" fill="#111827" stroke="#FBBF24" strokeWidth="2.5" />
        <polygon points="52,48 75,48 70,62 57,62" fill="#111827" stroke="#FBBF24" strokeWidth="2.5" />
        <line x1="48" y1="52" x2="52" y2="52" stroke="#FBBF24" strokeWidth="2.5" />
        {/* Whiskers */}
        <line x1="16" y1="64" x2="30" y2="66" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="72" x2="30" y2="70" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="84" y1="64" x2="70" y2="66" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="84" y1="72" x2="70" y2="70" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        {/* Nose & Mouth */}
        <polygon points="48,68 52,68 50,71" fill="#EC4899" />
        <path d="M45 74 Q50 78 55 74" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "avatar4",
    name: "Rocket Shiba",
    bgColor: "from-amber-500 to-yellow-600",
    ringColor: "ring-amber-500",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#F59E0B" />
        {/* Ears */}
        <polygon points="22,18 40,42 16,38" fill="#D97706" />
        <polygon points="26,24 36,38 20,36" fill="#FEF3C7" />
        <polygon points="78,18 60,42 84,38" fill="#D97706" />
        <polygon points="74,24 64,38 80,36" fill="#FEF3C7" />
        {/* Head */}
        <ellipse cx="50" cy="56" rx="34" ry="30" fill="#FBBF24" />
        {/* White muzzle */}
        <ellipse cx="50" cy="65" rx="20" ry="16" fill="#FFFFFF" />
        {/* Cheeks eyebrows */}
        <ellipse cx="36" cy="42" rx="4" ry="3" fill="#FFFFFF" />
        <ellipse cx="64" cy="42" rx="4" ry="3" fill="#FFFFFF" />
        {/* Eyes */}
        <ellipse cx="38" cy="50" rx="4.5" ry="5.5" fill="#1F2937" />
        <circle cx="40" cy="48" r="1.5" fill="#FFFFFF" />
        <ellipse cx="62" cy="50" rx="4.5" ry="5.5" fill="#1F2937" />
        <circle cx="64" cy="48" r="1.5" fill="#FFFFFF" />
        {/* Nose */}
        <polygon points="46,60 54,60 50,65" fill="#1F2937" />
        {/* Smile */}
        <path d="M42 68 Q50 76 58 68" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Star Badge */}
        <polygon points="50,18 52,24 58,24 53,28 55,34 50,30 45,34 47,28 42,24 48,24" fill="#3B82F6" />
      </svg>
    ),
  },
  {
    id: "avatar5",
    name: "Smart Owl",
    bgColor: "from-blue-600 to-indigo-800",
    ringColor: "ring-blue-500",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#3B82F6" />
        {/* Feather Tufts */}
        <polygon points="22,20 34,40 18,36" fill="#1E40AF" />
        <polygon points="78,20 66,40 82,36" fill="#1E40AF" />
        {/* Head */}
        <ellipse cx="50" cy="56" rx="34" ry="30" fill="#60A5FA" />
        {/* Glasses big circles */}
        <circle cx="36" cy="52" r="13" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <circle cx="64" cy="52" r="13" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <line x1="49" y1="52" x2="51" y2="52" stroke="#1E293B" strokeWidth="3" />
        {/* Pupils */}
        <circle cx="38" cy="52" r="6" fill="#1E293B" />
        <circle cx="40" cy="50" r="2" fill="#FFFFFF" />
        <circle cx="62" cy="52" r="6" fill="#1E293B" />
        <circle cx="64" cy="50" r="2" fill="#FFFFFF" />
        {/* Beak */}
        <polygon points="46,64 54,64 50,74" fill="#F59E0B" />
        {/* Scholar Hat */}
        <polygon points="50,16 78,26 50,36 22,26" fill="#1E1B4B" />
        <rect x="36" y="32" width="28" height="8" rx="2" fill="#312E81" />
        <line x1="74" y1="28" x2="78" y2="44" stroke="#FBBF24" strokeWidth="2" />
        <circle cx="78" cy="44" r="2" fill="#FBBF24" />
      </svg>
    ),
  },
  {
    id: "avatar6",
    name: "Ninja Koala",
    bgColor: "from-rose-500 to-pink-600",
    ringColor: "ring-rose-500",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#F43F5E" />
        {/* Big fluffy ears */}
        <circle cx="20" cy="38" r="16" fill="#9CA3AF" />
        <circle cx="20" cy="38" r="10" fill="#E5E7EB" />
        <circle cx="80" cy="38" r="16" fill="#9CA3AF" />
        <circle cx="80" cy="38" r="10" fill="#E5E7EB" />
        {/* Head */}
        <ellipse cx="50" cy="56" rx="34" ry="28" fill="#D1D5DB" />
        {/* Ninja Headband */}
        <rect x="18" y="38" width="64" height="12" rx="3" fill="#111827" />
        <polygon points="50,40 54,44 50,48 46,44" fill="#F43F5E" />
        {/* Eyes */}
        <circle cx="36" cy="54" r="4" fill="#111827" />
        <circle cx="38" cy="52" r="1.5" fill="#FFFFFF" />
        <circle cx="64" cy="54" r="4" fill="#111827" />
        <circle cx="66" cy="52" r="1.5" fill="#FFFFFF" />
        {/* Big Koala Nose */}
        <ellipse cx="50" cy="64" rx="9" ry="12" fill="#1F2937" />
        {/* Smile */}
        <path d="M44 76 Q50 80 56 76" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
];

export const getAvatarById = (id) => {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
};

export const UserAvatar = ({ id = "avatar1", className = "w-10 h-10", size }) => {
  const avatar = getAvatarById(id);
  const customStyle = size ? { width: size, height: size } : undefined;

  return (
    <div
      style={customStyle}
      className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center shadow-sm select-none ${className}`}
    >
      {avatar.svg}
    </div>
  );
};
