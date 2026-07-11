gsap.registerPlugin(ScrollTrigger);

/* ---------- LOADER ---------- */
window.addEventListener('load', () => {
    const bar = document.getElementById('loaderBar');
    const pct = document.getElementById('loaderPct');
    let val = { p: 0 };
    gsap.to(val, {
        p: 100, duration: 1.6, ease: 'power2.inOut',
        onUpdate: () => { const v = Math.round(val.p); bar.style.width = v + '%'; pct.textContent = v + '%'; },
        onComplete: () => {
            gsap.timeline({ onComplete: initReveals })
                .to('#loader', { yPercent: -100, duration: 0.9, ease: 'power3.inOut', delay: 0.15 })
                .set('#loader', { display: 'none' });
        }
    });
});

/* ---------- CUSTOM CURSOR ---------- */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
});
gsap.ticker.add(() => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    gsap.set(ring, { x: rx, y: ry });
});
document.querySelectorAll('a, button, .skill-card, .service-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
});

/* ---------- NAV: scroll state + mobile toggle ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', () => navList.classList.toggle('open'));
navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navList.classList.remove('open')));

/* ---------- NAV: active section indicator ---------- */
const navLinks = document.querySelectorAll('#nav a[data-nav]');
const sections = [...navLinks].map(l => document.querySelector(l.getAttribute('href')));
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
        }
    });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
sections.forEach(s => s && io.observe(s));

/* ---------- DEPTH FIELD PARALLAX ---------- */
document.querySelectorAll('.depth-layer').forEach(layer => {
    const speed = parseFloat(layer.dataset.speed);
    gsap.to(layer, {
        yPercent: 30 * speed * 10,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 }
    });
});

/* ---------- HERO PHOTO 3D TILT ---------- */
const heroVisual = document.querySelector('.hero-visual');
const photoFrame = document.getElementById('photoFrame');
if (heroVisual) {
    heroVisual.addEventListener('mousemove', e => {
        const r = heroVisual.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(photoFrame, { rotateY: px * 14 - 4, rotateX: -py * 10 + 2, duration: 0.6, ease: 'power2.out' });
    });
    heroVisual.addEventListener('mouseleave', () => {
        gsap.to(photoFrame, { rotateY: -4, rotateX: 2, duration: 0.8, ease: 'power2.out' });
    });
}

/* ---------- REVEAL ANIMATIONS ---------- */
function initReveals() {
    // Hero elements animate immediately on load
    gsap.timeline({ delay: 0.1 })
        .to('#hero .reveal', { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' });

    // All other reveals trigger on scroll
    document.querySelectorAll('section:not(#hero) .reveal').forEach(el => {
        gsap.to(el, {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });

    // Skill / service / testimonial cards - slight stagger by container
    gsap.utils.toArray('.skills-grid, .services-grid, .test-grid, .projects-grid').forEach(grid => {
        gsap.from(grid.children, {
            opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: grid, start: 'top 85%' }
        });
    });

    ScrollTrigger.refresh();
}