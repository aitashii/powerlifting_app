// 🌸🐱 Aitashii Powerlifting Tracker - FIXED VERSION
// Fixed: Calendar clicks, Auto-updating date, Firebase auth

let appData = {
  version: '2.1.0',
  lastUpdated: null,
  currentDate: "2025-08-25", // Will be auto-updated
  
  // Firebase sync status
  syncStatus: {
    isOnline: false,
    lastSync: null,
    user: null
  },
  
  // Simplified backup (no notifications)
  autoBackup: {
    changesCount: 0,
    maxChanges: 3,
    autoDownload: false,
    lastBackup: null
  },
  
  currentPRs: {
    squat: { weight: 40, reps: 5, date: "2025-08-23", estimated1RM: 45 },
    bench: { weight: 45, reps: 1, date: "2025-08-23", estimated1RM: 45 },
    deadlift: { weight: 90, reps: 1, date: "2025-07-31", estimated1RM: 90 }
  },
  
  // FIXED: Real measurements from 19.08.2025
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
      bodyFat: 20,
      fatMass: 13.0,
      muscleMass: 32.7,
      bodyWater: 43.1
    },
    changes: {
      fatLoss: 19.7,
      muscleGain: 5.6,
      waterGain: 5.4,
      netWeightLoss: 12.1
    }
  },
  
  menstrualCycle: {
    lastPeriodStart: "2025-08-20",
    lastPeriodEnd: "2025-08-25", 
    periodLength: 6,
    cycleLength: 28
  },
  
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
  
  trainingPhases: {
    phase1: {
      name: "HYPERTROPHY + REHAB",
      startDate: "2025-08-25",
      endDate: "2025-10-06",
      duration: "6 weeks",
      intensityRange: "65-80%",
      focus: "Objętość, technika, wzmacnianie przywodzicieli",
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
      focus: "Rozwój siły, przygotowanie do fazy mocy",
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
      focus: "Szczytowa siła, komendy zawodowe",
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
  }
};

let charts = {};
let firebaseUnsubscribe = null;
let autoDateUpdateInterval = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌸 Aitashii Powerlifting Tracker with AUTO-DATE initializing...');
  
  try {
    // Initialize auto-updating date system FIRST
    initializeAutoDateSystem();
    
    // Initialize Firebase auth
    setTimeout(() => {
      initializeFirebaseAuth();
      
      // Then initialize rest of app
      loadDataFromStorage();
      initializeHamburgerMenuFixed();
      initializeAutoBackup();
      initializeForms();
      initializeCharts();
      initializeTrainingCalendarFixed(); // FIXED VERSION
      
      updateDashboard();
      updateAllDateDependencies();
      
      console.log('✅ Aitashii Powerlifting Tracker with AUTO-DATE ready!');
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error initializing app:', error);
  }
});

// ==== AUTO-UPDATING DATE SYSTEM (Zurich Timezone) ====

function initializeAutoDateSystem() {
  console.log('📅 Initializing AUTO-UPDATING date system (Zurich timezone)...');
  
  // Update date immediately
  updateCurrentDateToNow();
  
  // Update every minute
  autoDateUpdateInterval = setInterval(() => {
    updateCurrentDateToNow();
  }, 60000); // Every 60 seconds
  
  console.log('📅 Auto-updating date system initialized');
}

function updateCurrentDateToNow() {
  // Get current date in Zurich timezone
  const now = new Date();
  const zurichTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Zurich"}));
  const currentDateStr = zurichTime.toISOString().split('T')[0];
  
  // Only update if date actually changed
  if (appData.currentDate !== currentDateStr) {
    console.log(`📅 Auto date update: ${appData.currentDate} → ${currentDateStr}`);
    
    appData.currentDate = currentDateStr;
    saveDataToStorage();
    updateAllDateDependencies();
  }
  
  // Always update time display
  updateTimeDisplay(zurichTime);
}

function updateTimeDisplay(zurichTime) {
  const timeString = zurichTime.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Zurich'
  });
  
  const dateInfo = document.getElementById('date-info');
  if (dateInfo) {
    const formattedDate = formatDatePolish(appData.currentDate);
    const dayOfWeek = getDayOfWeekPolish(new Date(appData.currentDate));
    dateInfo.textContent = `${dayOfWeek}, ${formattedDate} • ${timeString}`;
  }
}

// Helper function for "Today" button (now just refreshes display)
window.setToday = function() {
  updateCurrentDateToNow();
}

// ==== FIREBASE AUTHENTICATION & SYNC (FIXED) ====

function initializeFirebaseAuth() {
  if (!window.firebaseAuth) {
    console.warn('⚠️ Firebase not yet available, retrying...');
    setTimeout(initializeFirebaseAuth, 500);
    return;
  }
  
  console.log('🔥 Initializing FIXED Firebase authentication...');
  
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  const userAvatar = document.getElementById('user-avatar');
  
  // Setup auth state listener
  window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
    console.log('🔐 Auth state changed:', user ? 'Logged in' : 'Logged out');
    
    if (user) {
      // User is signed in
      appData.syncStatus.user = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      };
      
      // Update UI
      loginBtn.style.display = 'none';
      userInfo.style.display = 'flex';
      userAvatar.src = user.photoURL || '';
      userAvatar.alt = user.displayName || 'User';
      
      // Start Firebase sync
      startFirebaseSync(user.uid);
      updateSyncStatus('🔥 Zsynchronizowano z Firebase', true);
      
    } else {
      // User is signed out
      appData.syncStatus.user = null;
      
      // Update UI
      loginBtn.style.display = 'block';
      userInfo.style.display = 'none';
      
      // Stop Firebase sync
      stopFirebaseSync();
      updateSyncStatus('📱 Tryb lokalny', false);
    }
  });
  
  // Setup login button with BETTER ERROR HANDLING
  if (loginBtn) {
    loginBtn.addEventListener('click', signInWithGitHubFixed);
  }
  
  // Setup logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', signOutUser);
  }
  
  console.log('🔐 FIXED Firebase auth initialized');
}

