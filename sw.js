const CACHE = 'gym-tracker-v1.0.1';

// App shell - everything needed to run offline
const SHELL = [
  './',
  './index.html',
  './html2canvas.min.js',
];
// Exercise images to cache on install
const WM = "https://upload.wikimedia.org/wikipedia/commons/thumb";
const EXERCISE_IMAGES = [...new Set([
  

    `${WM}/b/b8/Incline_dumbbell_press_1.svg/60px-Incline_dumbbell_press_1.svg.png`,
    `${WM}/2/23/Barbell_neck_press_1.svg/60px-Barbell_neck_press_1.svg.png`,
    `${WM}/c/c2/Incline_dumbbell_flys_2.svg/60px-Incline_dumbbell_flys_2.svg.png`,
    `${WM}/a/aa/Lateral_dumbbell_raises_1.svg/60px-Lateral_dumbbell_raises_1.svg.png`,
    `${WM}/2/25/Bent_over_lateral_cable_raises_1.svg/60px-Bent_over_lateral_cable_raises_1.svg.png`,
    `${WM}/e/e5/Dumbbell_shoulder_press_2.svg/60px-Dumbbell_shoulder_press_2.svg.png`,
    `${WM}/4/4d/Dumbbell_shoulder_press_1.svg/60px-Dumbbell_shoulder_press_1.svg.png`,
    `${WM}/e/e6/Seated_military_press_2.svg/60px-Seated_military_press_2.svg.png`,
    `${WM}/f/f5/Wide_grip_lat_pull_down_2.svg/60px-Wide_grip_lat_pull_down_2.svg.png`,
    `${WM}/c/c5/Rear_deltoid_row_dumbbell_2.svg/60px-Rear_deltoid_row_dumbbell_2.svg.png`,
    `${WM}/8/84/Seated_cable_rows_1.svg/60px-Seated_cable_rows_1.svg.png`,
    `${WM}/8/84/Seated_cable_rows_1.svg/60px-Seated_cable_rows_1.svg.png`,
    `${WM}/0/01/T_bar_rows_1.svg/60px-T_bar_rows_1.svg.png`,
    `${WM}/7/77/Pull_ups_2.svg/60px-Pull_ups_2.svg.png`,
    `${WM}/a/ac/Hyperextensions_1.svg/60px-Hyperextensions_1.svg.png`,
    `${WM}/d/de/Bicep_curl_with_deadlift_with_barbell_2.svg/60px-Bicep_curl_with_deadlift_with_barbell_2.svg.png`,
    `${WM}/3/36/Preacher_curl_with_barbell_2.svg/60px-Preacher_curl_with_barbell_2.svg.png`,
    `${WM}/0/06/Bicep_hammer_curl_with_dumbbell_1.svg/60px-Bicep_hammer_curl_with_dumbbell_1.svg.png`,
    `${WM}/c/c0/Close_grip_ez_bar_curl_with_barbell_2.svg/60px-Close_grip_ez_bar_curl_with_barbell_2.svg.png`,
    `${WM}/c/c0/Close_grip_ez_bar_curl_with_barbell_2.svg/60px-Close_grip_ez_bar_curl_with_barbell_2.svg.png`,
    `${WM}/c/c3/Lying_bicep_cable_curl_2.svg/60px-Lying_bicep_cable_curl_2.svg.png`,
    `${WM}/8/85/Concentration_curls_with_dumbbell_1.svg/60px-Concentration_curls_with_dumbbell_1.svg.png`,
    `${WM}/1/1b/Lying_incline_curl_with_barbell_1.svg/60px-Lying_incline_curl_with_barbell_1.svg.png`,
    `${WM}/3/34/Close_grip_barbell_bench_press_1.svg/60px-Close_grip_barbell_bench_press_1.svg.png`,
    `${WM}/1/13/Triceps_pushdown_with_cable_1.svg/60px-Triceps_pushdown_with_cable_1.svg.png`,
    `${WM}/b/ba/Triceps_kickback_with_dumbbell_2.svg/60px-Triceps_kickback_with_dumbbell_2.svg.png`,
    `${WM}/0/0b/Decline_close_grip_bench_to_skull_crusher_2.svg/60px-Decline_close_grip_bench_to_skull_crusher_2.svg.png`,
    `${WM}/1/15/One_arm_triceps_extension_with_dumbbell_1.svg/60px-One_arm_triceps_extension_with_dumbbell_1.svg.png`,
    `${WM}/d/da/One_arm_low_pulley_triceps_extension_with_cable_2.svg/60px-One_arm_low_pulley_triceps_extension_with_cable_2.svg.png`,
    `${WM}/5/5e/Chest_dips_2.svg/60px-Chest_dips_2.svg.png`,
    `${WM}/5/5e/Chest_dips_2.svg/60px-Chest_dips_2.svg.png`,
    `${WM}/2/2e/Upright_barbell_rows_1.svg/60px-Upright_barbell_rows_1.svg.png`,
    `${WM}/4/4e/Cable_shoulder_shrugs_2.svg/60px-Cable_shoulder_shrugs_2.svg.png`,
    `${WM}/9/95/Front_dumbbell_raise_2.svg/60px-Front_dumbbell_raise_2.svg.png`,
    `${WM}/f/f6/Romanian_dead_lift_2.svg/60px-Romanian_dead_lift_2.svg.png`,
    `${WM}/d/de/Bicep_curl_with_deadlift_with_barbell_2.svg/60px-Bicep_curl_with_deadlift_with_barbell_2.svg.png`,
    `${WM}/9/93/One_leg_squat_with_barbell_2.svg/60px-One_leg_squat_with_barbell_2.svg.png`,
    `${WM}/3/3b/Walking_lunges_4.svg/60px-Walking_lunges_4.svg.png`,
    `${WM}/5/5e/Bent_knee_hip_raise_1.svg/60px-Bent_knee_hip_raise_1.svg.png`,
    `${WM}/a/a7/Seated_calf_raise_with_barbell_2.svg/60px-Seated_calf_raise_with_barbell_2.svg.png`,
    `${WM}/b/b3/Pile_squat_with_dumbbell_2.svg/60px-Pile_squat_with_dumbbell_2.svg.png`,
    `${WM}/5/5e/Wide_stance_squat_with_barbell_2.svg/60px-Wide_stance_squat_with_barbell_2.svg.png`,
    `${WM}/a/a1/Calves_press_on_leg_machine_1.svg/60px-Calves_press_on_leg_machine_1.svg.png`,
    `${WM}/3/30/Leg_extensions_2.svg/60px-Leg_extensions_2.svg.png`,
    `${WM}/9/96/Lying_leg_curl_machine_1.svg/60px-Lying_leg_curl_machine_1.svg.png`,
    `${WM}/e/ed/Narrow_stance_hack_squats_2.svg/60px-Narrow_stance_hack_squats_2.svg.png`,
    `${WM}/7/7a/Decline_dumbbell_bench_press_1.svg/60px-Decline_dumbbell_bench_press_1.svg.png`,
    `${WM}/7/7c/Cable-crossover-2.png/60px-Cable-crossover-2.png`,
    `${WM}/3/30/Butterfly_machine_1.svg/60px-Butterfly_machine_1.svg.png`,
    `${WM}/6/6c/Close_triceps_pushup_1.svg/60px-Close_triceps_pushup_1.svg.png`,
    `${WM}/7/78/Seated_ab_crunch_with_cable_1.svg/60px-Seated_ab_crunch_with_cable_1.svg.png`,
    `${WM}/7/77/Pull_ups_2.svg/60px-Pull_ups_2.svg.png`,
    `${WM}/e/ec/Ab_rollout_on_knees_with_barbell_2.svg/60px-Ab_rollout_on_knees_with_barbell_2.svg.png`,
])];

