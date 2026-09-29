import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeWidgetProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
}

export const QRCodeWidget: React.FC<QRCodeWidgetProps> = ({
  value,
  size = 72,
  bgColor = 'transparent',
  fgColor = '#FFFFFF',
  className = '',
  level = 'M',
}) => {
  if (!value) return null;

  return (
    <div className={`flex items-center justify-center p-1.5 rounded-lg bg-deep-ocean/80 backdrop-blur border border-white/20 shadow-md ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        className="w-full h-full"
      />
    </div>
  );
};

export default QRCodeWidget;