async function signInWithGitHubFixed() {
  try {
    console.log('🔐 Attempting GitHub login...');
    
    const provider = new window.firebaseGithubAuthProvider();
    provider.addScope('user:email');
    
    // Add custom parameters to help with popup
    provider.setCustomParameters({
      allow_signup: 'true'
    });
    
    showSaveIndicator('🔐 Logowanie...', '#3b82f6');
    
    // Use popup with specific settings
    const result = await window.firebaseSignInWithPopup(window.firebaseAuth, provider);
    console.log('✅ GitHub login successful:', result.user.displayName);
    
    showSaveIndicator('✅ Zalogowano!', '#22c55e');
    
  } catch (error) {
    console.error('❌ GitHub login failed:', error);
    
    // More specific error messages
    let errorMessage = 'Nieznany błąd';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Popup zamknięty przez użytkownika';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup zablokowany przez przeglądarkę';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Anulowano żądanie logowania';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'Domena nie jest autoryzowana';
    }
    
    console.error('Detailed error:', errorMessage, error.code);
    showSaveIndicator(`❌ ${errorMessage}`, '#ef4444');
    
    // Try to help debug
    if (error.code === 'auth/unauthorized-domain') {
      console.error('🔧 Add this domain to Firebase Auth: aitashii.github.io');
    }
  }
}

async function signOutUser() {
  try {
    await window.firebaseSignOut(window.firebaseAuth);
    showSaveIndicator('👋 Wylogowano', '#6b7280');
    console.log('✅ User signed out');
  } catch (error) {
    console.error('❌ Sign out failed:', error);
  }
}

function startFirebaseSync(userId) {
  if (!window.firebaseDb || !userId) return;
  
  console.log('🔄 Starting Firebase sync for user:', userId);
  
  const userDocRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'data', 'appData');
  
  // Listen for real-time updates
  firebaseUnsubscribe = window.firebaseOnSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const cloudData = doc.data();
      
      // Only update if cloud data is newer
      if (cloudData.lastUpdated && cloudData.lastUpdated > appData.lastUpdated) {
        console.log('📥 Receiving data from Firebase...');
        
        // Merge cloud data with local data
        appData = { ...appData, ...cloudData };
        
        // Update UI
        updateDashboard();
        updateAllDateDependencies();
        updateCharts();
        
        // Save to localStorage as well
        saveDataToStorage();
        
        showSaveIndicator('📥 Zsynchronizowano', '#22c55e');
      }
    } else {
      // No cloud data yet, upload local data
      uploadToFirebase(userId);
    }
  }, (error) => {
    console.error('❌ Firebase sync error:', error);
    updateSyncStatus('❌ Błąd synchronizacji', false);
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
  if (!window.firebaseDb || !userId) return;
  
  try {
    console.log('📤 Uploading data to Firebase...');
    
    const userDocRef = window.firebaseDoc(window.firebaseDb, 'users', userId, 'data', 'appData');
    
    const uploadData = {
      ...appData,
      lastUpdated: new Date().toISOString(),
      syncTimestamp: window.firebaseServerTimestamp()
    };
    
    await window.firebaseSetDoc(userDocRef, uploadData);
    
    console.log('✅ Data uploaded to Firebase');
    showSaveIndicator('📤 Przesłano do chmury', '#22c55e');
    
  } catch (error) {
    console.error('❌ Firebase upload failed:', error);
    showSaveIndicator('❌ Błąd synchronizacji', '#ef4444');
  }
}

function updateSyncStatus(message, isOnline) {
  appData.syncStatus.isOnline = isOnline;
  appData.syncStatus.lastSync = new Date().toISOString();
  
  const syncIndicator = document.getElementById('sync-indicator');
  if (syncIndicator) {
    syncIndicator.textContent = message;
    syncIndicator.className = isOnline ? 'sync-status online' : 'sync-status offline';
  }
}

// ==== ENHANCED DATA SAVING (Local + Firebase) ====

function loadDataFromStorage() {
  try {
    const savedData = localStorage.getItem('aitashii-powerlifting-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      appData = { ...appData, ...parsed };
      console.log('📱 Data loaded from localStorage');
      showSaveIndicator('📱 Dane załadowane', '#22c55e');
    }
  } catch (error) {
    console.error('❌ Error loading data:', error);
  }
}

function saveDataToStorage() {
  try {
    appData.lastUpdated = new Date().toISOString();
    localStorage.setItem('aitashii-powerlifting-data', JSON.stringify(appData));
    console.log('💾 Data saved to localStorage');
    
    // Also save to Firebase if user is logged in
    if (appData.syncStatus.user) {
      uploadToFirebase(appData.syncStatus.user.uid);
    }
    
    showSaveIndicator('💾 Zapisano', '#22c55e');
  } catch (error) {
    console.error('❌ Error saving data:', error);
    showSaveIndicator('❌ Błąd zapisu', '#ef4444');
  }
}