// Install: Cache shell and images
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async cache => {
      await cache.addAll(SHELL);
      
      const imagePromises = EXERCISE_IMAGES.map(async url => {
        try {
          // No 'no-cors' here so html2canvas works later!
          const res = await fetch(url);
          if (res.ok) await cache.put(url, res);
        } catch (err) {
          console.warn('Image failed:', url);
        }
      });
      await Promise.allSettled(imagePromises);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // 1. Filter out requests we don't want to handle
  if (url.searchParams.has('code')) return;
  if (e.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  const isWikimedia = url.hostname === 'upload.wikimedia.org';

  // 2. Define dynamic caching helper
  const isCachable = (res) => {
    return res && (res.status === 200 || (res.status === 0 && isWikimedia));
  };

  // 3. Strategy: Network-First for specific domains
  const networkFirstDomains = ['youtube.com', 'ytimg.com', 'googleapis.com', 'gstatic.com'];
  const isNetworkFirst = networkFirstDomains.some(domain => url.hostname.includes(domain));

  if (isNetworkFirst) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (isCachable(res)) {
            const clone = res.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // 4. Strategy: Cache-First (Default)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(res => {
        // Now we check if it's our origin OR Wikimedia before caching
        if (isCachable(res) && (url.origin === location.origin || isWikimedia)) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      });
    })
  );
});