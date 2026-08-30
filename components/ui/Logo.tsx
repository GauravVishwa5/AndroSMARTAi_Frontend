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
  href?: string;
}

export function Logo({
  variant = 'nobg',
  size = 'md',
  showBadge = true,
  subtitle,
  className = '',
  href,
}: LogoProps) {
  const dimensions = {
    sm: { height: 28, maxH: 'max-h-7' },
    md: { height: 36, maxH: 'max-h-9' },
    lg: { height: 44, maxH: 'max-h-11' },
    xl: { height: 56, maxH: 'max-h-14' },
  }[size];

  const logoSrc =
    variant === 'icon'
      ? '/favicon.png'
      : variant === 'full'
      ? '/logo-full.png'
      : '/logo.png';

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <Image
          src={logoSrc}
          alt="AndroSMARTAi Logo"
          width={180}
          height={dimensions.height}
          className={`w-auto ${dimensions.maxH} object-contain transition-transform duration-200`}
          priority
        />
      </div>

      {(showBadge || subtitle) && (
        <div className="flex flex-col justify-center">
          {showBadge && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono">
                PVS v1.0
              </span>
            </div>
          )}
          {subtitle && (
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