function showSaveIndicator(text, color) {
  let indicator = document.getElementById('save-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'save-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${color};
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    `;
    document.body.appendChild(indicator);
  }
  
  indicator.textContent = text;
  indicator.style.backgroundColor = color;
  indicator.style.opacity = '1';
  
  setTimeout(() => {
    indicator.style.opacity = '0';
  }, 1500);
}

// ==== FIXED HAMBURGER MENU ====

function initializeHamburgerMenuFixed() {
  console.log('🍔 Initializing FIXED hamburger menu...');
  
  setTimeout(() => setupHamburgerMenu(), 100);
  setTimeout(() => setupHamburgerMenu(), 500);
  
  window.addEventListener('load', () => {
    setTimeout(() => setupHamburgerMenu(), 100);
  });
}

function setupHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const menuOverlay = document.getElementById('menu-overlay');
  const slidingMenu = document.getElementById('sliding-menu');
  const menuItems = document.querySelectorAll('.menu-item');

  if (!hamburgerBtn) {
    console.warn('⚠️ Hamburger button not found');
    return;
  }

  console.log('✅ Setting up hamburger menu events...');

  const newHamburgerBtn = hamburgerBtn.cloneNode(true);
  hamburgerBtn.parentNode.replaceChild(newHamburgerBtn, hamburgerBtn);
  
  newHamburgerBtn.addEventListener('click', handleMenuToggle, false);
  newHamburgerBtn.addEventListener('touchend', handleMenuToggle, false);
  
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu, false);
    closeMenuBtn.addEventListener('touchend', closeMenu, false);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu, false);
  }

  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const section = this.getAttribute('data-section');
      console.log('📱 Menu item clicked:', section);
      
      if (section) {
        showSection(section);
        closeMenu();
        
        menuItems.forEach(mi => mi.classList.remove('active'));
        this.classList.add('active');
      }
    }, false);
  });

  function handleMenuToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('🍔 Hamburger clicked!');
    
    if (slidingMenu && slidingMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    console.log('📂 Opening menu...');
    if (newHamburgerBtn) newHamburgerBtn.classList.add('active');
    if (menuOverlay) menuOverlay.classList.add('active');
    if (slidingMenu) slidingMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (navigator.vibrate) navigator.vibrate(10);
  }

  function closeMenu() {
    console.log('📁 Closing menu...');
    if (newHamburgerBtn) newHamburgerBtn.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
    if (slidingMenu) slidingMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  console.log('🍔 Hamburger menu setup complete!');
}

// ==== FIXED TRAINING CALENDAR ====

function initializeTrainingCalendarFixed() {
  console.log('📅 Initializing FIXED training calendar...');
  
  // Make sure global functions are available
  window.changeCalendarMonth = changeCalendarMonth;
  window.selectTrainingDay = selectTrainingDay;
}

function updateTrainingScheduleView() {
  const trainingCalendar = document.getElementById('training-calendar');
  if (!trainingCalendar) {
    console.warn('⚠️ Training calendar element not found');
    return;
  }
  
  const currentDate = new Date(appData.currentDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  let calendarHTML = `
    <div class="calendar-header">
      <h3>📅 ${getMonthNamePolish(currentMonth)} ${currentYear}</h3>
      <div class="calendar-controls">
        <button class="btn btn--small" onclick="changeCalendarMonth(-1)">← Poprzedni</button>
        <button class="btn btn--small" onclick="changeCalendarMonth(1)">Następny →</button>
      </div>
    </div>
    <div class="calendar-legend">
      <span class="legend-item training">💪 Trening</span>
      <span class="legend-item rest">💤 Odpoczynek</span>
      <span class="legend-item today">⭐ Dziś</span>
    </div>
    <div class="calendar-grid">
      <div class="calendar-weekdays">
        <div class="weekday">Pon</div>
        <div class="weekday">Wto</div>
        <div class="weekday">Śro</div>
        <div class="weekday">Czw</div>
        <div class="weekday">Pią</div>
        <div class="weekday">Sob</div>
        <div class="weekday">Nie</div>
      </div>
      <div class="calendar-days">
  `;
  
  // Generate calendar days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarHTML += '<div class="calendar-day empty"></div>';
  }
  
  // Add days of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isToday = dateStr === appData.currentDate;
    const isRestDay = dayOfWeek === 5; // Friday
    
    const dayClass = isToday ? 'today' : (isRestDay ? 'rest-day' : 'training-day');
    const dayIcon = isRestDay ? '💤' : '💪';
    
    // FIXED: Use proper onclick with quotes
    calendarHTML += `
      <div class="calendar-day ${dayClass}" onclick="selectTrainingDay('${dateStr}')">
        <div class="day-number">${day}</div>
        <div class="day-type">${dayIcon}</div>
        ${isToday ? '<div class="today-indicator">DZIŚ</div>' : ''}
      </div>
    `;
  }
  
  calendarHTML += `
      </div>
    </div>
    <div class="selected-day-workout" id="selected-day-workout">
      <p>👆 Kliknij dzień aby zobaczyć trening</p>
    </div>
  `;
  
  trainingCalendar.innerHTML = calendarHTML;
  console.log('✅ FIXED Training calendar rendered with clickable days');
}

// FIXED: Global function for day selection
function selectTrainingDay(dateStr) {
  console.log('📅 Selected training day:', dateStr);
  
  const selectedWorkout = document.getElementById('selected-day-workout');
  if (!selectedWorkout) {
    console.warn('⚠️ Selected workout element not found');
    return;
  }
  
  const date = new Date(dateStr);
  const dayName = getDayOfWeekPolish(date);
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 5) { // Rest day
    selectedWorkout.innerHTML = `
      <h4>💤 ${dayName} - Dzień odpoczynku</h4>
      <div class="rest-day-activities">
        <div class="activity-item">🧘‍♀️ Mobilność i stretching</div>
        <div class="activity-item">🎯 Praca nad przywodzicielami</div>
        <div class="activity-item">💆‍♀️ Regeneracja</div>
      </div>
    `;
  } else { // Training day
    const currentPhase = getCurrentTrainingPhase();
    if (currentPhase) {
      const squatWeight = Math.round(appData.currentPRs.squat.estimated1RM * currentPhase.exercises.squat.intensity);
      const benchWeight = Math.round(appData.currentPRs.bench.estimated1RM * currentPhase.exercises.bench.intensity);
      const deadliftWeight = Math.round(appData.currentPRs.deadlift.estimated1RM * currentPhase.exercises.deadlift.intensity);
      
      selectedWorkout.innerHTML = `
        <h4>💪 ${dayName} - ${currentPhase.name}</h4>
        <div class="workout-preview">
          <div class="exercise-preview">
            <span class="exercise-name">Squat:</span>
            <span class="exercise-details">${currentPhase.exercises.squat.sets}x${currentPhase.exercises.squat.reps} @ ${squatWeight}kg</span>
          </div>
          <div class="exercise-preview">
            <span class="exercise-name">Bench:</span>
            <span class="exercise-details">${currentPhase.exercises.bench.sets}x${currentPhase.exercises.bench.reps} @ ${benchWeight}kg</span>
          </div>
          <div class="exercise-preview">
            <span class="exercise-name">Deadlift:</span>
            <span class="exercise-details">${currentPhase.exercises.deadlift.sets}x${currentPhase.exercises.deadlift.reps} @ ${deadliftWeight}kg</span>
          </div>
          <div class="exercise-preview highlight">
            <span class="exercise-name">🎯 ${currentPhase.accessories[0]}</span>
          </div>
          <button class="btn btn--primary" onclick="showSection('workout')">Pełny Trening</button>
        </div>
      `;
    }
  }
  
  console.log('✅ Training day details updated');
}

// FIXED: Global function for calendar navigation
function changeCalendarMonth(direction) {
  const currentDate = new Date(appData.currentDate);
  currentDate.setMonth(currentDate.getMonth() + direction);
  
  // Don't change actual app date, just calendar view
  const newDateStr = currentDate.toISOString().split('T')[0];
  
  // Temporarily update for calendar rendering
  const originalDate = appData.currentDate;
  appData.currentDate = newDateStr;
  updateTrainingScheduleView();
  appData.currentDate = originalDate; // Restore original date
  
  console.log('📅 Calendar month changed:', direction > 0 ? 'next' : 'previous');
}

// ==== DATE DEPENDENCIES ====

function updateAllDateDependencies() {
  try {
    updateDateDisplay();
    updateTrainingPhaseStatus();
    updateDailyWorkout();
    updateMenstrualCycleStatus();
    updateNutritionTargets();
    updateCompetitionCountdown();
    updateProgressTimelines();
    updateTrainingScheduleView();
    
    console.log('🔄 All date dependencies updated');
  } catch (error) {
    console.error('❌ Error updating date dependencies:', error);
  }
}

function updateDateDisplay() {
  const currentDate = new Date(appData.currentDate);
  const formattedDate = formatDatePolish(appData.currentDate);
  const dayOfWeek = getDayOfWeekPolish(currentDate);
  
  const currentDateDisplay = document.getElementById('current-date-display');
  if (currentDateDisplay) {
    currentDateDisplay.textContent = `${dayOfWeek}, ${formattedDate}`;
  }
}

function updateTrainingPhaseStatus() {
  const currentDate = new Date(appData.currentDate);
  let currentPhase = null;
  let phaseStatus = "";
  
  for (const [phaseKey, phase] of Object.entries(appData.trainingPhases)) {
    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);
    
    if (currentDate >= startDate && currentDate <= endDate) {
      currentPhase = phase;
      phaseStatus = `${phaseKey.charAt(phaseKey.length - 1)}/4 - ${phase.name.split(' ')[0]}`;
      break;
    }
  }
  
  const phaseIndicator = document.getElementById('phase-indicator');
  const currentPhaseStatus = document.getElementById('current-phase-status');
  
  if (currentPhase && phaseIndicator) {
    phaseIndicator.textContent = `Faza ${phaseStatus}`;
  }
  
  if (currentPhase && currentPhaseStatus) {
    currentPhaseStatus.textContent = `Faza ${phaseStatus}: ${currentPhase.name}`;
  }
}

function updateDailyWorkout() {
  const currentDate = new Date(appData.currentDate);
  const dayOfWeek = currentDate.getDay();
  const dayName = getDayOfWeekPolish(currentDate);
  
  const workoutTitle = document.getElementById('workout-title');
  const workoutStatus = document.getElementById('workout-status');
  const workoutSummary = document.getElementById('workout-summary');
  const dayType = document.getElementById('day-type');
  
  let isTrainingDay = true;
  let workoutContent = '';
  
  if (dayOfWeek === 5) { // Friday - Rest day
    isTrainingDay = false;
    if (workoutTitle) workoutTitle.textContent = `💤 Odpoczynek - ${dayName}`;
    if (workoutStatus) {
      workoutStatus.textContent = 'Dzień odpoczynku - Mobilność';
      workoutStatus.className = 'status status--warning';
    }
    if (dayType) dayType.textContent = 'Dzień odpoczynku (Mobilność & Stretching)';
    
    workoutContent = `
      <div class="exercise-item rest-day">
        <span class="exercise-name">🧘‍♀️ Mobilność & Stretching</span>
      </div>
      <div class="exercise-item rest-day">
        <span class="exercise-name">🔧 Dynamic stretching</span>
      </div>
      <div class="exercise-item rest-day">
        <span class="exercise-name">🦵 Joint mobility</span>
      </div>
    `;
  } else {
    const currentPhase = getCurrentTrainingPhase();
    
    if (workoutTitle) workoutTitle.textContent = `💪 Trening na ${dayName}`;
    if (workoutStatus) {
      workoutStatus.textContent = 'Dzień treningowy - Aitashii Method';
      workoutStatus.className = 'status status--success';
    }
    if (dayType) dayType.textContent = 'Dzień treningowy (Aitashii Method)';
    
    if (currentPhase) {
      const squatWeight = Math.round(appData.currentPRs.squat.estimated1RM * currentPhase.exercises.squat.intensity);
      const benchWeight = Math.round(appData.currentPRs.bench.estimated1RM * currentPhase.exercises.bench.intensity);
      const deadliftWeight = Math.round(appData.currentPRs.deadlift.estimated1RM * currentPhase.exercises.deadlift.intensity);
      
      workoutContent = `
        <div class="exercise-item">
          <span class="exercise-name">Squat</span>
          <span class="exercise-sets">${currentPhase.exercises.squat.sets}x${currentPhase.exercises.squat.reps} @ ${squatWeight}kg (${Math.round(currentPhase.exercises.squat.intensity*100)}%)</span>
        </div>
        <div class="exercise-item">
          <span class="exercise-name">Bench Press</span>
          <span class="exercise-sets">${currentPhase.exercises.bench.sets}x${currentPhase.exercises.bench.reps} @ ${benchWeight}kg (${Math.round(currentPhase.exercises.bench.intensity*100)}%)</span>
        </div>
        <div class="exercise-item">
          <span class="exercise-name">Deadlift</span>
          <span class="exercise-sets">${currentPhase.exercises.deadlift.sets}x${currentPhase.exercises.deadlift.reps} @ ${deadliftWeight}kg (${Math.round(currentPhase.exercises.deadlift.intensity*100)}%)</span>
        </div>
        <div class="exercise-item highlight">
          <span class="exercise-name">🎯 ${currentPhase.accessories[0]}</span>
          <span class="exercise-sets">25-27kg, 3x12 (priorytet!)</span>
        </div>
      `;
    }
  }
  
  if (workoutSummary) {
    workoutSummary.innerHTML = workoutContent;
  }
  
  updateDetailedWorkout(getCurrentTrainingPhase(), isTrainingDay, dayName);
}

function updateDetailedWorkout(currentPhase, isTrainingDay, dayName) {
  const workoutExercises = document.getElementById('workout-exercises');
  const workoutDetailTitle = document.getElementById('workout-detail-title');
  
  if (!workoutExercises) return;
  
  if (!isTrainingDay) {
    if (workoutDetailTitle) {
      workoutDetailTitle.textContent = `💤 Odpoczynek - ${dayName}`;
    }
    
    workoutExercises.innerHTML = `
      <div class="rest-day-program">
        <h4>🧘‍♀️ Program Mobilności i Regeneracji</h4>
        <div class="exercise-item rest-day">
          <div class="exercise-details">
            <h5>Dynamic Stretching</h5>
            <p>15-20 minut rozciągania dynamicznego</p>
          </div>
        </div>
        <div class="exercise-item rest-day">
          <div class="exercise-details">
            <h5>🎯 Praca nad przywodzicielami</h5>
            <p>Specjalnie dla Ciebie - wzmacnianie</p>
          </div>
        </div>
        <div class="exercise-item rest-day">
          <div class="exercise-details">
            <h5>Mobility Work</h5>
            <p>Joint mobility i deep stretching</p>
          </div>
        </div>
      </div>
    `;
  } else if (currentPhase) {
    if (workoutDetailTitle) {
      workoutDetailTitle.textContent = `💪 Trening na ${dayName} - ${currentPhase.name}`;
    }
    
    const squatWeight = Math.round(appData.currentPRs.squat.estimated1RM * currentPhase.exercises.squat.intensity);
    const benchWeight = Math.round(appData.currentPRs.bench.estimated1RM * currentPhase.exercises.bench.intensity);
    const deadliftWeight = Math.round(appData.currentPRs.deadlift.estimated1RM * currentPhase.exercises.deadlift.intensity);
    
    workoutExercises.innerHTML = `
      <div class="training-program">
        <div class="phase-info">
          <h4>🎯 ${currentPhase.name}</h4>
          <p><strong>Focus:</strong> ${currentPhase.focus}</p>
          <p><strong>Intensywność:</strong> ${currentPhase.intensityRange}</p>
        </div>
        
        <div class="main-exercises">
          <h4>💪 Główne ćwiczenia</h4>
          
          <div class="exercise-item">
            <div class="exercise-header">
              <h5>🏋️‍♀️ Back Squat</h5>
              <span class="exercise-load">${squatWeight}kg (${Math.round(currentPhase.exercises.squat.intensity*100)}% 1RM)</span>
            </div>
            <div class="exercise-details">
              <p><strong>Objętość:</strong> ${currentPhase.exercises.squat.sets} sety x ${currentPhase.exercises.squat.reps} powtórzeń</p>
              <p><strong>Odpoczynek:</strong> 2-3 minuty między setami</p>
            </div>
          </div>
          
          <div class="exercise-item">
            <div class="exercise-header">
              <h5>🏋️‍♀️ Bench Press</h5>
              <span class="exercise-load">${benchWeight}kg (${Math.round(currentPhase.exercises.bench.intensity*100)}% 1RM)</span>
            </div>
            <div class="exercise-details">
              <p><strong>Objętość:</strong> ${currentPhase.exercises.bench.sets} sety x ${currentPhase.exercises.bench.reps} powtórzeń</p>
              <p><strong>Odpoczynek:</strong> 2-3 minuty między setami</p>
            </div>
          </div>
          
          <div class="exercise-item">
            <div class="exercise-header">
              <h5>🏋️‍♀️ Deadlift</h5>
              <span class="exercise-load">${deadliftWeight}kg (${Math.round(currentPhase.exercises.deadlift.intensity*100)}% 1RM)</span>
            </div>
            <div class="exercise-details">
              <p><strong>Objętość:</strong> ${currentPhase.exercises.deadlift.sets} sety x ${currentPhase.exercises.deadlift.reps} powtórzeń</p>
              <p><strong>Odpoczynek:</strong> 3-4 minuty między setami</p>
            </div>
          </div>
        </div>
        
        <div class="accessory-exercises">
          <h4>🎯 Ćwiczenia dodatkowe</h4>
          ${currentPhase.accessories.map((accessory, index) => `
            <div class="exercise-item ${index === 0 ? 'highlight' : ''}">
              <div class="exercise-details">
                <h5>${accessory}</h5>
                ${index === 0 ? '<p><strong>PRIORYTET!</strong> 25-27kg, 3x12 powtórzeń</p>' : '<p>3 sety x 8-12 powtórzeń</p>'}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="training-notes">
          <h4>📝 Notatki</h4>
          <p>💡 <strong>Tip:</strong> Bazowane na metodologii Aitashii</p>
          <p>🎪 Dostosuj ciężary do swojego samopoczucia</p>
          <p>🌸 Pamiętaj o rozgrzewce i cool-down!</p>
          <p>🔥 <strong>Auto-sync:</strong> Dane synchronizują się automatycznie!</p>
        </div>
      </div>
    `;
  }
}

function updateMenstrualCycleStatus() {
  const currentDate = new Date(appData.currentDate);
  const lastPeriodStart = new Date(appData.menstrualCycle.lastPeriodStart);
  const daysSinceLastPeriod = Math.floor((currentDate - lastPeriodStart) / (1000 * 60 * 60 * 24));
  const cycleDay = (daysSinceLastPeriod % appData.menstrualCycle.cycleLength) + 1;
  
  let phase, recommendation;
  
  if (cycleDay <= appData.menstrualCycle.periodLength) {
    phase = "Menstruacja";
    recommendation = "Lekkie treningi, słuchaj swojego ciała 🌙";
  } else if (cycleDay <= 14) {
    phase = "Faza folikularna";
    recommendation = "Wysokie hormony - dobry czas na intensywne treningi! 💪";
  } else if (cycleDay <= 21) {
    phase = "Faza lutealna wczesna";
    recommendation = "Optymalna siła - idealne na ciężkie lify! 🏋️‍♀️";
  } else {
    phase = "Faza lutealna późna";
    recommendation = "Może być ciężej - skupy się na technice i objętości 🎯";
  }
  
  const cyclePhaseElement = document.getElementById('cycle-phase');
  const cycleDayElement = document.getElementById('cycle-day');
  const daysSincePeriodElement = document.getElementById('days-since-period');
  const cycleRecommendationElement = document.getElementById('cycle-recommendation');
  
  if (cyclePhaseElement) cyclePhaseElement.textContent = phase;
  if (cycleDayElement) cycleDayElement.textContent = `${cycleDay}/28`;
  if (daysSincePeriodElement) daysSincePeriodElement.textContent = `${daysSinceLastPeriod} dni`;
  if (cycleRecommendationElement) cycleRecommendationElement.textContent = recommendation;
}

function updateNutritionTargets() {
  const currentDate = new Date(appData.currentDate);
  const dayOfWeek = currentDate.getDay();
  const dayName = getDayOfWeekPolish(currentDate);
  const isRestDay = dayOfWeek === 5;
  
  const nutritionTitle = document.getElementById('nutrition-title');
  const nutritionStatus = document.getElementById('nutrition-status');
  const nutritionTargets = document.getElementById('nutrition-targets');
  
  let calories, protein, carbs, fat;
  
  if (isRestDay) {
    calories = 2200; protein = 160; carbs = 250; fat = 70;
    if (nutritionTitle) nutritionTitle.textContent = `🥗 Żywienie na ${dayName}`;
    if (nutritionStatus) {
      nutritionStatus.textContent = 'Dzień odpoczynku';
      nutritionStatus.className = 'status status--warning';
    }
  } else {
    calories = 2500; protein = 180; carbs = 280; fat = 85;
    if (nutritionTitle) nutritionTitle.textContent = `🥗 Żywienie na ${dayName}`;
    if (nutritionStatus) {
      nutritionStatus.textContent = 'Dzień treningowy';
      nutritionStatus.className = 'status status--success';
    }
  }
  
  if (nutritionTargets) {
    nutritionTargets.innerHTML = `
      <div class="nutrition-overview">
        <h4>🎯 Dzienne cele makroelementów</h4>
        <div class="nutrition-grid">
          <div class="nutrient-card">
            <div class="nutrient-header">
              <span class="nutrient-name">Kalorie</span>
              <span class="nutrient-target">${calories} kcal</span>
            </div>
          </div>
          <div class="nutrient-card">
            <div class="nutrient-header">
              <span class="nutrient-name">Białko</span>
              <span class="nutrient-target">${protein}g</span>
            </div>
          </div>
          <div class="nutrient-card">
            <div class="nutrient-header">
              <span class="nutrient-name">Węglowodany</span>
              <span class="nutrient-target">${carbs}g</span>
            </div>
          </div>
          <div class="nutrient-card">
            <div class="nutrient-header">
              <span class="nutrient-name">Tłuszcz</span>
              <span class="nutrient-target">${fat}g</span>
            </div>
          </div>
        </div>
        
        <div class="nutrition-tips">
          <h5>💡 ${isRestDay ? 'Wskazówki na dzień odpoczynku' : 'Wskazówki na dzień treningowy'}</h5>
          ${isRestDay ? 
            '<p>🌙 Utrzymuj stabilny poziom cukru we krwi. Skup się na jakościowych źródłach białka i zdrowych tłuszczach.</p>' :
            '<p>💪 Zwiększ spożycie węglowodanów 2-3h przed treningiem. Po treningu białko (25-30g) i węglowodany proste.</p>'
          }
        </div>
      </div>
    `;
  }
}

function updateCompetitionCountdown() {
  const currentDate = new Date(appData.currentDate);
  const competitionDate = new Date('2026-03-30');
  const daysToCompetition = Math.ceil((competitionDate - currentDate) / (1000 * 60 * 60 * 24));
  
  const competitionCountdownElement = document.getElementById('competition-countdown');
  if (competitionCountdownElement) {
    if (daysToCompetition > 0) {
      competitionCountdownElement.textContent = `${daysToCompetition} dni (marzec 2026)`;
    } else if (daysToCompetition === 0) {
      competitionCountdownElement.textContent = 'DZIŚ! 🏆';
    } else {
      competitionCountdownElement.textContent = `${Math.abs(daysToCompetition)} dni po zawodach`;
    }
  }
}

function updateProgressTimelines() {
  const currentDate = new Date(appData.currentDate);
  
  updatePRDaysAgo('squat', currentDate);
  updatePRDaysAgo('bench', currentDate);
  updatePRDaysAgo('deadlift', currentDate);
}

function updatePRDaysAgo(exercise, currentDate) {
  const prData = appData.currentPRs[exercise];
  if (!prData) return;
  
  const prDate = new Date(prData.date);
  const daysAgo = Math.floor((currentDate - prDate) / (1000 * 60 * 60 * 24));
  
  const prDaysElement = document.getElementById(`${exercise}-pr-days`);
  if (prDaysElement) {
    if (daysAgo === 0) {
      prDaysElement.textContent = 'Dziś! 🔥';
    } else if (daysAgo === 1) {
      prDaysElement.textContent = 'Wczoraj';
    } else if (daysAgo > 0) {
      prDaysElement.textContent = `${daysAgo} dni temu`;
    } else {
      prDaysElement.textContent = `Za ${Math.abs(daysAgo)} dni`;
    }
  }
}

// Helper Functions
function getCurrentTrainingPhase() {
  const currentDate = new Date(appData.currentDate);
  
  for (const phase of Object.values(appData.trainingPhases)) {
    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);
    
    if (currentDate >= startDate && currentDate <= endDate) {
      return phase;
    }
  }
  
  return appData.trainingPhases.phase1;
}

function formatDatePolish(dateString) {
  const date = new Date(dateString);
  const months = [
    'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
  ];
  
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getDayOfWeekPolish(date) {
  const days = [
    'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'
  ];
  return days[date.getDay()];
}

function getMonthNamePolish(monthIndex) {
  const months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];
  return months[monthIndex];
}

// ==== SILENT AUTO-BACKUP ====

function initializeAutoBackup() {
  console.log('💾 Initializing silent auto-backup...');
  
  const manualBackupBtn = document.getElementById('manual-backup-btn');
  const createBackupBtn = document.getElementById('create-backup-btn');
  const exportTrainerBtn = document.getElementById('export-trainer-btn');
  const restoreFileInput = document.getElementById('restore-file-input');
  
  if (manualBackupBtn) {
    manualBackupBtn.addEventListener('click', performManualBackup);
  }
  
  if (createBackupBtn) {
    createBackupBtn.addEventListener('click', performManualBackup);
  }
  
  if (exportTrainerBtn) {
    exportTrainerBtn.addEventListener('click', exportForTrainer);
  }
  
  if (restoreFileInput) {
    restoreFileInput.addEventListener('change', handleFileRestore);
  }
  
  console.log('💾 Silent auto-backup initialized');
}

function trackChange(changeDescription = 'Dodano dane') {
  appData.autoBackup.changesCount++;
  console.log(`📊 Change tracked: ${changeDescription} (${appData.autoBackup.changesCount}/${appData.autoBackup.maxChanges})`);
  
  saveDataToStorage();
  updateAutoBackupUI();
}

function performManualBackup() {
  try {
    console.log('🔧 Performing manual backup...');
    
    const backupData = createBackupData();
    const fileName = generateBackupFileName('manual');
    
    downloadBackupFile(backupData, fileName);
    
    appData.autoBackup.changesCount = 0;
    appData.autoBackup.lastBackup = new Date().toISOString();
    
    saveDataToStorage();
    updateAutoBackupUI();
    
    showSaveIndicator('✅ Backup pobrany!', '#22c55e');
    
  } catch (error) {
    console.error('❌ Manual backup failed:', error);
    showSaveIndicator('❌ Błąd backupu', '#ef4444');
  }
}

function exportForTrainer() {
  try {
    const trainerData = {
      exportType: 'trainer-analysis',
      appName: 'Aitashii Powerlifting Tracker',
      version: appData.version,
      timestamp: new Date().toISOString(),
      currentDate: appData.currentDate,
      currentPRs: appData.currentPRs,
      currentMeasurements: appData.measurements[appData.measurements.length - 1] || null,
      currentPhase: getCurrentTrainingPhase(),
      prHistory: appData.prHistory,
      measurementsHistory: appData.measurements,
      menstrualCycle: appData.menstrualCycle,
      bodyGoals: appData.bodyGoals,
      syncStatus: appData.syncStatus
    };
    
    const fileName = `Aitashii-trainer-export-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-')}.json`;
    const jsonString = JSON.stringify(trainerData, null, 2);
    downloadJsonFile(jsonString, fileName);
    
    showSaveIndicator('📊 Export dla trenera gotowy!', '#3b82f6');
    
  } catch (error) {
    console.error('❌ Trainer export failed:', error);
    showSaveIndicator('❌ Export failed', '#ef4444');
  }
}

function createBackupData() {
  return {
    version: "2.1",
    appName: "Aitashii Powerlifting Tracker",
    backupType: "complete",
    timestamp: new Date().toISOString(),
    syncEnabled: !!appData.syncStatus.user,
    appData: { ...appData }
  };
}

function generateBackupFileName(type = 'auto') {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 16).replace(/[T:]/g, '-');
  return `Aitashii-backup-${type}-${dateStr}.json`;
}

