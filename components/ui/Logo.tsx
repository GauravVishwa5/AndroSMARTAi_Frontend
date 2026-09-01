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
  withBackground = true,
  href,
}: LogoProps) {
  const dimensions = {
    sm: { width: 120, height: 24, padding: 'px-2.5 py-1', rounded: 'rounded-xl' },
    md: { width: 160, height: 30, padding: 'px-3 py-1.5', rounded: 'rounded-xl' },
    lg: { width: 200, height: 38, padding: 'px-3.5 py-2', rounded: 'rounded-2xl' },
    xl: { width: 250, height: 48, padding: 'px-4 py-2.5', rounded: 'rounded-2xl' },
  }[size];

  const logoSrc =
    variant === 'icon'
      ? '/favicon.png'
      : variant === 'full'
      ? '/logo-full.png'
      : '/logo.png';

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Rounded Corner Rectangle Background Container for Logo */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-all duration-200 ${
          withBackground
            ? `${dimensions.padding} ${dimensions.rounded} bg-white border border-slate-200 shadow-sm backdrop-blur-sm`
            : ''
        }`}
      >

        <Image
          src={logoSrc}
          alt="AndroSMARTAi Logo"
          width={dimensions.width}
          height={dimensions.height}
          className="w-auto h-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
          priority
        />
      </div>

      {(showBadge || subtitle) && (
        <div className="hidden sm:flex flex-col justify-center shrink-0">
          {showBadge && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono whitespace-nowrap">
                PVS v1.0
              </span>
            </div>
          )}
          {subtitle && (
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap hidden md:inline-block">
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
