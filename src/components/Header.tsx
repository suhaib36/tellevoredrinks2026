import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
    setIsNotificationsOpen 
  } = useApp();

  const getSubTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'HOME';
      case 'shop':
        return 'SHOP';
      case 'rewards':
        return 'REWARDS';
      case 'favorites':
        return 'FAVORITES';
      case 'profile':
        return 'PROFILE';
      default:
        return 'HOME';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md px-4 py-3 transition-all w-full">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo & Section exactly as in screenshot */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          {/* Official Tellervo Logo */}
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
            <img
              src="/tellervo-logo.png"
              alt="Tellervo Drinks Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-editorial text-[22px] leading-tight font-medium tracking-tight text-[#183324]">
              Tellervo
            </span>
            <span className="text-[11px] font-bold tracking-[0.16em] text-[#A67C37] uppercase -mt-0.5">
              {getSubTitle()}
            </span>
          </div>
        </div>

        {/* Action Controls: Bell with yellow dot & Avatar */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="View notifications"
            className="relative w-8 h-8 flex items-center justify-center text-[#1C3324] hover:text-[#2E4F39] transition-colors"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            <span className="absolute top-0.5 right-1 w-2.5 h-2.5 rounded-full bg-[#E5A953] ring-2 ring-[#FBF9F5]" />
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setActiveTab('profile')}
            aria-label="Open profile"
            className="w-8 h-8 rounded-full overflow-hidden shadow-xs hover:opacity-90 transition-opacity shrink-0"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
