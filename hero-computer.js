// AGENCIA FLOW — hero 3D computer (Three.js, ES module)
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const wrap = canvas.parentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(3.4, 2.1, 5.4);
  camera.lookAt(0, 0.4, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function fit() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // ---- lights ----
  scene.add(new THREE.AmbientLight(0xffe9d2, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xea5f22, 6, 12);
  rim.position.set(-2.6, 1.6, -1.5);
  scene.add(rim);
  const screenGlow = new THREE.PointLight(0xff9a5c, 3.4, 6);
  screenGlow.position.set(0, 1.1, 1.4);
  scene.add(screenGlow);

  // ---- materials ----
  const ink = 0x18130c;
  const inkSoft = 0x2b2416;
  const paper = 0xf4ecda;
  const accent = 0xea5f22;

  const shellMat = new THREE.MeshStandardMaterial({ color: ink, roughness: 0.45, metalness: 0.25 });
  const shellSoftMat = new THREE.MeshStandardMaterial({ color: inkSoft, roughness: 0.5, metalness: 0.2 });
  const paperMat = new THREE.MeshStandardMaterial({ color: paper, roughness: 0.7, metalness: 0 });
  const screenMat = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 1.4, roughness: 0.3, metalness: 0.1 });
  const accentMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.4, metalness: 0.3 });

  const rig = new THREE.Group();
  scene.add(rig);

  // ---- monitor ----
  const monitor = new THREE.Group();
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.7, 0.14), shellMat);
  monitor.add(bezel);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.32, 1.42), screenMat);
  screen.position.set(0, 0, 0.075);
  monitor.add(screen);

  // screen "content" bars — abstract UI lines
  const barMat = new THREE.MeshBasicMaterial({ color: ink });
  [[-0.75, 0.42, 1.0, 0.07], [-0.2, 0.42, 0.5, 0.07], [0, -0.1, 1.9, 0.05], [0, -0.32, 1.9, 0.05], [0.55, -0.02, 0.55, 0.55]].forEach(([x, y, w, h]) => {
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(w, h), x === 0.55 ? new THREE.MeshBasicMaterial({ color: paper }) : barMat);
    bar.position.set(x, y, 0.08);
    monitor.add(bar);
  });

  monitor.position.y = 1.15;
  rig.add(monitor);

  // neck + base
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.55, 16), shellSoftMat);
  neck.position.set(0, 0.55, 0);
  rig.add(neck);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.09, 24), shellMat);
  base.position.set(0, 0.28, 0);
  rig.add(base);

  // ---- keyboard ----
  const keyboardBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.75), shellSoftMat);
  keyboardBase.position.set(0.15, 0.02, 1.55);
  keyboardBase.rotation.x = -0.06;
  rig.add(keyboardBase);

  const keyGeo = new THREE.BoxGeometry(0.14, 0.05, 0.14);
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 12; j++) {
      const k = new THREE.Mesh(keyGeo, j % 5 === 0 ? accentMat : paperMat);
      k.position.set(-0.78 + j * 0.155, 0.075, 1.28 + i * 0.155);
      k.rotation.x = -0.06;
      rig.add(k);
    }
  }

  // ---- mouse ----
  const mouseBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.16, 4, 8), paperMat);
  mouseBody.rotation.z = Math.PI / 2;
  mouseBody.rotation.y = 0.3;
  mouseBody.position.set(1.35, 0.11, 1.95);
  rig.add(mouseBody);

  // ---- floating asterisk sprites (brand motif) ----
  function makeAsteriskTexture() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.translate(128, 128);
    ctx.fillStyle = '#ea5f22';
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((Math.PI / 6) * i);
      ctx.fillRect(-14, -110, 28, 220);
      ctx.restore();
    }
    return new THREE.CanvasTexture(c);
  }
  const asteriskTex = makeAsteriskTexture();
  const asteriskMat = new THREE.SpriteMaterial({ map: asteriskTex, transparent: true, opacity: 0.92 });

  const asterisks = [];
  const positions = [
    [-2.3, 2.5, -0.6, 0.55],
    [2.6, 0.6, 0.8, 0.35],
    [-1.8, -0.3, 1.6, 0.28],
  ];
  positions.forEach(([x, y, z, s]) => {
    const spr = new THREE.Sprite(asteriskMat);
    spr.position.set(x, y, z);
    spr.scale.set(s, s, s);
    scene.add(spr);
    asterisks.push(spr);
  });

  // thin accent ring floating behind
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.02, 8, 64),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.5 })
  );
  ring.position.set(0, 1.15, -1.1);
  ring.rotation.x = 0.3;
  scene.add(ring);

  rig.position.y = -0.55;
  rig.rotation.y = -0.35;

  // ---- interaction ----
  let targetRotX = 0.08, targetRotY = -0.35;
  let curRotX = targetRotX, curRotY = targetRotY;

  wrap.addEventListener('mousemove', (e) => {
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    targetRotY = -0.35 + px * 0.6;
    targetRotX = 0.08 - py * 0.35;
  });
  wrap.addEventListener('mouseleave', () => { targetRotX = 0.08; targetRotY = -0.35; });

  fit();
  window.addEventListener('resize', fit);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    curRotX += (targetRotX - curRotX) * 0.06;
    curRotY += (targetRotY - curRotY) * 0.06;
    rig.rotation.x = curRotX;
    rig.rotation.y = curRotY + (reduceMotion ? 0 : Math.sin(t * 0.15) * 0.05);
    rig.position.y = -0.55 + (reduceMotion ? 0 : Math.sin(t * 0.6) * 0.05);

    screenMat.emissiveIntensity = 1.2 + Math.sin(t * 2.2) * 0.25;
    screenGlow.intensity = 3.2 + Math.sin(t * 2.2) * 0.6;

    asterisks.forEach((spr, i) => {
      spr.position.y += Math.sin(t * 0.8 + i * 2) * 0.0015;
      spr.material.rotation = t * (0.25 + i * 0.08);
    });
    ring.rotation.z = t * 0.12;

    renderer.render(scene, camera);
  }
  animate();
}
