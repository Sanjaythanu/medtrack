import { useState, useEffect } from 'react';

/**
 * Custom hook to perform a smooth count-up animation from 0 to a target value (number or formatted string like "$1,200" or "95%").
 * Duration ~800ms, ease-out cubic.
 */
export const useCountUp = (targetDisplayValue, duration = 800) => {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (targetDisplayValue === undefined || targetDisplayValue === null) {
      setDisplayValue('0');
      return;
    }

    const strVal = String(targetDisplayValue);
    // Extract numeric part
    const match = strVal.match(/[\d,.]+/);
    if (!match) {
      setDisplayValue(strVal);
      return;
    }

    const rawNumStr = match[0].replace(/,/g, '');
    const targetNum = parseFloat(rawNumStr);
    if (isNaN(targetNum) || targetNum === 0) {
      setDisplayValue(strVal);
      return;
    }

    const isCurrency = strVal.includes('$');
    const isPercentage = strVal.includes('%');
    const suffix = isPercentage ? '%' : (strVal.includes(' Assets') ? ' Assets' : '');
    const prefix = isCurrency ? '$' : '';
    const hasDecimal = rawNumStr.includes('.');

    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic: 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = targetNum * easeProgress;

      let formattedCurrent;
      if (hasDecimal) {
        formattedCurrent = currentNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        formattedCurrent = Math.round(currentNum).toLocaleString('en-US');
      }

      setDisplayValue(`${prefix}${formattedCurrent}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(strVal);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetDisplayValue, duration]);

  return displayValue;
};

export default useCountUp;
