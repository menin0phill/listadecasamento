import React, { useState, useEffect } from 'react';

const Logo = ({ className }) => {
  const [logoSrc, setLogoSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/logo.jpg';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // The original aspect ratio
      const width = img.width;
      const height = img.height;

      // Scale to height of 120px for perfect crisp detail
      const targetHeight = 120;
      const scale = targetHeight / height;
      canvas.width = width * scale;
      canvas.height = targetHeight;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Remove background and make white
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate average brightness
        const v = (r + g + b) / 3;

        // The background in the image is textured grey/black (typically < 100).
        // The text is white/light-grey (typically > 150).
        const thresholdLow = 110;
        const thresholdHigh = 165;

        if (v < thresholdLow) {
          data[i + 3] = 0; // Transparent
        } else if (v > thresholdHigh) {
          // Make pure white
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        } else {
          // Smooth transparency interpolation for anti-aliasing
          const alpha = ((v - thresholdLow) / (thresholdHigh - thresholdLow)) * 255;
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = alpha;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setLogoSrc(canvas.toDataURL());
    };
    img.onerror = () => {
      // If it fails to load for any reason, fallback to text logo
      setLogoSrc('text_fallback');
    };
  }, []);

  if (!logoSrc || logoSrc === 'text_fallback') {
    return <span className="logo-monogram">GM</span>;
  }

  return (
    <img 
      src={logoSrc} 
      alt="GM" 
      className={className} 
      style={{ 
        height: '42px', 
        width: 'auto',
        objectFit: 'contain', 
        display: 'block' 
      }} 
    />
  );
};

export default Logo;