function downloadBackupFile(data, fileName) {
  const jsonString = JSON.stringify(data, null, 2);
  downloadJsonFile(jsonString, fileName);
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

function updateAutoBackupUI() {
  const changesCount = appData.autoBackup.changesCount;
  const maxChanges = appData.autoBackup.maxChanges;
  const progressPercent = (changesCount / maxChanges) * 100;
  
  const backupCounter = document.getElementById('backup-counter');
  if (backupCounter) {
    backupCounter.textContent = `${changesCount}/${maxChanges} zmian`;
  }
  
  const backupProgressFill = document.getElementById('backup-progress-fill');
  if (backupProgressFill) {
    backupProgressFill.style.width = `${progressPercent}%`;
  }
  
  const changesSinceBackup = document.getElementById('changes-since-backup');
  if (changesSinceBackup) {
    changesSinceBackup.textContent = changesCount;
  }
  
  const lastBackupTime = document.getElementById('last-backup-time');
  if (lastBackupTime) {
    if (appData.autoBackup.lastBackup) {
      const date = new Date(appData.autoBackup.lastBackup);
      lastBackupTime.textContent = date.toLocaleDateString('pl-PL') + ' ' + 
                                   date.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'});
    } else {
      lastBackupTime.textContent = 'Brak';
    }
  }
  
  const nextBackup = document.getElementById('next-backup');
  if (nextBackup) {
    const remaining = maxChanges - changesCount;
    if (remaining > 0) {
      nextBackup.textContent = `Po ${remaining} zmianach`;
    } else {
      nextBackup.textContent = 'Gotowy - kliknij Manual Backup!';
    }
  }
}

function handleFileRestore(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if ((!file.name.includes('Aitashii-backup') && !file.name.includes('6xSBD-backup')) || !file.name.endsWith('.json')) {
    showSaveIndicator('❌ Błędny plik', '#ef4444');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const backupData = JSON.parse(e.target.result);
      
      if (!backupData.appData) {
        throw new Error('Invalid backup format');
      }
      
      appData = { ...backupData.appData };
      
      saveDataToStorage();
      updateDashboard();
      updateAllDateDependencies();
      updateAutoBackupUI();
      updateCharts();
      
      showSaveIndicator('✅ Dane przywrócone!', '#22c55e');
      
    } catch (error) {
      console.error('❌ Restore failed:', error);
      showSaveIndicator('❌ Błąd przywracania', '#ef4444');
    }
  };
  
  reader.readAsText(file);
}

