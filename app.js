// 🌸🐱 Aitashii Powerlifting Tracker - COMPLETE FEATURED VERSION
// Features: Full Dashboard, Timer System, Calendar, All Sections in English

let appData = {
  version: '3.0.0',
  lastUpdated: null,
  currentDate: "2025-08-25", // Auto-updated (Zurich timezone)

  // Firebase sync status
  syncStatus: {
    isOnline: false,
    lastSync: null,
    user: null
  },
  
  // Current PRs
  currentPRs: {
    squat: { weight: 40, reps: 5, date: "2025-08-23", estimated1RM: 45 },
    bench: { weight: 45, reps: 1, date: "2025-08-23", estimated1RM: 45 },
    deadlift: { weight: 90, reps: 1, date: "2025-07-31", estimated1RM: 90 }
  },
  
  // Body measurements
  measurements: [
    { 
      date: "2025-08-19", 
      weight: 84.1, 
      bodyFat: 38, 
      muscle: 27.1,
      fatMass: 32.7,
      bodyWater: 37.7
    }
  ],
  
  // Body composition goals
  bodyGoals: {
    current: {
      weight: 84.1,
      bodyFat: 38,
      fatMass: 32.7,
      muscleMass: 27.1,
      bodyWater: 37.7
    },
    target: {
      weight: 72,
      bodyFat: 18,
      fatMass: 13.0,
      muscleMass: 32.7,
      bodyWater: 43.1
    }
  },
  
  // Menstrual cycle tracking
  menstrualCycle: {
    lastPeriodStart: "2025-08-20",
    lastPeriodEnd: "2025-08-25", 
    periodLength: 6,
    cycleLength: 28
  },
  
  // PR History
  prHistory: {
    squat: [
      { date: "2025-08-23", weight: 40, reps: 5, estimated1RM: 45 }
    ],
    bench: [
      { date: "2025-08-06", weight: 42.5, reps: 1, estimated1RM: 42.5 },
      { date: "2025-08-23", weight: 45, reps: 1, estimated1RM: 45 }
    ],
    deadlift: [
      { date: "2025-07-31", weight: 90, reps: 1, estimated1RM: 90 }
    ]
  },
  
  // Training phases
  trainingPhases: {
    phase1: {
      name: "HYPERTROPHY + REHAB",
      startDate: "2025-08-25",
      endDate: "2025-10-06",
      duration: "6 weeks",
      intensityRange: "65-80%",
      focus: "Volume, technique, adductor strengthening",
      exercises: {
        squat: {sets: 3, reps: "8-12", intensity: 0.70},
        bench: {sets: 4, reps: "6-10", intensity: 0.75}, 
        deadlift: {sets: 3, reps: "5-8", intensity: 0.72}
      },
      accessories: ["Adductor work (priority)", "Pause squats", "Tempo bench", "RDLs"]
    },
    phase2: {
      name: "STRENGTH",
      startDate: "2025-10-07",
      endDate: "2025-11-17",
      duration: "6 weeks",
      intensityRange: "80-90%",
      focus: "Strength development, power preparation",
      exercises: {
        squat: {sets: 4, reps: "3-6", intensity: 0.85},
        bench: {sets: 4, reps: "3-5", intensity: 0.87},
        deadlift: {sets: 3, reps: "2-5", intensity: 0.85}
      },
      accessories: ["Competition commands", "Heavy singles", "Speed work"]
    },
    phase3: {
      name: "POWER",
      startDate: "2025-11-18",
      endDate: "2025-12-29",
      duration: "6 weeks",
      intensityRange: "90-100%",
      focus: "Peak strength, competition commands",
      exercises: {
        squat: {sets: 5, reps: "1-3", intensity: 0.95},
        bench: {sets: 5, reps: "1-3", intensity: 0.95},
        deadlift: {sets: 4, reps: "1-3", intensity: 0.95}
      },
      accessories: ["Opener practice", "Competition timing", "Mental prep"]
    },
    phase4: {
      name: "PEAKING",
      startDate: "2025-12-30",
      endDate: "2026-03-30",
      duration: "12 weeks",
      intensityRange: "Competition prep",
      focus: "Opener/second/third attempts, deload",
      exercises: {
        squat: {sets: 4, reps: "1-2", intensity: 0.90},
        bench: {sets: 4, reps: "1-2", intensity: 0.90},
        deadlift: {sets: 3, reps: "1-2", intensity: 0.90}
      },
      accessories: ["Deload work", "Technical refinement", "Meet simulation"]
    }
  },
  
  // Weekly progress tracking
  weeklyProgress: {
    currentWeek: 1,
    totalWeeks: 30,
    completedSessions: [true, true, true, true, false, true, true], // P, W, Ś, C, P, S, N
    weeklyVolume: 12450
  }
};

let charts = {};
let firebaseUnsubscribe = null;
let autoDateUpdateInterval = null;
let isUpdatingFromFirebase = false;

// Timer variables
let workoutTimer = {
  isRunning: false,
  startTime: null,
  elapsed: 0,
  interval: null
};

let restTimer = {
  isRunning: false,
  duration: 0,
  remaining: 0,
  interval: null
};

// === ZEGAR ZURICH (Europe/Zurich) ===
function startZurichClock() {
  const dateFmt = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Zurich',
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const timeFmt = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Zurich',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const dateIsoFmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Zurich', year: 'numeric', month: '2-digit', day: '2-digit'
  });

  function tick() {
    const now = new Date();
    const nav = document.getElementById('nav-date');
    if (nav) nav.textContent = `${dateFmt.format(now)} • ${timeFmt.format(now)} (Zürich)`;

    // Utrzymuj currentDate w formacie YYYY-MM-DD zgodnie ze strefą Zurich:
    const ymd = dateIsoFmt.format(now); // np. 2025-08-25
    if (window.appData && window.appData.currentDate !== ymd) {
      window.appData.currentDate = ymd;
      if (typeof updateAllDateDependencies === 'function') {
        updateAllDateDependencies();
      }
    }
  }
  tick();
  setInterval(tick, 1000);
}


// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌸 Aitashii Powerlifting Tracker - COMPLETE VERSION initializing...');
  
  try {
    initializeAutoDateSystem();
    startZurichClock(); 
    setTimeout(() => {
      initializeFirebaseAuth();
      loadDataFromStorage();
      initializeNavigation();
      initializeForms();
      initializeTimers();
      initializeCharts();
      
      updateAllSections();
      
      console.log('✅ Complete Aitashii Powerlifting Tracker ready!');
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error initializing app:', error);
  }
});

// ==== AUTO-UPDATING DATE SYSTEM ====

function initializeAutoDateSystem() {
  console.log('📅 Initializing auto-date system (Zurich timezone)...');
  
  updateCurrentDateToNow();
  autoDateUpdateInterval = setInterval(updateCurrentDateToNow, 60000);
  
  console.log('📅 Auto-date system initialized');
}

function updateCurrentDateToNow() {
  const now = new Date();
  const zurichTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Zurich"}));
  const currentDateStr = zurichTime.toISOString().split('T')[0];
  
  if (appData.currentDate !== currentDateStr) {
    console.log(`📅 Date updated: ${appData.currentDate} → ${currentDateStr}`);
    appData.currentDate = currentDateStr;
    saveDataToStorage();
    updateAllSections();
  }
  
  updateDateDisplay();
}

function updateDateDisplay() {
  const currentDate = new Date(appData.currentDate);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Europe/Zurich'
  };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  
  const dateDisplay = document.getElementById('current-date-display');
  if (dateDisplay) {
    dateDisplay.textContent = formattedDate;
  }
}

// ==== FIREBASE AUTHENTICATION & SYNC ====

function initializeFirebaseAuth() {
  if (!window.firebaseAuth) {
    setTimeout(initializeFirebaseAuth, 500);
    return;
  }
  
  console.log('🔥 Initializing Firebase auth...');
  
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  const userAvatar = document.getElementById('user-avatar');
  
  window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
    if (user) {
      appData.syncStatus.user = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      };
      
      loginBtn.style.display = 'none';
      userInfo.style.display = 'flex';
      userAvatar.src = user.photoURL || '';
      userAvatar.alt = user.displayName || 'User';
      
      startFirebaseSync(user.uid);
      updateSyncStatus('🔥 Synced with Firebase', true);
      
    } else {
      appData.syncStatus.user = null;
      
      loginBtn.style.display = 'block';
      userInfo.style.display = 'none';
      
      stopFirebaseSync();
      updateSyncStatus('📱 Local mode', false);
    }
  });
  
  if (loginBtn) {
    loginBtn.addEventListener('click', signInWithGitHub);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', signOutUser);
  }
  
  console.log('🔐 Firebase auth initialized');
}

async function signInWithGitHub() {
  try {
    const provider = new window.firebaseGithubAuthProvider();
    provider.addScope('user:email');
    
    showNotification('🔐 Signing in...', 'info');
    
    await window.firebaseSignInWithPopup(window.firebaseAuth, provider);
    showNotification('✅ Signed in!', 'success');
    
  } catch (error) {
    console.error('❌ Sign in failed:', error);
    showNotification('❌ Sign in failed', 'error');
  }
}

async function signOutUser() {
  try {
    await window.firebaseSignOut(window.firebaseAuth);
    showNotification('👋 Signed out', 'info');
  } catch (error) {
    console.error('❌ Sign out failed:', error);
  }
}

function startFirebaseSync(userId) {
  if (!window.firebaseDb || !userId) return;
  
  console.log('🔄 Starting Firebase sync...');
  
  const userDocRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'data', 'appData');
  
  firebaseUnsubscribe = window.firebaseOnSnapshot(userDocRef, (doc) => {
    if (isUpdatingFromFirebase) return;
    
    if (doc.exists()) {
      const cloudData = doc.data();
      
      const cloudTime = new Date(cloudData.lastUpdated || 0).getTime();
      const localTime = new Date(appData.lastUpdated || 0).getTime();
      
      if (cloudTime > localTime + 1000) {
        console.log('📥 Receiving data from Firebase...');
        
        isUpdatingFromFirebase = true;
        appData = { ...appData, ...cloudData };
        
        updateAllSections();
        updateCharts();
        localStorage.setItem('aitashii-powerlifting-data', JSON.stringify(appData));
        
        showNotification('📥 Data synced', 'success');
        isUpdatingFromFirebase = false;
      }
    } else {
      uploadToFirebase(userId);
    }
  }, (error) => {
    console.error('❌ Firebase sync error:', error);
    updateSyncStatus('❌ Sync error', false);
  });
}

function stopFirebaseSync() {
  if (firebaseUnsubscribe) {
    firebaseUnsubscribe();
    firebaseUnsubscribe = null;
    console.log('🛑 Firebase sync stopped');
  }
}

async function uploadToFirebase(userId) {
  if (!window.firebaseDb || !userId || isUpdatingFromFirebase) return;
  
  try {
    const userDocRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'data', 'appData');
    
    const uploadData = {
      ...appData,
      lastUpdated: new Date().toISOString(),
      syncTimestamp: window.firebaseServerTimestamp()
    };
    
    await window.firebaseSetDoc(userDocRef, uploadData);
    console.log('✅ Data uploaded to Firebase');
    
  } catch (error) {
    console.error('❌ Firebase upload failed:', error);
  }
}

