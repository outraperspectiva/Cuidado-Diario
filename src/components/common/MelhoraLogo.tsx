import React from 'react';
import { CuidadoDiarioLogo } from './CuidadoDiarioLogo';

interface MelhoraLogoProps {
  className?: string;
  size?: number | string;
  showBg?: boolean;
}

export const MelhoraLogo: React.FC<MelhoraLogoProps> = (props) => {
  return <CuidadoDiarioLogo {...props} />;
};

export default MelhoraLogo;
