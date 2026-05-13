const CACHE = 'gym-tracker-v7';

// App shell - everything needed to run offline
const SHELL = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap'
];

// Exercise images to cache on install
const EXERCISE_IMAGES = [
       // Push day 1
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Incline_dumbbell_press_1.svg/60px-Incline_dumbbell_press_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Barbell_neck_press_1.svg/60px-Barbell_neck_press_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Incline_dumbbell_flys_2.svg/60px-Incline_dumbbell_flys_2.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Lateral_dumbbell_raises_1.svg/60px-Lateral_dumbbell_raises_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Dumbbell_shoulder_press_2.svg/60px-Dumbbell_shoulder_press_2.svg.png",
    // Pull day 2
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Wide_grip_lat_pull_down_2.svg/60px-Wide_grip_lat_pull_down_2.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rear_deltoid_row_dumbbell_2.svg/960px-Rear_deltoid_row_dumbbell_2.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Seated_cable_rows_1.svg/60px-Seated_cable_rows_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Preacher_curl_with_barbell_2.svg/60px-Preacher_curl_with_barbell_2.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Bicep_hammer_curl_with_dumbbell_1.svg/60px-Bicep_hammer_curl_with_dumbbell_1.svg.png",
    // Push day 3
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Close_grip_barbell_bench_press_1.svg/60px-Close_grip_barbell_bench_press_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Incline_dumbbell_flys_2.svg/60px-Incline_dumbbell_flys_2.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Triceps_pushdown_with_cable_1.svg/60px-Triceps_pushdown_with_cable_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Low_triceps_extension_with_cable_2.svg/60px-Low_triceps_extension_with_cable_2.svg.png",
     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Lateral_dumbbell_raises_1.svg/60px-Lateral_dumbbell_raises_1.svg.png",
    // Pull day 4
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Upright_barbell_rows_1.svg/960px-Upright_barbell_rows_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cable-seated-rows-2.png/60px-Cable-seated-rows-2.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Seated_cable_rows_1.svg/60px-Seated_cable_rows_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Close_grip_ez_bar_curl_with_barbell_2.svg/60px-Close_grip_ez_bar_curl_with_barbell_2.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Lying_bicep_cable_curl_2.svg/960px-Lying_bicep_cable_curl_2.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cable_shoulder_shrugs_2.svg/250px-Cable_shoulder_shrugs_2.svg.png",
     // Leg day
    "https://upload.wikimedia.org/wikipedia/commons/thumb//9/9e/Dumbbell_goblet_squat_1.svg/120px-Dumbbell_goblet_squat_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb//4/41/Dumbbell_romanian_deadlift_1.svg/120px-Dumbbell_romanian_deadlift_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb//7/71/Dumbbell_split_squat_1.svg/120px-Dumbbell_split_squat_1.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb//a/a4/Barbell_hip_thrust_1.svg/120px-Barbell_hip_thrust_1.svg.png",
];

// Install: cache the shell immediately
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      // Cache shell resources
      cache.addAll(SHELL);
      // Cache exercise images (non-blocking - may fail if offline)
      cache.addAll(EXERCISE_IMAGES).catch(err => {
        console.warn('Some exercise images failed to cache:', err);
      });
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

// Fetch: cache-first for same-origin, network-first for YouTube/Google Fonts
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET and chrome-extension requests
  if (e.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // YouTube and Google Fonts: network first, fall back to cache
  const networkFirst = ['youtube.com', 'ytimg.com', 'googleapis.com', 'gstatic.com', 'fonts.gstatic.com'];
  const isNetworkFirst = networkFirst.some(d => url.hostname.includes(d));

  if (isNetworkFirst) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          // Cache a clone of successful responses
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request)) // offline: serve cache or undefined (blank)
    );
    return;
  }

  // Everything else: cache first, fall back to network then cache it
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
