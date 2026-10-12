import {
  clamp,
  convertCartesianToPolar,
  convertPolarToCartesian,
} from '../helpers';

export function setupGooglyEyes() {

  console.log("GooglyEyes has entered the chat");

  const eye = document.querySelector('.eye');
  const pupil = document.querySelector('.pupil');

  window.addEventListener('pointermove', (event) => {
    if (checkPrefersReducedMotion()) {
      return;
    }

    const bb = eye.getBoundingClientRect();

    const centerX = bb.left + bb.width / 2;
    const centerY = bb.top + bb.height / 2;

    const relativeX = event.clientX - centerX;
    const relativeY = event.clientY - centerY;

    const [angle, distance] = convertCartesianToPolar(
      relativeX,
      relativeY
    );

    const modifiedDistance = clamp(distance * 0.1, -15, 15);

    const [x, y] = convertPolarToCartesian(
      angle,
      modifiedDistance
    );

    pupil.style.transform = `translate(${x}px, ${y}px)`;
  });

  function checkPrefersReducedMotion() {
    return !window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    ).matches;
  }
    
}