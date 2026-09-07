import * as THREE from 'three';

const canvas = document.getElementById('hero3d');
if (
  canvas &&
  !document.documentElement.classList.contains('is-gated') &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x101010, 0.045);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x101010, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const redLine = new THREE.LineBasicMaterial({ color: 0x8090ff, transparent: true, opacity: 0.95 });
  const dimLine = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 });
  const redFill = new THREE.MeshBasicMaterial({ color: 0x8090ff, transparent: true, opacity: 0.18, depthWrite: false });
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x8090ff, transparent: true, opacity: 0.7 });
  const ringDim = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 });

  const root = new THREE.Group();
  root.position.set(3.05, 0.35, 0);
  scene.add(root);

  const crystalGeo = new THREE.OctahedronGeometry(1.72, 0);
  const crystal = new THREE.Mesh(crystalGeo, redFill);
  crystal.add(new THREE.LineSegments(new THREE.EdgesGeometry(crystalGeo), redLine));
  root.add(crystal);

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.018, 8, 96), ringMat);
  ringA.rotation.x = Math.PI / 2;
  root.add(ringA);

  const ringB = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.012, 8, 96), ringDim);
  ringB.rotation.x = Math.PI / 2.55;
  ringB.rotation.y = 0.4;
  root.add(ringB);

  const ringC = new THREE.Mesh(new THREE.TorusGeometry(3.75, 0.01, 8, 80), ringDim);
  ringC.rotation.x = Math.PI / 1.7;
  ringC.rotation.z = 0.5;
  root.add(ringC);

  const count = 220;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const r = 4.2 + Math.random() * 3.4;
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(v) * Math.cos(u);
    pos[i * 3 + 1] = r * Math.cos(v) * 0.55;
    pos[i * 3 + 2] = r * Math.sin(v) * Math.sin(u);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: 0x8090ff, size: 0.035, transparent: true, opacity: 0.55 })
  );
  root.add(points);

  const look = new THREE.Vector3(2.2, 0.3, 0);

  function scrollT() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(1, Math.max(0, window.scrollY / max));
  }

  let target = scrollT();
  let current = target;

  window.addEventListener('scroll', () => {
    target = scrollT();
  }, { passive: true });

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  const preview = document.querySelector('#preview');

  function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    current += (target - current) * 0.07;

    if (preview) {
      const top = preview.getBoundingClientRect().top;
      const fade = Math.max(0, Math.min(1, (top - 40) / Math.max(window.innerHeight * 0.55, 1)));
      canvas.style.opacity = String(fade);
    }

    crystal.rotation.y = t * 0.15 + current * Math.PI * 2.4;
    crystal.rotation.x = 0.28 + current * 0.45;
    crystal.position.y = Math.sin(t * 0.7) * 0.08;

    ringA.rotation.z = t * 0.2 + current * Math.PI * 1.8;
    ringB.rotation.y = 0.4 + t * -0.12 + current * Math.PI * 1.2;
    ringC.rotation.z = 0.5 + current * Math.PI * -1.1;
    points.rotation.y = t * 0.05 + current * 0.8;

    const scale = 1 - current * 0.38;
    root.scale.setScalar(scale);
    root.position.set(3.2 + current * 1.15, 0.15 - current * 0.35, 0);

    camera.position.set(0.15, 0.28 + Math.sin(t * 0.4) * 0.06, 8.1);
    look.set(2.35 + current * 0.6, 0.2, 0);
    camera.lookAt(look);

    renderer.render(scene, camera);
  }

  tick();
}
