/* moodscale explained — scroll-driven reveals only.
   CSP-clean: no network, no inline handlers. All motion is CSS;
   this file just toggles an `in` class when an element scrolls into view,
   and honours prefers-reduced-motion by revealing everything up front. */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Elements that animate on entry: any .reveal, plus the hero band and the
  // scoring band whose keyframes are gated on the `in` class.
  function collect() {
    var sel = '.reveal, .hero-band, .bandsvg--score, .score-demo, .adder, .qdemo__opts, .trend-demo';
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  function revealAll(nodes) {
    nodes.forEach(function (n) { n.classList.add('in'); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var nodes = collect();

    // No IntersectionObserver, or reduced motion: show final states immediately.
    if (reduce || typeof IntersectionObserver === 'undefined') {
      revealAll(nodes);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    nodes.forEach(function (n) { io.observe(n); });

    // The hero sits at the top; kick it off on load so it plays without a scroll.
    var hero = document.querySelector('.hero-band');
    if (hero) { requestAnimationFrame(function () { hero.classList.add('in'); }); }
  });
})();
