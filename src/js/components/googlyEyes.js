import { throttle } from 'lodash-es';
import { springValue } from 'motion';

import {
  clamp,
  convertCartesianToPolar,
  convertPolarToCartesian,
  getDistanceBetweenPoints
} from '../helpers';

export function setupGooglyEyes() {

  const MAX_DISTANCE = 280;

  const SPRING_CONFIG = {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  };

  // NEW: we also want to track the parent’s bounding box,
  // using the same throttled optimization:
  function createCreature() {
    const node = document.querySelector('.creature');

    return {
      node,
      getThrottledBoundingBox: throttle(() => {
        return document
          .querySelector('.creature')
          .getBoundingClientRect();
      }, 500),
    };
  }

  const creature = createCreature();

  const eyeNodes = [...document.querySelectorAll('.eye')];
  
  const eyes = eyeNodes.map((node) => {
    const pupil = node.querySelector('.pupil');

    const springX = springValue(0, SPRING_CONFIG);
    const springY = springValue(0, SPRING_CONFIG);

    springX.on('change', (x) => {
      pupil.style.transform = `translate(${x}px, ${springY.get()}px)`;
    });
    springY.on('change', (y) => {
      pupil.style.transform = `translate(${springX.get()}px, ${y}px)`;
    });

    return {
      node,
      springX,
      springY,
      getThrottledBoundingBox: throttle(() => {
        return node.getBoundingClientRect();
      }, 500),
    };
  });

  window.addEventListener('pointermove', (event) => {
    if (checkPrefersReducedMotion()) {
      return;
    }

    // Whenever the pointer moves, we’ll check how far the
    // cursor is from the center of the parent creature:
    const creatureBB = creature.getThrottledBoundingBox();
    const creatureCenter = {
      x: creatureBB.left + creatureBB.width / 2,
      y: creatureBB.top + creatureBB.height / 2,
    }
    const distanceToCreatureCenter = getDistanceBetweenPoints(
      { x: event.clientX, y: event.clientY },
      creatureCenter
    );
    
    eyes.forEach(({ node, getThrottledBoundingBox, springX, springY }) => {
      // Then, for each eye, we’ll start by checking if the
      // cursor is too far away. If so, they all shift back
      // to (0, 0).
      if (distanceToCreatureCenter > MAX_DISTANCE) {
        springX.set(0);
        springY.set(0);
        return;
      }
      
      // Otherwise, we’ll continue doing all the same calculations
      // we were before, so that each eye continues to operate
      // independently:
      const bb = getThrottledBoundingBox();
      const centerX = bb.left + bb.width / 2;
      const centerY = bb.top + bb.height / 2;

      const relativeX = event.clientX - centerX;
      const relativeY = event.clientY - centerY;

      const [angle, distance] = convertCartesianToPolar(
        relativeX,
        relativeY
      );
      const modifiedDistance = clamp(distance * 0.2, -10, 10);

      const [x, y] = convertPolarToCartesian(angle, modifiedDistance);

      springX.set(x);
      springY.set(y);
    });
  });


  function checkPrefersReducedMotion() {
    return !window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    ).matches;
  }
    
}