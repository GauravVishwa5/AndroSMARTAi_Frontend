'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'nobg' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  subtitle?: string;
  className?: string;
  withBackground?: boolean;
  href?: string;
}

export function Logo({
  variant = 'nobg',
  size = 'md',
  showBadge = true,
  subtitle,
  className = '',
  withBackground = true, // Default to clean rounded white rectangle
  href,
}: LogoProps) {
  const isIcon = variant === 'icon';

  const sizeClasses = {
    sm: { img: 'h-5 max-h-5 w-auto', icon: 'w-5 h-5', box: 'h-8 px-2.5 py-1' },
    md: { img: 'h-6 max-h-6 w-auto', icon: 'w-6 h-6', box: 'h-9 px-3 py-1.5' },
    lg: { img: 'h-7 max-h-7 w-auto', icon: 'w-7 h-7', box: 'h-10 px-3.5 py-1.5' },
    xl: { img: 'h-8 max-h-8 w-auto', icon: 'w-8 h-8', box: 'h-12 px-4 py-2' },
  }[size];

  const logoSrc = isIcon
    ? '/favicon.png'
    : variant === 'full'
    ? '/logo-full.png'
    : '/logo.png';

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Clean Rounded-Corner White Rectangle Container */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-xl transition-all duration-200 overflow-hidden ${
          withBackground
            ? `${sizeClasses.box} bg-white border border-slate-200/90 shadow-sm hover:shadow-md`
            : 'h-8 flex items-center'
        }`}
      >
        {isIcon ? (
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center p-1">
            <Image
              src="/favicon.png"
              alt="PVS Icon"
              width={24}
              height={24}
              className={`${sizeClasses.icon} object-contain`}
              priority
            />
          </div>
        ) : (
          <Image
            src={logoSrc}
            alt="AndroSMARTAi Logo"
            width={140}
            height={28}
            className={`${sizeClasses.img} object-contain transition-transform duration-200 hover:scale-[1.02]`}
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        )}
      </div>

      {!isIcon && (showBadge || subtitle) && (
        <div className="hidden sm:flex flex-col justify-center shrink-0">
          {showBadge && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono whitespace-nowrap">
                PVS v1.0
              </span>
            </div>
          )}
          {subtitle && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap hidden md:inline-block">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