// ==== FORMS ====

function initializeForms() {
  console.log('📝 Initializing forms...');
  
  const prForm = document.getElementById('pr-form');
  if (prForm) {
    prForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addNewPR();
    });
  }
  
  const measurementsForm = document.getElementById('measurements-form');
  if (measurementsForm) {
    measurementsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addNewMeasurement();
    });
  }
  
  const cycleForm = document.getElementById('cycle-form');
  if (cycleForm) {
    cycleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      updateCycleData();
    });
  }
  
  console.log('📝 Forms initialized');
}

function addNewPR() {
  const exercise = document.getElementById('exercise').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const reps = parseInt(document.getElementById('reps').value);
  const date = document.getElementById('pr-date').value;
  
  if (exercise && weight && reps && date) {
    const estimated1RM = weight * (1 + reps / 30);
    
    const newPR = {
      weight: weight,
      reps: reps,
      date: date,
      estimated1RM: Math.round(estimated1RM * 10) / 10
    };
    
    appData.currentPRs[exercise] = newPR;
    
    if (!appData.prHistory[exercise]) {
      appData.prHistory[exercise] = [];
    }
    appData.prHistory[exercise].push(newPR);
    appData.prHistory[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    trackChange(`Nowe PR ${exercise}: ${weight}kg x${reps}`);
    
    updateDashboard();
    updateAllDateDependencies();
    updateCharts();
    
    document.getElementById('pr-form').reset();
    
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
    
    showSaveIndicator(`🏆 Nowe PR ${exercise}!`, '#22c55e');
  }
}

function addNewMeasurement() {
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
  
  const latest = appData.measurements[appData.measurements.length - 1];
  appData.bodyGoals.current = {
    weight: latest.weight,
    bodyFat: latest.bodyFat,
    fatMass: latest.fatMass,
    muscleMass: latest.muscle,
    bodyWater: latest.bodyWater
  };
  
  trackChange('Dodano nowy pomiar');
  
  updateDashboard();
  updateAllDateDependencies();
  updateCharts();
  
  document.getElementById('measurements-form').reset();
  
  showSaveIndicator('📊 Nowy pomiar dodany!', '#22c55e');
}

function updateCycleData() {
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
    
    trackChange('Zaktualizowano cykl menstruacyjny');
    
    updateMenstrualCycleStatus();
    updateDashboard();
    
    document.getElementById('cycle-form').reset();
    
    showSaveIndicator('🌙 Cykl zaktualizowany!', '#22c55e');
  }
}

