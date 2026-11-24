import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function playHero3DReveal(): void {
	gsap.fromTo(
		'.curtain-drapes-img',
		{ opacity: 0.75, scale: 1.06, z: 40, transformPerspective: 1100 },
		{ opacity: 1, scale: 1, z: 0, duration: 1.15, ease: 'power3.out' },
	);

	gsap.fromTo(
		'.hero-estate-img',
		{ opacity: 0, y: 45, z: -130, rotateX: 14, scale: 0.92, transformPerspective: 1100 },
		{ opacity: 1, y: 0, z: 0, rotateX: 0, scale: 1, duration: 1.3, ease: 'power3.out' },
	);

	gsap.fromTo(
		'.hero-names span, .hero-date',
		{ opacity: 0, y: 24, z: -60, rotateX: -20, transformPerspective: 900 },
		{
			opacity: 1,
			y: 0,
			z: 0,
			rotateX: 0,
			duration: 0.95,
			stagger: 0.14,
			delay: 0.35,
			ease: 'power3.out',
		},
	);
}

export function initScroll3DOrnaments(): void {
	const anim3D = (
		target: gsap.TweenTarget,
		fromVars: gsap.TweenVars,
		triggerEl: string,
		stagger = 0,
	) => {
		gsap.fromTo(
			target,
			{ opacity: 0, transformPerspective: 1100, ...fromVars },
			{
				opacity: 1,
				x: 0,
				y: 0,
				z: 0,
				rotateX: 0,
				rotateY: 0,
				rotateZ: 0,
				scale: 1,
				duration: 1.0,
				stagger,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: triggerEl,
					start: 'top 84%',
					once: true,
				},
			},
		);
	};

	// Welcome: Ornaments drop from top, Swans glide from left & right, Bottom rises
	anim3D('#welcome .welcome-top-img', { y: -70, z: -80, rotateX: 16 }, '#welcome');
	anim3D('#welcome .welcome-swan-left', { x: -105, z: -60, rotateY: 22 }, '#welcome');
	anim3D('#welcome .welcome-swan-right', { x: 105, z: -60, rotateY: -22 }, '#welcome');
	anim3D('#welcome .welcome-bottom-img', { y: 45, z: -60, rotateX: -12 }, '#welcome');
	anim3D(
		'#welcome .welcome-overlay-copy > *',
		{ z: 12, rotateX: -12, y: 18 },
		'#welcome',
		0.15,
	);

	// Countdown Medallions & Layered Leaves -> Flowers Collar
	gsap.fromTo(
		'.countdown-medallion',
		{ opacity: 0, rotateY: -34, rotateX: 16, z: -80, scale: 0.82, transformPerspective: 1000 },
		{
			opacity: 1,
			rotateY: 0,
			rotateX: 0,
			z: 0,
			scale: 1,
			duration: 0.9,
			stagger: 0.14,
			ease: 'back.out(1.4)',
			scrollTrigger: { trigger: '#countdown', start: 'top 82%', once: true },
		},
	);
	anim3D('#countdown .collar-leaves-img', { z: -90, rotateX: 18, scale: 0.88, y: 24 }, '#countdown .layered-ornament-stage');
	gsap.fromTo(
		'#countdown .collar-flowers-img',
		{ opacity: 0, z: 30, scale: 0.78, rotateZ: -5, transformPerspective: 1000 },
		{
			opacity: 1,
			z: 0,
			scale: 1,
			rotateZ: 0,
			duration: 0.95,
			delay: 0.22,
			ease: 'back.out(1.6)',
			scrollTrigger: { trigger: '#countdown .layered-ornament-stage', start: 'top 84%', once: true },
		},
	);

	// Couple Intro
	anim3D('#couple-intro > *', { z: -60, rotateX: 18, y: 26 }, '#couple-intro', 0.12);

	// Ceremony & Reception Frame
	anim3D(
		'#ceremony .embroidered-frame-box',
		{ z: -120, rotateX: 12, rotateY: -6, scale: 0.9, y: 34 },
		'#ceremony',
	);
	anim3D(
		'#ceremony .frame-overlay-content > *',
		{ z: 24, y: 18 },
		'#ceremony',
		0.08,
	);

	// Dress Code
	anim3D('#dress-code h2, #dress-code p', { z: -50, rotateX: 14, y: 22 }, '#dress-code', 0.1);
	anim3D('#dress-code .dress-img', { z: -100, rotateX: 16, scale: 0.92, y: 36 }, '#dress-code .dress-img');

	// Our Story Arch: Leaves unfold first, then Flowers bloom in 3D
	anim3D('#our-story .story-leaves-img', { z: -100, rotateX: 20, scale: 0.86, y: 28 }, '#our-story');
	gsap.fromTo(
		'#our-story .story-flowers-img',
		{ opacity: 0, z: 35, scale: 0.76, rotateX: -12, transformPerspective: 1000 },
		{
			opacity: 1,
			z: 0,
			scale: 1,
			rotateX: 0,
			duration: 1.0,
			delay: 0.24,
			ease: 'back.out(1.6)',
			scrollTrigger: { trigger: '#our-story', start: 'top 84%', once: true },
		},
	);
	anim3D('#our-story .story-inner > *', { z: -40, rotateX: 12, y: 20 }, '#our-story .story-inner', 0.14);

	// Timeline Rows (alternating 3D icon entrance)
	document.querySelectorAll<HTMLElement>('.timeline-row').forEach((row, idx) => {
		const icon = row.querySelector('.timeline-icon');
		const info = row.querySelector('.timeline-info');
		if (icon) {
			gsap.fromTo(
				icon,
				{
					opacity: 0,
					z: -80,
					rotateY: idx % 2 === 0 ? -32 : 32,
					scale: 0.78,
					transformPerspective: 900,
				},
				{
					opacity: 1,
					z: 0,
					rotateY: 0,
					scale: 1,
					duration: 0.85,
					ease: 'back.out(1.5)',
					scrollTrigger: { trigger: row, start: 'top 88%', once: true },
				},
			);
		}
		if (info) {
			gsap.fromTo(
				info,
				{ opacity: 0, x: 24, z: -40, rotateX: 12, transformPerspective: 900 },
				{
					opacity: 1,
					x: 0,
					z: 0,
					rotateX: 0,
					duration: 0.8,
					ease: 'power3.out',
					scrollTrigger: { trigger: row, start: 'top 88%', once: true },
				},
			);
		}
	});

	// Galeri Foto 3D (Katsudoto-style staggered 3D card tilt) & Video Frame
	gsap.fromTo(
		'.gallery-card',
		{ opacity: 0, z: -110, rotateY: -22, rotateX: 16, scale: 0.86, transformPerspective: 1000 },
		{
			opacity: 1,
			z: 0,
			rotateY: 0,
			rotateX: 0,
			scale: 1,
			duration: 0.95,
			stagger: 0.12,
			ease: 'back.out(1.35)',
			scrollTrigger: { trigger: '.gallery-grid-3d', start: 'top 84%', once: true },
		},
	);
	anim3D('.video-moment-wrap', { z: -90, rotateX: 14, scale: 0.92, y: 28 }, '.video-moment-wrap');

	// Gifts Frame & Floating 3D Envelope
	anim3D('#gifts .gifts-frame-box', { z: -115, rotateX: 12, rotateY: 6, scale: 0.9, y: 32 }, '#gifts');
	gsap.fromTo(
		'.gifts-envelope-img',
		{ opacity: 0, z: -70, rotateY: -24, rotateZ: -8, scale: 0.82, transformPerspective: 900 },
		{
			opacity: 1,
			z: 0,
			rotateY: 0,
			rotateZ: 0,
			scale: 1,
			duration: 0.95,
			ease: 'back.out(1.6)',
			scrollTrigger: { trigger: '.gifts-envelope-wrap', start: 'top 88%', once: true },
		},
	);

	// RSVP
	anim3D('#rsvp > *', { z: -60, rotateX: 10, y: 24 }, '#rsvp', 0.1);

	ScrollTrigger.refresh();
}