function updateSyncStatus(message, isOnline) {
  appData.syncStatus.isOnline = isOnline;
  appData.syncStatus.lastSync = new Date().toISOString();
  
  const syncStatus = document.getElementById('sync-status');
  if (syncStatus) {
    syncStatus.textContent = message;
    syncStatus.className = isOnline ? 'sync-status online' : 'sync-status offline';
  }
}

// Manual sync function (global)
window.manualSync = function() {
  if (!appData.syncStatus.user) {
    showNotification('❌ Not signed in', 'error');
    return;
  }
  
  showNotification('🔄 Syncing...', 'info');
  uploadToFirebase(appData.syncStatus.user.uid);
  
  setTimeout(() => {
    forceRefreshFromFirebase();
  }, 2000);
}

async function forceRefreshFromFirebase() {
  if (!window.firebaseDb || !appData.syncStatus.user) return;
  
  try {
    const userDocRef = window.firebaseDoc(window.firebaseDb, 'users', appData.syncStatus.user.uid, 'data', 'appData');
    const doc = await window.firebaseGetDoc(userDocRef);
    
    if (doc.exists()) {
      const cloudData = doc.data();
      
      if (cloudData.lastUpdated && cloudData.lastUpdated !== appData.lastUpdated) {
        isUpdatingFromFirebase = true;
        appData = { ...appData, ...cloudData };
        
        updateAllSections();
        updateCharts();
        localStorage.setItem('aitashii-powerlifting-data', JSON.stringify(appData));
        
        showNotification('✅ Synced!', 'success');
        isUpdatingFromFirebase = false;
      } else {
        showNotification('ℹ️ Data is current', 'info');
      }
    }
  } catch (error) {
    console.error('❌ Manual refresh failed:', error);
    showNotification('❌ Sync failed', 'error');
  }
}

// ==== DATA MANAGEMENT ====

function loadDataFromStorage() {
  try {
    const savedData = localStorage.getItem('aitashii-powerlifting-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      appData = { ...appData, ...parsed };
      console.log('📱 Data loaded from localStorage');
    }
  } catch (error) {
    console.error('❌ Error loading data:', error);
  }
}

function saveDataToStorage() {
  if (isUpdatingFromFirebase) return;
  
  try {
    appData.lastUpdated = new Date().toISOString();
    localStorage.setItem('aitashii-powerlifting-data', JSON.stringify(appData));
    
    if (appData.syncStatus.user && !isUpdatingFromFirebase) {
      uploadToFirebase(appData.syncStatus.user.uid);
    }
    
  } catch (error) {
    console.error('❌ Error saving data:', error);
  }
}

// ==== NAVIGATION ====

function initializeNavigation() {
  console.log('🧭 Initializing navigation...');
  
  // Desktop navigation
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      showSection(section);
      
      // Update active state
      navTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Mobile navigation
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const menuOverlay = document.getElementById('menu-overlay');
  const slidingMenu = document.getElementById('sliding-menu');
  const menuItems = document.querySelectorAll('.menu-item');
  
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      slidingMenu.classList.add('active');
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
  }
  
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }
  
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      showSection(section);
      closeMenu();
      
      menuItems.forEach(mi => mi.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  function closeMenu() {
    slidingMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  console.log('🧭 Navigation initialized');
}

function showSection(sectionName) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('section--active');
  });
  
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('section--active');
  }
  
  // Update specific sections when they become active
  if (sectionName === 'progress' && charts.prChart) {
    setTimeout(() => {
      charts.prChart.resize();
      if (charts.bodyChart) charts.bodyChart.resize();
    }, 100);
  }
  
  console.log(`📱 Showing section: ${sectionName}`);
}

// ==== TIMER SYSTEM ====

function initializeTimers() {
  console.log('⏰ Initializing timer system...');
  
  const startWorkoutBtn = document.getElementById('start-workout-timer');
  if (startWorkoutBtn) {
    startWorkoutBtn.addEventListener('click', toggleWorkoutTimer);
  }
  
  console.log('⏰ Timer system initialized');
}

function toggleWorkoutTimer() {
  if (workoutTimer.isRunning) {
    stopWorkoutTimer();
  } else {
    startWorkoutTimer();
  }
}

function startWorkoutTimer() {
  workoutTimer.isRunning = true;
  workoutTimer.startTime = Date.now() - workoutTimer.elapsed;
  
  const startBtn = document.getElementById('start-workout-timer');
  if (startBtn) {
    startBtn.textContent = 'Stop Timer';
    startBtn.classList.add('active');
  }
  
  workoutTimer.interval = setInterval(updateWorkoutTimer, 1000);
  
  showNotification('⏰ Workout timer started', 'success');
}

function stopWorkoutTimer() {
  workoutTimer.isRunning = false;
  
  if (workoutTimer.interval) {
    clearInterval(workoutTimer.interval);
    workoutTimer.interval = null;
  }
  
  const startBtn = document.getElementById('start-workout-timer');
  if (startBtn) {
    startBtn.textContent = 'Start Timer';
    startBtn.classList.remove('active');
  }
  
  showNotification('⏹️ Workout timer stopped', 'info');
}

function updateWorkoutTimer() {
  workoutTimer.elapsed = Date.now() - workoutTimer.startTime;
  
  const hours = Math.floor(workoutTimer.elapsed / 3600000);
  const minutes = Math.floor((workoutTimer.elapsed % 3600000) / 60000);
  const seconds = Math.floor((workoutTimer.elapsed % 60000) / 1000);
  
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const timerDisplay = document.getElementById('workout-timer');
  if (timerDisplay) {
    timerDisplay.textContent = timeString;
  }
}

