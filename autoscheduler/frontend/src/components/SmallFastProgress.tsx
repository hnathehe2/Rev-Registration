import * as React from 'react';
import { CircularProgress } from '@material-ui/core';

interface SmallFastProgressProps {
  size?: 'small' | 'medium';
}

const sizesInPixels = {
  small: 18,
  medium: 24,
};

const SmallFastProgress: React.FC<SmallFastProgressProps> = ({ size = 'medium' }) => {
  const sizeInPixels = sizesInPixels[size];
  return <CircularProgress size={sizeInPixels} style={{ animationDuration: '550ms' }} disableShrink />;
};

export default SmallFastProgress;