// ==== CHARTS ====

function initializeCharts() {
  console.log('📊 Initializing charts...');
  
  try {
    initializePRChart();
    initializeBodyCompositionChart();
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
      const colors = ['#D4A5A5', '#FFB7C5', '#C48B9F'];
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
          text: '🏆 Postęp PR (Estimated 1RM)'
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          }
        },
        y: {
          beginAtZero: false
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
          label: 'Waga (kg)',
          data: appData.measurements.map(m => m.weight),
          borderColor: '#D4A5A5',
          backgroundColor: '#D4A5A520',
          tension: 0.4
        },
        {
          label: 'Masa mięśniowa (kg)',
          data: appData.measurements.map(m => m.muscle),
          borderColor: '#22c55e',
          backgroundColor: '#22c55e20',
          tension: 0.4
        },
        {
          label: 'Masa tłuszczowa (kg)',
          data: appData.measurements.map(m => m.fatMass),
          borderColor: '#ef4444',
          backgroundColor: '#ef444420',
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
          text: '📊 Skład Ciała'
        }
      },
      scales: {
        y: {
          beginAtZero: false
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
        const colors = ['#D4A5A5', '#FFB7C5', '#C48B9F'];
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

// ==== SECTION NAVIGATION ====

function showSection(sectionName) {
  console.log(`📱 Showing section: ${sectionName}`);
  
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('section--active'));
  
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('section--active');
  }
  
  if (sectionName === 'progress' && charts.prChart) {
    setTimeout(() => {
      charts.prChart.resize();
      charts.bodyChart?.resize();
    }, 100);
  }
  
  if (sectionName === 'treningi') {
    updateTrainingScheduleView();
  }
}