// Rest timer functions (global)
window.startRestTimer = function(seconds) {
  if (restTimer.isRunning) {
    stopRestTimer();
  }
  
  restTimer.isRunning = true;
  restTimer.duration = seconds;
  restTimer.remaining = seconds;
  
  const restDisplay = document.getElementById('rest-timer-display');
  if (restDisplay) {
    restDisplay.classList.add('active');
  }
  
  restTimer.interval = setInterval(updateRestTimer, 1000);
  
  showNotification(`⏰ Rest timer: ${Math.floor(seconds/60)}:${(seconds%60).toString().padStart(2,'0')}`, 'info');
}

window.stopRestTimer = function() {
  restTimer.isRunning = false;
  
  if (restTimer.interval) {
    clearInterval(restTimer.interval);
    restTimer.interval = null;
  }
  
  const restDisplay = document.getElementById('rest-timer-display');
  if (restDisplay) {
    restDisplay.classList.remove('active');
  }
}

function updateRestTimer() {
  restTimer.remaining--;
  
  const minutes = Math.floor(restTimer.remaining / 60);
  const seconds = restTimer.remaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const countdown = document.getElementById('rest-timer-countdown');
  if (countdown) {
    countdown.textContent = timeString;
  }
  
  if (restTimer.remaining <= 0) {
    stopRestTimer();
    showNotification('🔔 Rest time finished!', 'success');
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }
}

// ==== DASHBOARD UPDATES ====

function updateAllSections() {
  updateDashboard();
  updateTodaysWorkout();
  updateTrainingSchedule();
  updateMeasurementsDisplay();
  updateCycleDisplay();
  updateNutritionDisplay();
  updateDataSummary();
}

function updateDashboard() {
  updatePRCards();
  updateBodyCompositionCard();
  updateTodaysWorkoutCard();
  updateCycleCard();
  updateWeeklyProgressCard();
  updateNutritionCard();
  updateTechCard();
  updateCompetitionCard();
}

function updatePRCards() {
  // Current phase
  const currentPhase = getCurrentTrainingPhase();
  const phaseBadge = document.getElementById('current-phase-badge');
  if (phaseBadge && currentPhase) {
    phaseBadge.textContent = `Phase ${getPhaseNumber(currentPhase)}: ${currentPhase.name.split(' ')[0]}`;
  }
  
  // PR values
  const exercises = ['squat', 'bench', 'deadlift'];
  exercises.forEach(exercise => {
    const pr = appData.currentPRs[exercise];
    if (pr) {
      const valueEl = document.getElementById(`${exercise}-pr-value`);
      const dateEl = document.getElementById(`${exercise}-pr-date`);
      
      if (valueEl) {
        valueEl.textContent = pr.reps > 1 ? `${pr.weight}kg x${pr.reps}` : `${pr.weight}kg x1`;
      }
      
      if (dateEl) {
        dateEl.textContent = formatDateShort(pr.date);
      }
    }
  });
}

function updateBodyCompositionCard() {
  // Update target badge
  const targetBadge = document.querySelector('.target-badge');
  if (targetBadge) {
    targetBadge.textContent = `${appData.bodyGoals.current.weight}kg → ${appData.bodyGoals.target.weight}kg`;
  }
  
  // Values are already set in HTML, but we could update them dynamically here if needed
}

function updateTodaysWorkoutCard() {
  const currentDate = new Date(appData.currentDate);
  const dayOfWeek = currentDate.getDay();
  const isRestDay = dayOfWeek === 5; // Friday
  
  const dayBadge = document.getElementById('day-type-badge');
  const workoutSummary = document.getElementById('workout-summary');
  
  if (isRestDay) {
    if (dayBadge) {
      dayBadge.textContent = 'Rest Day';
      dayBadge.className = 'day-badge rest';
    }
    
    if (workoutSummary) {
      workoutSummary.innerHTML = `
        <div class="workout-exercise">
          <span class="exercise-name">Mobility & Stretching</span>
        </div>
        <div class="workout-exercise">
          <span class="exercise-name">Adductor focus work</span>
        </div>
        <div class="workout-exercise">
          <span class="exercise-name">Recovery activities</span>
        </div>
      `;
    }
  } else {
    if (dayBadge) {
      dayBadge.textContent = 'Training Day';
      dayBadge.className = 'day-badge training';
    }
    
    const currentPhase = getCurrentTrainingPhase();
    if (currentPhase && workoutSummary) {
      const squatWeight = Math.round(appData.currentPRs.squat.estimated1RM * currentPhase.exercises.squat.intensity);
      const benchWeight = Math.round(appData.currentPRs.bench.estimated1RM * currentPhase.exercises.bench.intensity);
      const deadliftWeight = Math.round(appData.currentPRs.deadlift.estimated1RM * currentPhase.exercises.deadlift.intensity);
      
      workoutSummary.innerHTML = `
        <div class="workout-exercise">
          <span class="exercise-name">Squat: ${currentPhase.exercises.squat.sets}x${currentPhase.exercises.squat.reps} @ ${squatWeight}kg (${Math.round(currentPhase.exercises.squat.intensity*100)}%)</span>
        </div>
        <div class="workout-exercise">
          <span class="exercise-name">Bench: ${currentPhase.exercises.bench.sets}x${currentPhase.exercises.bench.reps} @ ${benchWeight}kg (${Math.round(currentPhase.exercises.bench.intensity*100)}%)</span>
        </div>
        <div class="workout-exercise">
          <span class="exercise-name">Deadlift: ${currentPhase.exercises.deadlift.sets}x${currentPhase.exercises.deadlift.reps} @ ${deadliftWeight}kg (${Math.round(currentPhase.exercises.deadlift.intensity*100)}%)</span>
        </div>
        <div class="workout-exercise priority">
          <span class="exercise-name">Accessories: ${currentPhase.accessories[0]}</span>
        </div>
      `;
    }
  }
}

