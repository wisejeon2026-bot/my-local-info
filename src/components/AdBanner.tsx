'use client';
import React, { useEffect } from 'react';

export default function AdBanner() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isAdsenseEnabled = adsenseId && adsenseId !== "나중에_입력" && adsenseId.trim() !== "";

  useEffect(() => {
    if (isAdsenseEnabled) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('Google AdSense initialization error:', err);
      }
    }
  }, [isAdsenseEnabled]);

  if (!isAdsenseEnabled) return null;

  return (
    <div className="my-10 mx-auto text-center w-full max-w-4xl overflow-hidden bg-white/40 backdrop-blur-sm rounded-3xl p-4 border border-white/40 shadow-sm">
      <span className="text-xs text-gray-400 font-semibold mb-2 block tracking-wider">ADVERTISEMENT</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
