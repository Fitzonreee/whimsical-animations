export function setupRippleButton() {

  document.addEventListener('click', (event) => {
    const elem = event.target;

    if (!elem.getAttribute('data-ripple')) {
      return;
    }

    if (
      !window.matchMedia('(prefers-reduced-motion: no-preference').matches
    ) {
      return;
    }

    const bb = elem.getBoundingClientRect();

    const relativeX = event.clientX - bb.left;
    const relativeY = event.clientY - bb.top;

    const particle = document.createElement('span');
    particle.classList.add('ripple');

    particle.style.top = relativeY + 'px';
    particle.style.left = relativeX + 'px';

    elem.appendChild(particle);

    particle.addEventListener('animationend', (event) => {
      /*
        NOTE: Because we now apply two separate keyframes
        to this element (`grow` and `fadeToTransparent`),
        we need to be specific about *which* animation we’re
        listening for. Otherwise, the element would be removed
        before it’s finished fading away.

        This approach wouldn’t work when using tools that
        auto-generate keyframe names (eg. CSS Modules, styled-
        components). When using tools like that, I would use
        the timeout-based cleanup approach we saw in Part 1.
        https://courses.joshwcomeau.com/wham/01-particles/01.01-cleanup
      */
      if (event.animationName === 'fadeToTransparent') {
        particle.remove();
      }
    });
  });
  
}