function updateCycleCard() {
  const currentDate = new Date(appData.currentDate);
  const lastPeriodStart = new Date(appData.menstrualCycle.lastPeriodStart);
  const daysSinceLastPeriod = Math.floor((currentDate - lastPeriodStart) / (1000 * 60 * 60 * 24));
  const cycleDay = (daysSinceLastPeriod % appData.menstrualCycle.cycleLength) + 1;
  
  let phase, energy;
  
  if (cycleDay <= appData.menstrualCycle.periodLength) {
    phase = "Menstrual";
    energy = "Low";
  } else if (cycleDay <= 14) {
    phase = "Follicular";
    energy = "High";
  } else if (cycleDay <= 21) {
    phase = "Luteal Early";
    energy = "High";
  } else {
    phase = "Luteal Late";
    energy = "Medium";
  }
  
  const phaseBadge = document.getElementById('cycle-phase-badge');
  const cycleDayValue = document.getElementById('cycle-day-value');
  const trainingEnergy = document.getElementById('training-energy');
  const lastPeriodDate = document.getElementById('last-period-date');
  
  if (phaseBadge) {
    phaseBadge.textContent = `${phase} Phase`;
    phaseBadge.className = `phase-badge ${phase.toLowerCase().replace(' ', '-')}`;
  }
  
  if (cycleDayValue) cycleDayValue.textContent = cycleDay;
  if (trainingEnergy) {
    trainingEnergy.textContent = energy;
    trainingEnergy.className = `cycle-value ${energy.toLowerCase()}`;
  }
  if (lastPeriodDate) lastPeriodDate.textContent = formatDateShort(appData.menstrualCycle.lastPeriodStart);
}

function updateWeeklyProgressCard() {
  // This is mostly static data for now, but could be made dynamic
  const progressCircles = document.querySelectorAll('.progress-circle');
  const completedSessions = appData.weeklyProgress.completedSessions;
  
  progressCircles.forEach((circle, index) => {
    if (index < completedSessions.length) {
      if (completedSessions[index]) {
        circle.classList.add('completed');
        circle.classList.remove('rest');
      } else if (index === 4) { // Friday is rest day
        circle.classList.add('rest');
        circle.classList.remove('completed');
      }
    }
  });
}

function updateNutritionCard() {
  const currentDate = new Date(appData.currentDate);
  const dayOfWeek = currentDate.getDay();
  const isRestDay = dayOfWeek === 5;
  
  const nutritionDayBadge = document.getElementById('nutrition-day-badge');
  
  if (nutritionDayBadge) {
    if (isRestDay) {
      nutritionDayBadge.textContent = 'Rest Day';
      nutritionDayBadge.className = 'day-badge rest';
    } else {
      nutritionDayBadge.textContent = 'Training Day';
      nutritionDayBadge.className = 'day-badge training';
    }
  }
  
  // Update nutrition values based on training day
  const nutritionItems = document.querySelectorAll('.nutrition-item .nutrition-value');
  if (nutritionItems.length >= 3) {
    if (isRestDay) {
      nutritionItems[0].textContent = '2200'; // Calories
      nutritionItems[1].textContent = '160g'; // Protein
      nutritionItems[2].textContent = '250g'; // Carbs
    } else {
      nutritionItems[0].textContent = '2500'; // Calories
      nutritionItems[1].textContent = '180g'; // Protein
      nutritionItems[2].textContent = '280g'; // Carbs
    }
  }
}

function updateTechCard() {
  // Static for now - could be made dynamic based on performance metrics
}

function updateCompetitionCard() {
  const currentDate = new Date(appData.currentDate);
  const competitionDate = new Date('2026-03-30');
  const daysToCompetition = Math.ceil((competitionDate - currentDate) / (1000 * 60 * 60 * 24));
  const weeksToCompetition = Math.ceil(daysToCompetition / 7);
  
  const countdownNumber = document.querySelector('.countdown-number');
  const countdownSecondary = document.querySelectorAll('.countdown-number')[1];
  
  if (countdownNumber) countdownNumber.textContent = daysToCompetition;
  if (countdownSecondary) countdownSecondary.textContent = weeksToCompetition;
}

function updateTodaysWorkout() {
  // Update the detailed today's workout section
  const currentDate = new Date(appData.currentDate);
  const currentPhase = getCurrentTrainingPhase();
  
  if (currentPhase) {
    // Update intensities in the workout section
    const intensityBadges = document.querySelectorAll('.intensity-badge');
    if (intensityBadges.length >= 2) {
      const squatWeight = Math.round(appData.currentPRs.squat.estimated1RM * currentPhase.exercises.squat.intensity);
      const benchWeight = Math.round(appData.currentPRs.bench.estimated1RM * currentPhase.exercises.bench.intensity);
      
      intensityBadges[0].textContent = `70% (${squatWeight}kg)`;
      intensityBadges[1].textContent = `65% (${benchWeight}kg)`;
    }
  }
}

function updateTrainingSchedule() {
  // Update active day in calendar
  const currentDate = new Date(appData.currentDate);
  const currentDay = currentDate.getDay();
  
  const dayCards = document.querySelectorAll('.day-card');
  dayCards.forEach((card, index) => {
    card.classList.remove('active');
    if (index === currentDay) {
      card.classList.add('active');
    }
  });
}

function updateMeasurementsDisplay() {
  const currentStats = document.getElementById('current-stats');
  if (currentStats && appData.measurements.length > 0) {
    const latest = appData.measurements[appData.measurements.length - 1];
    
    currentStats.innerHTML = `
      <div class="stat-item">
        <div class="stat-label">Weight</div>
        <div class="stat-value">${latest.weight}kg</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Body Fat</div>
        <div class="stat-value">${latest.bodyFat}%</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Muscle Mass</div>
        <div class="stat-value">${latest.muscle}kg</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Fat Mass</div>
        <div class="stat-value">${latest.fatMass}kg</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Body Water</div>
        <div class="stat-value">${latest.bodyWater}kg</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Last Updated</div>
        <div class="stat-value">${formatDateShort(latest.date)}</div>
      </div>
    `;
  }
}

