import * as THREE from 'three';

export interface CurtainController {
	open: () => void;
	destroy: () => void;
}

function easeInOutCubic(t: number): number {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function createLinenCurtainTexture(isLeft: boolean): THREE.CanvasTexture {
	const w = 512;
	const h = 1024;
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d')!;

	// Warm blush-ivory silk-linen base
	const grad = ctx.createLinearGradient(0, 0, w, h);
	grad.addColorStop(0, '#efe1dc');
	grad.addColorStop(0.5, '#e7d5cf');
	grad.addColorStop(1, '#dec7c0');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, w, h);

	// Fine woven linen threads
	ctx.strokeStyle = 'rgba(130, 102, 95, 0.06)';
	ctx.lineWidth = 1;
	for (let y = 0; y < h; y += 4) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
		ctx.stroke();
	}
	for (let x = 0; x < w; x += 5) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);
		ctx.stroke();
	}

	// Pearl-beaded inner hem (matching the real pearl trim in Screenshot 2)
	const pearlX = isLeft ? w - 16 : 16;
	for (let y = 10; y < h; y += 16) {
		ctx.save();
		ctx.fillStyle = 'rgba(70, 55, 50, 0.22)';
		ctx.beginPath();
		ctx.arc(pearlX + (isLeft ? 2 : -2), y + 2, 6, 0, Math.PI * 2);
		ctx.fill();

		const pg = ctx.createRadialGradient(pearlX - 2, y - 2, 1, pearlX, y, 6);
		pg.addColorStop(0, '#ffffff');
		pg.addColorStop(0.65, '#f2ece4');
		pg.addColorStop(1, '#c9bfb3');
		ctx.fillStyle = pg;
		ctx.beginPath();
		ctx.arc(pearlX, y, 6, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.needsUpdate = true;
	return texture;
}

function createValanceTexture(): THREE.CanvasTexture {
	const w = 1024;
	const h = 256;
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d')!;

	ctx.clearRect(0, 0, w, h);

	// 3 scalloped swags across top
	const swags = 3;
	const swagW = w / swags;

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(w, 0);
	ctx.lineTo(w, h * 0.52);
	for (let i = swags - 1; i >= 0; i--) {
		const startX = (i + 1) * swagW;
		const endX = i * swagW;
		const midX = (startX + endX) / 2;
		ctx.quadraticCurveTo(midX, h * 0.98, endX, h * 0.52);
	}
	ctx.closePath();

	const grad = ctx.createLinearGradient(0, 0, 0, h);
	grad.addColorStop(0, '#ead8d2');
	grad.addColorStop(0.7, '#f2e4df');
	grad.addColorStop(1, '#dfc9c2');
	ctx.fillStyle = grad;
	ctx.fill();

	// Vertical pleat shading inside valance
	ctx.clip();
	for (let x = 0; x < w; x += 22) {
		const pGrad = ctx.createLinearGradient(x, 0, x + 22, 0);
		pGrad.addColorStop(0, 'rgba(130, 100, 95, 0.14)');
		pGrad.addColorStop(0.5, 'rgba(255, 250, 248, 0.18)');
		pGrad.addColorStop(1, 'rgba(130, 100, 95, 0.14)');
		ctx.fillStyle = pGrad;
		ctx.fillRect(x, 0, 22, h);
	}
	ctx.restore();

	// Pearl-beaded trim along the scalloped valance
	for (let i = 0; i < swags; i++) {
		const startX = i * swagW;
		const endX = (i + 1) * swagW;
		const midX = (startX + endX) / 2;
		const steps = 18;
		for (let s = 0; s <= steps; s++) {
			const t = s / steps;
			const px = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
			const py = (1 - t) * (1 - t) * (h * 0.48) + 2 * (1 - t) * t * (h * 0.93) + t * t * (h * 0.48);
			const pg = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, 7);
			pg.addColorStop(0, '#ffffff');
			pg.addColorStop(0.65, '#f2ece4');
			pg.addColorStop(1, '#c9bfb3');
			ctx.fillStyle = pg;
			ctx.beginPath();
			ctx.arc(px, py, 7, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.needsUpdate = true;
	return texture;
}

function initFallback2DCurtain(canvas: HTMLCanvasElement): CurtainController {
	const ctx = canvas.getContext('2d');
	let isOpening = false;
	let openProgress = 0;
	let rafId = 0;
	let lastTime = performance.now();

	const resize = () => {
		const rect = canvas.getBoundingClientRect();
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.max(1, Math.floor(rect.width * dpr));
		canvas.height = Math.max(1, Math.floor(rect.height * dpr));
		renderFrame(performance.now());
	};
	window.addEventListener('resize', resize);

	const drawCurtainHalf = (w: number, h: number, isLeft: boolean, eased: number) => {
		if (!ctx || w <= 0 || h <= 0) return;
		const halfW = w * 0.505;
		const pleats = 10;
		const curW = halfW * (1 - eased * 0.66);
		const pw = curW / pleats;

		for (let i = 0; i < pleats; i++) {
			const x0 = isLeft ? i * pw : w - (i + 1) * pw;
			const g = ctx.createLinearGradient(x0, 0, x0 + pw, 0);
			g.addColorStop(0, '#c6afa8');
			g.addColorStop(0.45, '#f4e8e3');
			g.addColorStop(1, '#d2bdb6');
			ctx.fillStyle = g;
			ctx.fillRect(x0, 0, pw + 0.8, h);
		}

		// Inner stitched trim along curtain edge
		const edgeX = isLeft ? curW - 6 : w - curW + 6;
		ctx.save();
		ctx.strokeStyle = '#c48d91';
		ctx.lineWidth = 2;
		ctx.setLineDash([6, 5]);
		ctx.beginPath();
		ctx.moveTo(edgeX, 0);
		ctx.lineTo(edgeX, h);
		ctx.stroke();
		ctx.restore();
	};

	const renderFrame = (now: number) => {
		const dt = Math.min((now - lastTime) / 1000, 0.05);
		lastTime = now;
		if (isOpening && openProgress < 1) {
			openProgress = Math.min(1, openProgress + dt * 0.62);
		}
		const eased = easeInOutCubic(openProgress);
		if (!ctx) return;
		const { width: w, height: h } = canvas;
		const curtainBottom = h * 0.68;
		ctx.clearRect(0, 0, w, h);

		drawCurtainHalf(w, curtainBottom, true, eased);
		drawCurtainHalf(w, curtainBottom, false, eased);

		// Scalloped Valance
		const valH = h * 0.14;
		const swagW = w / 3;
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(w, 0);
		ctx.lineTo(w, valH * 0.58);
		for (let i = 2; i >= 0; i--) {
			ctx.quadraticCurveTo((i + 0.5) * swagW, valH * 1.05, i * swagW, valH * 0.58);
		}
		ctx.closePath();
		ctx.fillStyle = '#ead8d2';
		ctx.fill();
		ctx.strokeStyle = '#c58e92';
		ctx.lineWidth = Math.max(2, w * 0.005);
		ctx.setLineDash([6, 5]);
		ctx.stroke();
		ctx.restore();
	};

	const render = (now: number) => {
		rafId = requestAnimationFrame(render);
		renderFrame(now);
	};
	resize();
	rafId = requestAnimationFrame(render);

	return {
		open: () => {
			isOpening = true;
		},
		destroy: () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', resize);
		},
	};
}

export function initCurtainScene(canvas: HTMLCanvasElement): CurtainController {
	const fallbackEl = document.getElementById('curtain-fallback');
	const probe = document.createElement('canvas');
	const hasWebGL = Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
	if (!hasWebGL) {
		fallbackEl?.classList.add('is-active');
		const fb = initFallback2DCurtain(canvas);
		return {
			open: () => {
				fallbackEl?.classList.add('is-opened');
				fb.open();
			},
			destroy: fb.destroy,
		};
	}

	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'high-performance',
		});
	} catch {
		fallbackEl?.classList.add('is-active');
		const fb = initFallback2DCurtain(canvas);
		return {
			open: () => {
				fallbackEl?.classList.add('is-opened');
				fb.open();
			},
			destroy: fb.destroy,
		};
	}
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
	camera.position.set(0, 0, 5);

	// Warm editorial lighting
	const ambient = new THREE.AmbientLight(0xfff5f0, 1.35);
	scene.add(ambient);

	const keyLight = new THREE.DirectionalLight(0xfffaf6, 1.15);
	keyLight.position.set(-2.5, 3.2, 4.5);
	scene.add(keyLight);

	const fillLight = new THREE.DirectionalLight(0xf2d8d8, 0.65);
	fillLight.position.set(3.0, -1.5, 3.0);
	scene.add(fillLight);

	// Compute visible world dimensions at z = 0
	let viewW = 2.4;
	let viewH = 4.2;

	const updateSize = () => {
		const rect = canvas.getBoundingClientRect();
		const width = Math.max(rect.width, 1);
		const height = Math.max(rect.height, 1);
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		const vFov = THREE.MathUtils.degToRad(camera.fov);
		viewH = 2 * Math.tan(vFov / 2) * camera.position.z;
		viewW = viewH * camera.aspect;
	};
	updateSize();

	// Curtain geometries
	const segX = 48;
	const segY = 56;
	const halfW = viewW * 0.52;
	const curtainH = viewH * 1.02;

	const leftGeo = new THREE.PlaneGeometry(halfW, curtainH, segX, segY);
	const rightGeo = new THREE.PlaneGeometry(halfW, curtainH, segX, segY);

	const leftMat = new THREE.MeshStandardMaterial({
		map: createLinenCurtainTexture(true),
		roughness: 0.88,
		metalness: 0.02,
		side: THREE.DoubleSide,
	});
	const rightMat = new THREE.MeshStandardMaterial({
		map: createLinenCurtainTexture(false),
		roughness: 0.88,
		metalness: 0.02,
		side: THREE.DoubleSide,
	});

	const leftCurtain = new THREE.Mesh(leftGeo, leftMat);
	const rightCurtain = new THREE.Mesh(rightGeo, rightMat);
	leftCurtain.visible = false;
	rightCurtain.visible = false;
	scene.add(leftCurtain, rightCurtain);

	// Save base vertex positions
	const leftBase = new Float32Array(leftGeo.attributes.position.array);
	const rightBase = new Float32Array(rightGeo.attributes.position.array);

	// Scalloped Valance across top
	const valanceH = viewH * 0.19;
	const valanceGeo = new THREE.PlaneGeometry(viewW * 1.04, valanceH, 48, 12);
	const valanceMat = new THREE.MeshStandardMaterial({
		map: createValanceTexture(),
		transparent: true,
		roughness: 0.85,
		metalness: 0.02,
		depthWrite: false,
	});
	const valance = new THREE.Mesh(valanceGeo, valanceMat);
	valance.visible = false;
	valance.position.set(0, viewH * 0.5 - valanceH * 0.46, 0.25);
	scene.add(valance);

	// Floating 3D Rose & Wisteria Petals (visible once curtains open)
	const petalGroup = new THREE.Group();
	const petalGeo = new THREE.CircleGeometry(0.032, 7);
	petalGeo.scale(1.3, 0.75, 1);
	const petalColors = [0xdf9ea0, 0xf2cfc9, 0xb594b8, 0xe8b8bb];

	interface PetalData {
		mesh: THREE.Mesh;
		speedY: number;
		swayAmp: number;
		swayFreq: number;
		phase: number;
		rotSpeed: number;
	}
	const petals: PetalData[] = [];
	for (let i = 0; i < 24; i++) {
		const mat = new THREE.MeshBasicMaterial({
			color: petalColors[i % petalColors.length],
			transparent: true,
			opacity: 0,
			side: THREE.DoubleSide,
			depthWrite: false,
		});
		const mesh = new THREE.Mesh(petalGeo, mat);
		mesh.position.set(
			(Math.random() - 0.5) * viewW * 0.9,
			(Math.random() - 0.5) * viewH,
			0.35 + Math.random() * 0.4,
		);
		petalGroup.add(mesh);
		petals.push({
			mesh,
			speedY: 0.18 + Math.random() * 0.22,
			swayAmp: 0.14 + Math.random() * 0.2,
			swayFreq: 0.8 + Math.random() * 1.2,
			phase: Math.random() * Math.PI * 2,
			rotSpeed: (Math.random() - 0.5) * 1.8,
		});
	}
	scene.add(petalGroup);

	let isOpening = false;
	let openProgress = 0;
	let rafId = 0;
	const clock = new THREE.Clock();

	const deformCurtain = (
		geo: THREE.PlaneGeometry,
		base: Float32Array,
		isLeft: boolean,
		t: number,
		easedOpen: number,
	) => {
		const pos = geo.attributes.position;
		const arr = pos.array as Float32Array;
		const pleatCount = 13;

		for (let i = 0; i < arr.length; i += 3) {
			const bx = base[i];
			const by = base[i + 1];

			// Normalized coordinates: u across width [0..1], v from top [0..1]
			const u = (bx + halfW * 0.5) / halfW;
			const v = 1 - (by + curtainH * 0.5) / curtainH; // 0 at top, 1 at bottom

			// Tie-back waist curve: middle & lower parts pull further aside
			const tieCurve = 0.28 + 0.72 * Math.sin(Math.min(v * 0.95, 1) * Math.PI * 0.72);
			const compressFactor = 1 - easedOpen * (0.64 * tieCurve);

			// Compress x toward outer edge
			const anchorU = isLeft ? 0 : 1;
			const newU = anchorU + (u - anchorU) * compressFactor;
			const localX = newU * halfW - halfW * 0.5;

			// Pleats deepen slightly when gathered + gentle breeze sway
			const pleatDepth = 0.065 + easedOpen * 0.035;
			const breeze = Math.sin(t * 1.15 + v * 2.4 + u * 3.0) * 0.014 * (0.3 + v * 0.7);
			const z = Math.sin(u * Math.PI * pleatCount) * pleatDepth + breeze;

			arr[i] = localX;
			arr[i + 1] = by;
			arr[i + 2] = z;
		}
		pos.needsUpdate = true;
		geo.computeVertexNormals();

		// Position left/right halves seamlessly in center when closed, then slide outward
		const baseCenter = isLeft ? -halfW * 0.49 : halfW * 0.49;
		const slideOut = (isLeft ? -1 : 1) * easedOpen * (viewW * 0.14);
		if (isLeft) {
			leftCurtain.position.x = baseCenter + slideOut;
		} else {
			rightCurtain.position.x = baseCenter + slideOut;
		}
	};

	const animate = () => {
		rafId = requestAnimationFrame(animate);
		const dt = Math.min(clock.getDelta(), 0.05);
		const elapsed = clock.elapsedTime;

		if (isOpening && openProgress < 1) {
			openProgress = Math.min(1, openProgress + dt * 0.62);
		}
		const eased = easeInOutCubic(openProgress);

		deformCurtain(leftGeo, leftBase, true, elapsed, eased);
		deformCurtain(rightGeo, rightBase, false, elapsed, eased);

		// Subtle valance sway
		valance.rotation.z = Math.sin(elapsed * 0.7) * 0.004;

		// Animate petals after curtain begins opening
		if (eased > 0.2) {
			const petalAlpha = Math.min(0.82, (eased - 0.2) * 1.1);
			for (const p of petals) {
				const mat = p.mesh.material as THREE.MeshBasicMaterial;
				mat.opacity = petalAlpha;
				p.mesh.position.y -= p.speedY * dt;
				p.mesh.position.x += Math.sin(elapsed * p.swayFreq + p.phase) * p.swayAmp * dt;
				p.mesh.rotation.z += p.rotSpeed * dt;
				p.mesh.rotation.x += p.rotSpeed * 0.5 * dt;
				if (p.mesh.position.y < -viewH * 0.55) {
					p.mesh.position.y = viewH * 0.55;
					p.mesh.position.x = (Math.random() - 0.5) * viewW * 0.85;
				}
			}
		}

		renderer.render(scene, camera);
	};

	window.addEventListener('resize', updateSize);
	animate();

	return {
		open: () => {
			isOpening = true;
		},
		destroy: () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', updateSize);
			leftGeo.dispose();
			rightGeo.dispose();
			leftMat.dispose();
			rightMat.dispose();
			valanceGeo.dispose();
			valanceMat.dispose();
			petalGeo.dispose();
			renderer.dispose();
		},
	};
}
