import {
  clamp,
  convertCartesianToPolar,
  convertPolarToCartesian,
} from '../helpers';

export function setupGooglyEyes() {

  console.log("GooglyEyes has entered the chat");

  const eyes = document.querySelectorAll('.eye');
  const pupils = document.querySelectorAll('.pupil');

  window.addEventListener('pointermove', (event) => {
    if (checkPrefersReducedMotion()) {
      return;
    }

    eyes.forEach((eye, index) => {
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

      pupils[index].style.transform = `translate(${x}px, ${y}px)`;
    })


  });

  function checkPrefersReducedMotion() {
    return !window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    ).matches;
  }
    
}