function updateCycleDisplay() {
  const cycleStatus = document.getElementById('cycle-status');
  if (cycleStatus) {
    const currentDate = new Date(appData.currentDate);
    const lastPeriodStart = new Date(appData.menstrualCycle.lastPeriodStart);
    const daysSinceLastPeriod = Math.floor((currentDate - lastPeriodStart) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceLastPeriod % appData.menstrualCycle.cycleLength) + 1;
    
    let phase, recommendation;
    
    if (cycleDay <= appData.menstrualCycle.periodLength) {
      phase = "Menstrual";
      recommendation = "Light training, listen to your body 🌙";
    } else if (cycleDay <= 14) {
      phase = "Follicular";
      recommendation = "High energy - great time for intense training! 💪";
    } else if (cycleDay <= 21) {
      phase = "Luteal Early";
      recommendation = "Optimal strength - perfect for heavy lifts! 🏋️‍♀️";
    } else {
      phase = "Luteal Late";
      recommendation = "May feel harder - focus on technique and volume 🎯";
    }
    
    cycleStatus.innerHTML = `
      <div class="cycle-item">
        <div class="cycle-label">Current Phase</div>
        <div class="cycle-value">${phase}</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">Cycle Day</div>
        <div class="cycle-value">${cycleDay}/28</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">Days Since Period</div>
        <div class="cycle-value">${daysSinceLastPeriod} days</div>
      </div>
      <div class="cycle-recommendation">
        <strong>Training Recommendation:</strong><br>
        ${recommendation}
      </div>
    `;
  }
}

function updateNutritionDisplay() {
  const nutritionTargets = document.getElementById('nutrition-targets-detailed');
  if (nutritionTargets) {
    const currentDate = new Date(appData.currentDate);
    const dayOfWeek = currentDate.getDay();
    const isRestDay = dayOfWeek === 5;
    
    const calories = isRestDay ? 2200 : 2500;
    const protein = isRestDay ? 160 : 180;
    const carbs = isRestDay ? 250 : 280;
    const fat = isRestDay ? 70 : 85;
    
    nutritionTargets.innerHTML = `
      <div class="nutrition-grid">
        <div class="nutrition-item">
          <div class="nutrition-label">Calories</div>
          <div class="nutrition-value">${calories} kcal</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-label">Protein</div>
          <div class="nutrition-value">${protein}g</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-label">Carbs</div>
          <div class="nutrition-value">${carbs}g</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-label">Fat</div>
          <div class="nutrition-value">${fat}g</div>
        </div>
      </div>
      
      <div class="nutrition-tips">
        <h4>${isRestDay ? 'Rest Day Tips' : 'Training Day Tips'}</h4>
        <p>${isRestDay ? 
          'Maintain stable blood sugar. Focus on quality protein sources and healthy fats.' :
          'Increase carb intake 2-3h before training. Post-workout: 25-30g protein + simple carbs.'
        }</p>
        <div class="shake-info">
          <strong>My protein shake:</strong> 278 kcal, 53.5g protein
        </div>
      </div>
    `;
  }
  
  // Update day type badge
  const nutritionDayType = document.getElementById('nutrition-day-type');
  if (nutritionDayType) {
    const isRestDay = new Date(appData.currentDate).getDay() === 5;
    nutritionDayType.textContent = isRestDay ? 'Rest Day' : 'Training Day';
    nutritionDayType.className = isRestDay ? 'day-badge rest' : 'day-badge training';
  }
}

function updateDataSummary() {
  const dataSummary = document.getElementById('data-summary');
  if (dataSummary) {
    const totalWorkouts = Object.values(appData.prHistory).reduce((sum, history) => sum + history.length, 0);
    const measurementCount = appData.measurements.length;
    const currentPhase = getCurrentTrainingPhase();
    
    dataSummary.innerHTML = `
      <div class="summary-item">
        <div class="summary-label">Total Workouts Recorded</div>
        <div class="summary-value">${totalWorkouts}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Body Measurements</div>
        <div class="summary-value">${measurementCount}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Current Phase</div>
        <div class="summary-value">${currentPhase ? currentPhase.name : 'None'}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Data Quality</div>
        <div class="summary-value">Complete</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Last Updated</div>
        <div class="summary-value">${appData.lastUpdated ? formatDateShort(appData.lastUpdated.split('T')[0]) : 'Never'}</div>
      </div>
    `;
  }
}

// ==== FORMS ====

function initializeForms() {
  console.log('📝 Initializing forms...');
  
  // PR Form
  const prForm = document.getElementById('pr-form');
  if (prForm) {
    prForm.addEventListener('submit', handlePRSubmit);
    
    // Update estimated 1RM on weight/reps change
    const weightInput = document.getElementById('pr-weight');
    const repsInput = document.getElementById('pr-reps');
    
    if (weightInput && repsInput) {
      [weightInput, repsInput].forEach(input => {
        input.addEventListener('input', updateEstimated1RM);
      });
    }
  }
  
  // Measurements Form
  const measurementsForm = document.getElementById('measurements-form');
  if (measurementsForm) {
    measurementsForm.addEventListener('submit', handleMeasurementSubmit);
  }
  
  // Cycle Form
  const cycleForm = document.getElementById('cycle-form');
  if (cycleForm) {
    cycleForm.addEventListener('submit', handleCycleSubmit);
  }
  
  // Export buttons
  const exportCompleteBtn = document.getElementById('export-complete-btn');
  const exportCoachBtn = document.getElementById('export-coach-btn');
  
  if (exportCompleteBtn) {
    exportCompleteBtn.addEventListener('click', exportCompleteData);
  }
  
  if (exportCoachBtn) {
    exportCoachBtn.addEventListener('click', exportCoachData);
  }
  
  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  const prDate = document.getElementById('pr-date');
  const measurementDate = document.getElementById('measurement-date');
  
  if (prDate) prDate.value = today;
  if (measurementDate) measurementDate.value = today;
  
  console.log('📝 Forms initialized');
}

