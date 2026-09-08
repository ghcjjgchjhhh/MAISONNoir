import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(100, (elapsed / 2600) * 100));
      if (elapsed >= 2600) {
        window.clearInterval(timer);
        onComplete();
      }
    }, 40);
    return () => window.clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen" role="status" aria-label="Loading Maison Noir">
      <div className="splash-fabric" />
      <div className="splash-vignette" />
      <div className="splash-content">
        <div className="splash-monogram" aria-hidden="true"><span>M</span><span>N</span></div>
        <h1>MAISON NOIR</h1>
        <p className="splash-motto">FASHION LIVES LONGER</p>
        <div className="splash-loader" aria-hidden="true">
          <div className="splash-loader-progress" style={{ width: `${progress}%` }} />
        </div>
        <p className="splash-loading">LOADING...</p>
      </div>
      <div className="splash-footer">
        <p>CLOTHING MORE</p>
        <p>THAN A MOMENT</p>
        <span />
      </div>
    </div>
  );
};
