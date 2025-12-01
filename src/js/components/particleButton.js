import { range, randomNumber, normalize } from '../helpers.js';

export function setupParticleButton() {
  
  const particleButton = document.querySelector('.particle-button');

  const MIN_DISTANCE = 32;
  const MAX_DISTANCE = 64;
  const FADE_DURATION = 1000;
  const FADE_VARIANCE = 500;
  const MIN_FADE_DURATION = FADE_DURATION - FADE_VARIANCE;
  const MAX_FADE_DURATION = FADE_DURATION + FADE_VARIANCE;
  const MAX_FADE_DELAY = 500;
  const MAX_FADE_ADJUST = 200;
  const NUM_OF_PARTICLES = 16;
  const JITTER = 40;
  const PARTICLE_DELAY = 150;

  particleButton.style.setProperty(
    '--pop-circle-duration',
    PARTICLE_DELAY + 'ms'
  );

  particleButton.addEventListener('click', () => {
    particleButton.classList.toggle('liked');

    const isLiked = particleButton.classList.contains('liked');

    if (!isLiked) {
      return
    }

    const isMotionEnabled = window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    ).matches;
    if (!isMotionEnabled) {
      return;
    }

    // Collect all particles for clean up
    const particles = [];

    range(NUM_OF_PARTICLES).forEach((index) => {
      const particle = document.createElement('span');
      particle.classList.add('particle');

      // Apply the start color as an inline style:
      particle.style.backgroundColor =
        `hsl(${randomNumber(0, 359)}deg 90% 85%)`;

      // Apply the destination hue with a CSS variable.
      // Right now, this is a flat value, but maybe it
      // should be dynamic / randomized?
      particle.style.setProperty(
        '--hue-rotation',
        '720deg'
      );

      let angle = normalize(index, 0, NUM_OF_PARTICLES, 0, 360);
      angle += randomNumber(-JITTER, JITTER);
      const distance = randomNumber(MIN_DISTANCE, MAX_DISTANCE);

      particle.style.setProperty('--angle', angle + 'deg');
      
      particle.style.setProperty('--distance', distance + 'px');
      
      particle.style.setProperty(
        '--fade-duration',
        normalize(
          distance,
          MIN_DISTANCE,
          MAX_DISTANCE,
          MIN_FADE_DURATION,
          MAX_FADE_DURATION
        ) +
          randomNumber(-200, 200) + 'ms'
      );
      
      particle.style.setProperty(
        '--fade-delay',
        normalize(distance, MIN_DISTANCE, MAX_DISTANCE, 0, MAX_FADE_DELAY) + randomNumber(0, MAX_FADE_ADJUST) + 'ms'
      );
      
      particle.style.setProperty(
      '--pop-duration',
        normalize(distance, MIN_DISTANCE, MAX_DISTANCE, 400, 800) + randomNumber(-200, 200) + 'ms'
      );
      
      particle.style.setProperty(
        '--size',
        randomNumber(9, 15) + 'px'
      );

      particle.style.setProperty(
        '--twinkle-duration',
        randomNumber(150, 300) + 'ms'
      );
      
      particle.style.setProperty(
        '--twinkle-amount',
        randomNumber(0.325, 1, true)
      );

      // particleButton.appendChild(particle);
      particles.push(particle);
    })
 
    // Wait a short while before adding those particles
    // to the button, using our new PARTICLE_DELAY constant:
    window.setTimeout(() => {
      particles.forEach((particle) => {
        particleButton.appendChild(particle);
      });
    }, PARTICLE_DELAY);

    // Our cleanup timeout should wait for all of
    // the particles to be totally invisible. Extend
    // this time by the new PARTICLE_DELAY value.
    //
    // I pulled this expression into a variable since
    // it didn’t fit neatly on one line anymore:
    const cleanupDuration =
      MAX_FADE_DURATION +
      MAX_FADE_DELAY +
      MAX_FADE_ADJUST +
      PARTICLE_DELAY +
      200;

    window.setTimeout(
      () => {
        particles.forEach((particle) => {
          particle.remove();
        });
      },
      cleanupDuration
    );

  })

}