function handlePRSubmit(e) {
  e.preventDefault();
  
  const exercise = document.getElementById('pr-exercise').value;
  const weight = parseFloat(document.getElementById('pr-weight').value);
  const reps = parseInt(document.getElementById('pr-reps').value);
  const date = document.getElementById('pr-date').value;
  
  if (exercise && weight && reps && date) {
    const estimated1RM = weight * (1 + reps / 30);
    
    const newPR = {
      weight: weight,
      reps: reps,
      date: date,
      estimated1RM: Math.round(estimated1RM * 10) / 10
    };
    
    // Update current PRs
    appData.currentPRs[exercise] = newPR;
    
    // Add to history
    if (!appData.prHistory[exercise]) {
      appData.prHistory[exercise] = [];
    }
    appData.prHistory[exercise].push(newPR);
    appData.prHistory[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    saveDataToStorage();
    updateAllSections();
    updateCharts();
    
    // Reset form
    document.getElementById('pr-form').reset();
    document.getElementById('pr-date').value = new Date().toISOString().split('T')[0];
    
    showNotification(`🏆 New ${exercise} PR added!`, 'success');
    
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  }
}

function handleMeasurementSubmit(e) {
  e.preventDefault();
  
  const date = document.getElementById('measurement-date').value;
  const weight = parseFloat(document.getElementById('measurement-weight').value);
  const bodyFat = parseFloat(document.getElementById('measurement-bodyfat').value);
  const muscle = parseFloat(document.getElementById('measurement-muscle').value);
  const fatMass = parseFloat(document.getElementById('measurement-fatmass').value);
  const bodyWater = parseFloat(document.getElementById('measurement-bodywater').value);
  
  const newMeasurement = {
    date: date,
    weight: weight,
    bodyFat: bodyFat,
    muscle: muscle,
    fatMass: fatMass,
    bodyWater: bodyWater
  };
  
  appData.measurements.push(newMeasurement);
  appData.measurements.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Update current body goals
  const latest = appData.measurements[appData.measurements.length - 1];
  appData.bodyGoals.current = {
    weight: latest.weight,
    bodyFat: latest.bodyFat,
    fatMass: latest.fatMass,
    muscleMass: latest.muscle,
    bodyWater: latest.bodyWater
  };
  
  saveDataToStorage();
  updateAllSections();
  updateCharts();
  
  document.getElementById('measurements-form').reset();
  document.getElementById('measurement-date').value = new Date().toISOString().split('T')[0];
  
  showNotification('📊 New measurement added!', 'success');
}

function handleCycleSubmit(e) {
  e.preventDefault();
  
  const periodStart = document.getElementById('period-start').value;
  const periodEnd = document.getElementById('period-end').value;
  const cycleLength = parseInt(document.getElementById('cycle-length').value);
  
  if (periodStart && periodEnd && cycleLength) {
    appData.menstrualCycle.lastPeriodStart = periodStart;
    appData.menstrualCycle.lastPeriodEnd = periodEnd;
    appData.menstrualCycle.cycleLength = cycleLength;
    
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    const periodLength = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    appData.menstrualCycle.periodLength = periodLength;
    
    saveDataToStorage();
    updateAllSections();
    
    document.getElementById('cycle-form').reset();
    
    showNotification('🌙 Cycle updated!', 'success');
  }
}

function updateEstimated1RM() {
  const weight = parseFloat(document.getElementById('pr-weight').value) || 0;
  const reps = parseInt(document.getElementById('pr-reps').value) || 1;
  
  if (weight > 0) {
    const estimated1RM = weight * (1 + reps / 30);
    const display = document.getElementById('estimated-1rm');
    
    if (display) {
      display.textContent = `${Math.round(estimated1RM * 10) / 10}kg`;
    }
  }
}

function exportCompleteData() {
  const exportData = {
    exportType: 'complete-data',
    appName: 'Aitashii Powerlifting Tracker',
    version: appData.version,
    exportDate: new Date().toISOString(),
    userData: {
      currentPRs: appData.currentPRs,
      measurements: appData.measurements,
      bodyGoals: appData.bodyGoals,
      menstrualCycle: appData.menstrualCycle,
      prHistory: appData.prHistory,
      trainingPhases: appData.trainingPhases,
      weeklyProgress: appData.weeklyProgress,
      currentDate: appData.currentDate
    }
  };
  
  const fileName = `Aitashii-complete-export-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-')}.json`;
  downloadJsonFile(JSON.stringify(exportData, null, 2), fileName);
  
  showNotification('📊 Complete data exported!', 'success');
}

function exportCoachData() {
  const currentPhase = getCurrentTrainingPhase();
  
  const coachData = {
    exportType: 'coach-analysis',
    appName: 'Aitashii Powerlifting Tracker',
    version: appData.version,
    exportDate: new Date().toISOString(),
    
    // Current status
    currentStatus: {
      date: appData.currentDate,
      phase: currentPhase ? currentPhase.name : null,
      PRs: appData.currentPRs,
      bodyComposition: appData.bodyGoals.current,
      menstrualCycle: {
        lastPeriodStart: appData.menstrualCycle.lastPeriodStart,
        cycleLength: appData.menstrualCycle.cycleLength
      }
    },
    
    // Progress data
    progressData: {
      prHistory: appData.prHistory,
      measurementsHistory: appData.measurements,
      bodyGoals: appData.bodyGoals
    },
    
    // Training analysis
    trainingAnalysis: {
      currentPhase: currentPhase,
      trainingPhases: appData.trainingPhases,
      weeklyProgress: appData.weeklyProgress
    },
    
    // Recommendations needed
    coachNotes: "Analyze progress and provide recommendations for next phase"
  };
  
  const fileName = `Aitashii-coach-analysis-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-')}.json`;
  downloadJsonFile(JSON.stringify(coachData, null, 2), fileName);
  
  showNotification('👩‍💼 Coach analysis exported!', 'success');
}

function downloadJsonFile(jsonString, fileName) {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}

// ==== CHARTS ====

function initializeCharts() {
  console.log('📊 Initializing charts...');
  
  try {
    setTimeout(() => {
      initializePRChart();
      initializeBodyCompositionChart();
    }, 100);
  } catch (error) {
    console.error('❌ Error initializing charts:', error);
  }
}

function initializePRChart() {
  const ctx = document.getElementById('pr-chart');
  if (!ctx) return;
  
  const datasets = [];
  
  ['squat', 'bench', 'deadlift'].forEach((exercise, index) => {
    const history = appData.prHistory[exercise] || [];
    if (history.length > 0) {
      const colors = ['#4ade80', '#60a5fa', '#f472b6'];
      datasets.push({
        label: exercise.charAt(0).toUpperCase() + exercise.slice(1),
        data: history.map(pr => ({
          x: pr.date,
          y: pr.estimated1RM
        })),
        borderColor: colors[index],
        backgroundColor: colors[index] + '20',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      });
    }
  });
  
  if (datasets.length === 0) return;
  
  charts.prChart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '🏆 Strength Progress (Estimated 1RM)',
          color: '#e5e7eb'
        },
        legend: {
          labels: {
            color: '#e5e7eb'
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          ticks: {
            color: '#9ca3af'
          },
          grid: {
            color: '#374151'
          }
        },
        y: {
          beginAtZero: false,
          ticks: {
            color: '#9ca3af'
          },
          grid: {
            color: '#374151'
          }
        }
      }
    }
  });
}

