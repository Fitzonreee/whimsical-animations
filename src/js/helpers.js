export function range(max) {
  return Array.from({ length: max }, (_, i) => i);
}

export function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export const convertDegreesToRadians = (angle) => (angle * Math.PI) / 180;

export const convertPolarToCartesian = (angle, distance) => {
  const angleInRadians = convertDegreesToRadians(angle);

  const x = Math.cos(angleInRadians) * distance;
  const y = Math.sin(angleInRadians) * distance;
  
  return [ x, y ];
}

export const clamp = (
  value,
  min = 0,
  max = 1
) => {
  if (min > max) {
    [min, max] = [max, min];
  }

  return Math.max(min, Math.min(max, value));
};

export const normalize = (
  value,
  currentScaleMin,
  currentScaleMax,
  newScaleMin = 0,
  newScaleMax = 1
) => {
  const standardNormalization = (value - currentScaleMin) / (currentScaleMax - currentScaleMin);
  
  return (
    (newScaleMax - newScaleMin) * standardNormalization + newScaleMin
  );
};

export const clampedNormalize = (
  value,
  currentScaleMin,
  currentScaleMax,
  newScaleMin = 0,
  newScaleMax = 1
) => {
  return clamp(
    normalize(
      value,
      currentScaleMin,
      currentScaleMax,
      newScaleMin,
      newScaleMax
    ),
    newScaleMin,
    newScaleMax
  );
};

// In addition to _linear_ interpolation,
// sometimes want to use _exponential_ interpolation, 
// where the input is mapped onto a curved line rather than a straight one. 

export const exponentialNormalize = (
  value,
  currentScaleMin,
  currentScaleMax,
  newScaleMin = 0,
  newScaleMax = 1,
  exponent = 2
) => {
  const normalizedInput =
    (value - currentScaleMin) / (currentScaleMax - currentScaleMin);

  const exponentialOutput = Math.pow(normalizedInput, exponent);

  return (
    newScaleMin + (newScaleMax - newScaleMin) * exponentialOutput
  );
};

