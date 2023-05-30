particlesJS("bg-gd", {
  particles: {
    number: {
      value: 120,
      density: { enable: true, value_area: 710.2328774690454 },
    },
    color: { value: "#a61de6" },
    shape: {
      type: "circle",
      stroke: { width: 0.5, color: "#f2f2f2" },
      polygon: { nb_sides: 4 },
      image: { src: "img/github.svg", width: 100, height: 100 },
    },
    opacity: {
      value: 1,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 2.436093156202295,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 80.17060304327615,
      color: "#999999",
      opacity: 0.09620472365193136,
      width: 2,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "top",
      random: true,
      straight: false,
      out_mode: "bounce",
      bounce: false,
      attract: { enable: true, rotateX: 4730.065579553293, rotateY: 1200 },
    },
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: {
        distance: 304.51164452528684,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
});
var count_particles, stats, update;
stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);
count_particles = document.querySelector(".js-count-particles");
update = function () {
  stats.begin();
  stats.end();
  if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
    count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
  }
  requestAnimationFrame(update);
};
requestAnimationFrame(update);