function initializeBodyCompositionChart() {
  const ctx = document.getElementById('body-composition-chart');
  if (!ctx || appData.measurements.length === 0) return;
  
  charts.bodyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: appData.measurements.map(m => m.date),
      datasets: [
        {
          label: 'Weight (kg)',
          data: appData.measurements.map(m => m.weight),
          borderColor: '#4ade80',
          backgroundColor: '#4ade8020',
          tension: 0.4
        },
        {
          label: 'Muscle Mass (kg)',
          data: appData.measurements.map(m => m.muscle),
          borderColor: '#60a5fa',
          backgroundColor: '#60a5fa20',
          tension: 0.4
        },
        {
          label: 'Fat Mass (kg)',
          data: appData.measurements.map(m => m.fatMass),
          borderColor: '#f472b6',
          backgroundColor: '#f472b620',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '📊 Body Composition Progress',
          color: '#e5e7eb'
        },
        legend: {
          labels: {
            color: '#e5e7eb'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#9ca3af'
          },
          grid: {
            color: '#374151'
          }
        },
        y: {
          beginAtZero: false,
          ticks: {
            color: '#9ca3af'
          },
          grid: {
            color: '#374151'
          }
        }
      }
    }
  });
}

function updateCharts() {
  if (charts.prChart) {
    const datasets = [];
    
    ['squat', 'bench', 'deadlift'].forEach((exercise, index) => {
      const history = appData.prHistory[exercise] || [];
      if (history.length > 0) {
        const colors = ['#4ade80', '#60a5fa', '#f472b6'];
        datasets.push({
          label: exercise.charAt(0).toUpperCase() + exercise.slice(1),
          data: history.map(pr => ({
            x: pr.date,
            y: pr.estimated1RM
          })),
          borderColor: colors[index],
          backgroundColor: colors[index] + '20',
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8
        });
      }
    });
    
    charts.prChart.data.datasets = datasets;
    charts.prChart.update();
  }
  
  if (charts.bodyChart && appData.measurements.length > 0) {
    charts.bodyChart.data.labels = appData.measurements.map(m => m.date);
    charts.bodyChart.data.datasets[0].data = appData.measurements.map(m => m.weight);
    charts.bodyChart.data.datasets[1].data = appData.measurements.map(m => m.muscle);
    charts.bodyChart.data.datasets[2].data = appData.measurements.map(m => m.fatMass);
    charts.bodyChart.update();
  }
}

// ==== UTILITY FUNCTIONS ====

function getCurrentTrainingPhase() {
  const currentDate = new Date(appData.currentDate);
  
  for (const phase of Object.values(appData.trainingPhases)) {
    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);
    
    if (currentDate >= startDate && currentDate <= endDate) {
      return phase;
    }
  }
  
  return appData.trainingPhases.phase1; // Default to phase 1
}

function getPhaseNumber(phase) {
  const phaseNames = Object.keys(appData.trainingPhases);
  for (let i = 0; i < phaseNames.length; i++) {
    if (appData.trainingPhases[phaseNames[i]] === phase) {
      return i + 1;
    }
  }
  return 1;
}

function formatDateShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
}

// ==== NOTIFICATIONS ====

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Show with animation
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

// ==== GLOBAL FUNCTIONS ====

// Calendar navigation (global)
window.changeCalendarMonth = function(direction) {
  // This would update the calendar view
  console.log('📅 Calendar navigation:', direction > 0 ? 'next' : 'previous');
  showNotification('📅 Calendar navigation - feature coming soon!', 'info');
}

// Initialize on window load
window.addEventListener('load', function() {
  console.log('🌸 Window loaded, finalizing setup...');
  
  setTimeout(() => {
    updateAllSections();
    updateCharts();
  }, 500);
  
  console.log('🎉 Aitashii Powerlifting Tracker - COMPLETE VERSION ready!');
});