// ==== DASHBOARD UPDATES ====

function updateDashboard() {
  updatePRCards();
  updateBodyCompositionCard();
}

function updatePRCards() {
  const prItems = document.querySelectorAll('.pr-item');
  prItems.forEach(item => {
    const label = item.querySelector('.pr-label').textContent.toLowerCase();
    const valueEl = item.querySelector('.pr-value');
    
    if (appData.currentPRs[label]) {
      const pr = appData.currentPRs[label];
      valueEl.textContent = pr.reps > 1 ? `${pr.weight}kg x${pr.reps}` : `${pr.weight}kg`;
    }
  });
}

function updateBodyCompositionCard() {
  const current = appData.bodyGoals.current;
  const target = appData.bodyGoals.target;
  
  const weightProgress = (target.weight / current.weight) * 100;
  const weightBar = document.querySelector('.comp-item:nth-child(1) .progress-fill');
  if (weightBar) {
    weightBar.style.width = `${Math.min(weightProgress, 100)}%`;
  }
  
  const fatProgress = (1 - (current.fatMass - target.fatMass) / current.fatMass) * 100;
  const fatBar = document.querySelector('.comp-item:nth-child(2) .progress-fill');
  if (fatBar) {
    fatBar.style.width = `${Math.max(0, Math.min(fatProgress, 100))}%`;
  }
  
  const muscleProgress = (current.muscleMass / target.muscleMass) * 100;
  const muscleBar = document.querySelector('.comp-item:nth-child(3) .progress-fill');
  if (muscleBar) {
    muscleBar.style.width = `${Math.min(muscleProgress, 100)}%`;
  }
}

// Initialize on window load
window.addEventListener('load', function() {
  console.log('🌸 Window loaded, setting defaults...');
  
  const today = new Date().toISOString().split('T')[0];
  
  const prDateInput = document.getElementById('pr-date');
  const measurementDateInput = document.getElementById('measurement-date');
  
  if (prDateInput) prDateInput.value = today;
  if (measurementDateInput) measurementDateInput.value = today;
  
  updateAutoBackupUI();
  
  console.log('🎉 Aitashii Powerlifting Tracker with AUTO-DATE & FIXED CALENDAR ready!');
});
