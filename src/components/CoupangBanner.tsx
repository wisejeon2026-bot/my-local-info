'use client';
import React, { useEffect, useRef } from 'react';

export default function CoupangBanner() {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  const isEnabled = partnerId && partnerId !== "나중에_입력" && partnerId.trim() !== "";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEnabled && containerRef.current) {
      const scriptId = 'coupang-partners-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://ads-partners.coupang.com/g.js';
        script.async = true;
        document.body.appendChild(script);
      }

      const initializeWidget = () => {
        try {
          // @ts-ignore
          if (window.PartnersGrid) {
            // @ts-ignore
            new window.PartnersGrid({
              "id": partnerId,
              "width": "100%",
              "height": "140",
              "container": containerRef.current
            });
          }
        } catch (e) {
          console.error('Coupang Partners Grid initialization error:', e);
        }
      };

      script.onload = initializeWidget;
      
      // @ts-ignore
      if (window.PartnersGrid) {
        initializeWidget();
      }
    }
  }, [isEnabled, partnerId]);

  if (!isEnabled) return null;

  return (
    <div className="my-10 mx-auto text-center w-full max-w-4xl overflow-hidden bg-white/40 backdrop-blur-sm rounded-3xl p-4 border border-white/40 shadow-sm">
      <span className="text-xs text-gray-400 font-semibold mb-3 block tracking-wider">RECOMMENDED FOR YOU</span>
      <div ref={containerRef} className="w-full flex justify-center overflow-hidden rounded-2xl" />
      <span className="text-[10px] text-gray-400 mt-3.5 block leading-relaxed">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </span>
    </div>
  );
}
