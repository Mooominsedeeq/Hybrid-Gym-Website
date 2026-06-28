/**
 * HYBRID FITNESS GYM - Premium Interactions
 * Author: Antigravity
 */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. LENIS SMOOTH SCROLL (Performance optimized)
// ==========================================================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// ==========================================================================
// 2. CUSTOM CURSOR
// ==========================================================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for the dot
        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    // Smooth follow for the ring
    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        gsap.set(cursorFollower, { x: cursorX, y: cursorY });
    });

    // Hover effects on interactive elements
    const interactives = document.querySelectorAll('a, button, .equip-card, .faq-question, .slider-btn');
    
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursorFollower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursorFollower.classList.remove('active');
        });
    });
}

// ==========================================================================
// 3. LOADING SCREEN
// ==========================================================================
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    // Animate progress bar
    tl.to('.loader-progress', {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: function() {
            const progress = Math.round(this.progress() * 100);
            document.querySelector('.loader-percentage').innerText = `${progress}%`;
        }
    })
    .to('.loader-text', {
        opacity: 1,
        y: -10,
        duration: 0.5
    }, "-=1")
    // Slide up loader
    .to('.loader', {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
        delay: 0.2
    })
    // Reveal Hero elements
    .from('.hero-bg img', {
        scale: 1.2,
        duration: 2,
        ease: 'power2.out'
    }, "-=0.8")
    .from('.hero-athlete', {
        opacity: 0,
        x: 50,
        duration: 1.5,
        ease: 'power2.out'
    }, "-=1.5")
    .from('.reveal-text span, .hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
    }, "-=1.2")
    .from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, "-=0.8");
});

// ==========================================================================
// 4. NAVBAR & MOBILE MENU
// ==========================================================================
const navbar = document.querySelector('.navbar');
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
let menuOpen = false;

// Sticky Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
mobileBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    const spans = mobileBtn.querySelectorAll('span');
    
    if (menuOpen) {
        // Animate Hamburger to X
        gsap.to(spans[0], { y: 9, rotation: 45, duration: 0.3 });
        gsap.to(spans[1], { opacity: 0, duration: 0.3 });
        gsap.to(spans[2], { y: -9, rotation: -45, duration: 0.3 });
        
        // Show Menu
        mobileMenu.classList.add('active');
        
        // Stagger links
        gsap.to(mobileLinks, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.2,
            ease: 'power2.out'
        });
        
        lenis.stop(); // Stop scroll
    } else {
        closeMenu();
    }
});

function closeMenu() {
    const spans = mobileBtn.querySelectorAll('span');
    
    gsap.to(spans[0], { y: 0, rotation: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.3 });
    gsap.to(spans[2], { y: 0, rotation: 0, duration: 0.3 });
    
    gsap.to(mobileLinks, {
        y: 20,
        opacity: 0,
        duration: 0.3
    });
    
    setTimeout(() => {
        mobileMenu.classList.remove('active');
    }, 300);
    
    lenis.start();
    menuOpen = false;
}

mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ==========================================================================
// 5. SCROLL ANIMATIONS (ScrollTrigger)
// ==========================================================================

// Reveal Up Elements
gsap.utils.toArray('.reveal-up').forEach(elem => {
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Reveal Text
gsap.utils.toArray('.section-header .reveal-text').forEach(elem => {
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 85%"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });
});

// Parallax Hero Athlete
gsap.to('.hero-athlete', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: 100,
    ease: "none"
});

// ==========================================================================
// 6. STATISTICS COUNTER
// ==========================================================================
const statsSection = document.querySelector('.stats');
let counted = false;

ScrollTrigger.create({
    trigger: statsSection,
    start: "top 80%",
    onEnter: () => {
        if (!counted) {
            // Integers
            document.querySelectorAll('.counter').forEach(counter => {
                const target = +counter.getAttribute('data-target');
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    ease: "power2.out"
                });
            });
            
            // Floats (Rating)
            document.querySelectorAll('.counter-float').forEach(counter => {
                const target = +counter.getAttribute('data-target');
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: function() {
                        counter.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
                    }
                });
            });
            counted = true;
        }
    }
});

// ==========================================================================
// 7. MAGNETIC BUTTONS
// ==========================================================================
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: "power2.out"
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// ==========================================================================
// 8. 3D TILT EFFECT (Equipment)
// ==========================================================================
const tiltCards = document.querySelectorAll('[data-tilt]');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power1.out"
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.7,
            ease: "power3.out"
        });
    });
});

// ==========================================================================
// 9. IMAGE MODAL (Equipment Gallery)
// ==========================================================================
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.close-modal');
const equipCards = document.querySelectorAll('.equip-card');

equipCards.forEach(card => {
    card.addEventListener('click', () => {
        const imgSrc = card.querySelector('img').src;
        modalImg.src = imgSrc;
        modal.classList.add('active');
        lenis.stop();
    });
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('active');
    lenis.start();
}

// ==========================================================================
// 10. TRANSFORMATION SLIDER
// ==========================================================================
const baSlider = document.querySelector('.ba-slider');
if (baSlider) {
    const resize = baSlider.querySelector('.resize');
    const handle = baSlider.querySelector('.handle');
    let isSliding = false;
    
    // Handle Mouse
    handle.addEventListener('mousedown', () => isSliding = true);
    document.addEventListener('mouseup', () => isSliding = false);
    
    baSlider.addEventListener('mousemove', (e) => {
        if (!isSliding) return;
        moveSlider(e.clientX);
    });
    
    // Handle Touch
    handle.addEventListener('touchstart', () => isSliding = true);
    document.addEventListener('touchend', () => isSliding = false);
    
    baSlider.addEventListener('touchmove', (e) => {
        if (!isSliding) return;
        moveSlider(e.touches[0].clientX);
    });
    
    function moveSlider(clientX) {
        const rect = baSlider.getBoundingClientRect();
        let x = clientX - rect.left;
        
        // Limits
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        
        const percentage = (x / rect.width) * 100;
        
        resize.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    }
}

// ==========================================================================
// 11. FAQ ACCORDION
// ==========================================================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    
    btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Open clicked if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ==========================================================================
// 12. FLOATING PARTICLES (Hero Section)
// ==========================================================================
const particlesContainer = document.getElementById('particles');

function createParticles() {
    const particleCount = 20; // Number of particles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random starting position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;
        
        particlesContainer.appendChild(particle);
        
        // Animate
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    const duration = Math.random() * 10 + 5; // 5s - 15s
    const yDest = (Math.random() * 100) - 50; // Go up or down
    const xDest = (Math.random() * 100) - 50; // Go left or right
    
    gsap.to(particle, {
        y: yDest,
        x: xDest,
        opacity: Math.random() * 0.5 + 0.1,
        duration: duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
}

// Initialize only on desktop
if (window.innerWidth > 768) {
    createParticles();
}
