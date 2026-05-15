const CACHE = 'gym-tracker-v7';

// App shell - everything needed to run offline
const SHELL = [
  './',
  './index.html',
];

// Exercise images to cache on install
const WM = "https://upload.wikimedia.org/wikipedia/commons/thumb";
const EXERCISE_IMAGES = [...new Set([
  `${WM}/b/b8/Incline_dumbbell_press_1.svg/60px-Incline_dumbbell_press_1.svg.png`,
  `${WM}/2/23/Barbell_neck_press_1.svg/60px-Barbell_neck_press_1.svg.png`,
  `${WM}/c/c2/Incline_dumbbell_flys_2.svg/60px-Incline_dumbbell_flys_2.svg.png`,
  `${WM}/a/aa/Lateral_dumbbell_raises_1.svg/60px-Lateral_dumbbell_raises_1.svg.png`,
  `${WM}/e/e5/Dumbbell_shoulder_press_2.svg/60px-Dumbbell_shoulder_press_2.svg.png`,
  `${WM}/f/f5/Wide_grip_lat_pull_down_2.svg/60px-Wide_grip_lat_pull_down_2.svg.png`,
  `${WM}/c/c5/Rear_deltoid_row_dumbbell_2.svg/60px-Rear_deltoid_row_dumbbell_2.svg.png`,
  `${WM}/8/84/Seated_cable_rows_1.svg/60px-Seated_cable_rows_1.svg.png`,
  `${WM}/3/36/Preacher_curl_with_barbell_2.svg/60px-Preacher_curl_with_barbell_2.svg.png`,
  `${WM}/0/06/Bicep_hammer_curl_with_dumbbell_1.svg/60px-Bicep_hammer_curl_with_dumbbell_1.svg.png`,
  `${WM}/3/34/Close_grip_barbell_bench_press_1.svg/60px-Close_grip_barbell_bench_press_1.svg.png`,
  `${WM}/1/13/Triceps_pushdown_with_cable_1.svg/60px-Triceps_pushdown_with_cable_1.svg.png`,
  `${WM}/b/ba/Triceps_kickback_with_dumbbell_2.svg/60px-Triceps_kickback_with_dumbbell_2.svg.png`,
  `${WM}/2/2e/Upright_barbell_rows_1.svg/60px-Upright_barbell_rows_1.svg.png`,
  `${WM}/c/c0/Close_grip_ez_bar_curl_with_barbell_2.svg/60px-Close_grip_ez_bar_curl_with_barbell_2.svg.png`,
  `${WM}/c/c3/Lying_bicep_cable_curl_2.svg/60px-Lying_bicep_cable_curl_2.svg.png`,
  `${WM}/4/4e/Cable_shoulder_shrugs_2.svg/60px-Cable_shoulder_shrugs_2.svg.png`,
  `${WM}/b/b3/Pile_squat_with_dumbbell_2.svg/60px-Pile_squat_with_dumbbell_2.svg.png`,
  `${WM}/f/f6/Romanian_dead_lift_2.svg/60px-Romanian_dead_lift_2.svg.png`,
  `${WM}/9/93/One_leg_squat_with_barbell_2.svg/60px-One_leg_squat_with_barbell_2.svg.png`,
  `${WM}/5/5e/Bent_knee_hip_raise_1.svg/60px-Bent_knee_hip_raise_1.svg.png`,
  `${WM}/a/a7/Seated_calf_raise_with_barbell_2.svg/60px-Seated_calf_raise_with_barbell_2.svg.png`,
])];

// Install: cache the shell immediately
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async cache => {

      // Shell first (critical)
      await cache.addAll(SHELL);

      // Images individually (robust)
      const imagePromises = EXERCISE_IMAGES.map(async url => {
        try {
          const res = await fetch(url, { mode: 'no-cors' });
          await cache.put(url, res);
        } catch (err) {
          console.warn('Image failed:', url);
        }
      });

      await Promise.allSettled(imagePromises);
    })
  );

  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch handling
self.addEventListener('fetch', e => {

  const url = new URL(e.request.url);

  // Skip Spotify OAuth callback requests
  if (url.searchParams.has('code')) {
    return;
  }

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Skip browser extensions
  if (url.protocol === 'chrome-extension:') return;

  // Domains that should use network-first
  const networkFirst = [
    'youtube.com',
    'ytimg.com',
    'googleapis.com',
    'gstatic.com',
    'fonts.gstatic.com'
  ];

  const isNetworkFirst = networkFirst.some(domain =>
    url.hostname.includes(domain)
  );

  // Network-first strategy
  if (isNetworkFirst) {
    e.respondWith(
      fetch(e.request)
        .then(res => {

          if (
  res &&
  res.status === 200 &&
  url.origin === location.origin
) {
            const clone = res.clone();

            caches.open(CACHE).then(cache => {
              cache.put(e.request, clone);
            });
          }

          return res;
        })
        .catch(() => caches.match(e.request))
    );

    return;
  }

  // Cache-first strategy
  e.respondWith(
    caches.match(e.request).then(cached => {

      if (cached) {
        return cached;
      }

      return fetch(e.request).then(res => {

        if (
  res &&
  res.status === 200 &&
  url.origin === location.origin
) {
          const clone = res.clone();

          caches.open(CACHE).then(cache => {
            cache.put(e.request, clone);
          });
        }

        return res;
      });

    })
  );

});