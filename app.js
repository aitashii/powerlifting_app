// 🌸🐱 Aitashii Powerlifting Tracker - FIXED APPLICATION DATA & FUNCTIONALITY

let appData = {
  // NEW: Current Date System - controls all date-dependent functionality
  currentDate: "2025-08-25", // Default starting date
  
  // Auto-backup settings (updated to 3 changes)
  autoBackup: {
    changesCount: 0,
    maxChanges: 3,
    autoDownload: true
  },
  
  currentPRs: {
    squat: { weight: 40, reps: 5, date: "2025-08-23", estimated1RM: 45 },
    bench: { weight: 45, reps: 1, date: "2025-08-23", estimated1RM: 45 },
    deadlift: { weight: 90, reps: 1, date: "2025-07-31", estimated1RM: 90 }
  },
  
  // Enhanced measurements with fat mass and body water
  measurements: [
    { 
      date: "2025-08-19", 
      weight: 84.1, 
      bodyFat: 38, 
      muscle: 44.3, 
      fatMass: 32.0, 
      bodyWater: 38.1 
    }
  ],
  
  // Body composition goals
  bodyGoals: {
    current: {
      weight: 84.1,
      bodyFat: 38,
      fatMass: 32.0,
      muscleMass: 44.3,
      bodyWater: 38.1
    },
    target: {
      weight: 72,
      bodyFat: 18,
      fatMass: 13.0,
      muscleMass: 50.2,
      bodyWater: 43.1
    },
    changes: {
      fatLoss: 19.0,
      muscleGain: 5.9,
      waterGain: 5.0,
      netWeightLoss: 12.1
    }
  },
  
  menstrualCycle: {
    lastPeriod: "2025-08-20",
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
  
  // Complete 4-phase training plan with exact dates
  trainingPhases: {
    phase1: {
      name: "HYPERTROPHY + REHAB",
      startDate: "2025-08-25",
      endDate: "2025-10-06",
      duration: "6 weeks",
      intensityRange: "65-80%",
      focus: "Volume, technique, adductor strengthening"
    },
    phase2: {
      name: "STRENGTH", 
      startDate: "2025-10-07",
      endDate: "2025-11-17",
      duration: "6 weeks", 
      intensityRange: "80-90%",
      focus: "Strength development, power preparation"
    },
    phase3: {
      name: "POWER",
      startDate: "2025-11-18",
      endDate: "2025-12-29",
      duration: "6 weeks",
      intensityRange: "90-100%", 
      focus: "Peak strength, competition commands"
    },
    phase4: {
      name: "PEAKING",
      startDate: "2025-12-30",
      endDate: "2026-03-30",
      duration: "12 weeks",
      intensityRange: "Competition prep",
      focus: "Opener/second/third attempts, deload"
    }
  },
  
  competitionInfo: {
    location: "German-speaking cantons of Switzerland",
    federationType: "Drug-free federations", 
    targetDate: "2026-03-30", // Fixed target date
    weightClass: "72kg"
  },
  
  // Weekly training schedule
  weeklySchedule: {
    monday: "SBD Training",
    tuesday: "SBD Training",
    wednesday: "SBD Training", 
    thursday: "SBD Training",
    friday: "REST/MOBILITY",
    saturday: "SBD Training",
    sunday: "SBD Training"
  }
};

// Timer variables
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;
let restTimerInterval = null;
let restTimerSeconds = 0;
let isRestTimerRunning = false;

// Chart instances
let charts = {};

// Firebase Auth State
let currentUser = null;
let isSignedIn = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌸 Aitashii app loaded, initializing...');
  
  initializeNavigation();
  initializeTimer();
  initializePRForm();
  initializeMeasurementsForm();
  initializeCycleTracker();
  setupFatMassCalculation();
  initializeDateControl();
  initializeAuth();
  
  // Wait for charts to initialize after DOM is ready
  setTimeout(() => {
    initializeCharts();
  }, 100);
  
  updateAllDateDependencies();
  updateDashboard();
  updateAutoBackupDisplay();
  
  console.log('✅ App fully initialized');
});

// NEW: Firebase Authentication
function initializeAuth() {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  const userAvatar = document.getElementById('user-avatar');
  
  if (!window.firebaseAuth) {
    console.warn('Firebase not available - offline mode');
    return;
  }

  // GitHub sign in
  loginBtn?.addEventListener('click', async () => {
    try {
      const provider = new window.firebaseGithubAuthProvider();
      const result = await window.firebaseSignInWithPopup(provider);
      console.log('🔥 Signed in:', result.user);
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed: ' + error.message);
    }
  });

  // Sign out
  logoutBtn?.addEventListener('click', async () => {
    try {
      await window.firebaseSignOut();
      console.log('🔥 Signed out');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  });

  // Auth state listener
  window.firebaseOnAuthStateChanged((user) => {
    currentUser = user;
    isSignedIn = !!user;
    
    if (user) {
      loginBtn.style.display = 'none';
      userInfo.style.display = 'flex';
      userAvatar.src = user.photoURL || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
      userAvatar.alt = user.displayName || 'User';
      console.log('🔥 User authenticated:', user.displayName);
      
      // Load user data
      loadUserData();
    } else {
      loginBtn.style.display = 'block';
      userInfo.style.display = 'none';
      console.log('🔥 User signed out');
    }
  });
}

// Load user data from Firebase
async function loadUserData() {
  if (!isSignedIn || !window.firebaseDb) return;
  
  try {
    const docRef = window.firebaseDb.collection('users').doc(currentUser.uid);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const userData = doc.data();
      if (userData.appData) {
        appData = { ...appData, ...userData.appData };
        updateAllDateDependencies();
        updateDashboard();
        console.log('🔥 User data loaded from cloud');
      }
    }
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
}

// Save user data to Firebase
async function saveUserData() {
  if (!isSignedIn || !window.firebaseDb) return;
  
  try {
    const docRef = window.firebaseDb.collection('users').doc(currentUser.uid);
    await docRef.set({
      appData: appData,
      lastUpdated: window.firebaseServerTimestamp()
    }, { merge: true });
    
    console.log('🔥 User data saved to cloud');
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
}

// Manual sync function
function manualSync() {
  if (isSignedIn) {
    saveUserData();
    alert('💾 Data synced to cloud!');
  } else {
    alert('🔐 Sign in to sync data to cloud');
  }
}

// Rest Timer Functions
function startRestTimer(seconds) {
  if (isRestTimerRunning) {
    stopRestTimer();
  }
  
  restTimerSeconds = seconds;
  isRestTimerRunning = true;
  
  const modal = document.getElementById('rest-timer-modal');
  const display = document.getElementById('rest-timer-display');
  const stopBtn = document.getElementById('stop-rest-timer');
  
  modal.style.display = 'flex';
  
  updateRestTimerDisplay();
  
  restTimerInterval = setInterval(() => {
    restTimerSeconds--;
    updateRestTimerDisplay();
    
    if (restTimerSeconds <= 0) {
      stopRestTimer();
      // Play notification sound or vibrate
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      alert('⏰ Rest time completed!');
    }
  }, 1000);
  
  stopBtn.onclick = stopRestTimer;
}

function stopRestTimer() {
  isRestTimerRunning = false;
  clearInterval(restTimerInterval);
  document.getElementById('rest-timer-modal').style.display = 'none';
}

function updateRestTimerDisplay() {
  const display = document.getElementById('rest-timer-display');
  if (!display) return;
  
  const minutes = Math.floor(restTimerSeconds / 60);
  const seconds = restTimerSeconds % 60;
  
  display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// NEW: Dynamic Date System Functions
function initializeDateControl() {
  const datePicker = document.getElementById('date-picker');
  const updateBtn = document.getElementById('update-date-btn');
  
  if (!datePicker || !updateBtn) return;
  
  // Set initial date
  datePicker.value = appData.currentDate;
  
  // Update date when button is clicked
  updateBtn.addEventListener('click', () => {
    const newDate = datePicker.value;
    if (newDate) {
      updateCurrentDate(newDate);
    }
  });
  
  // Also update on date input change
  datePicker.addEventListener('change', () => {
    const newDate = datePicker.value;
    if (newDate) {
      updateCurrentDate(newDate);
    }
  });
}

function updateCurrentDate(newDateString) {
  appData.currentDate = newDateString;
  
  // Increment backup counter and trigger backup if needed
  incrementBackupCounter();
  
  // Update all date-dependent systems
  updateAllDateDependencies();
  
  // Update dashboard
  updateDashboard();
  
  // Show confirmation
  const dateObj = new Date(newDateString + 'T00:00:00');
  const formattedDate = formatDateFull(dateObj);
  
  console.log(`Date updated to: ${formattedDate}`);
  
  // Update all displays immediately
  updateCurrentDateDisplay();
  
  // Save to cloud if signed in
  if (isSignedIn) {
    saveUserData();
  }
}

function updateAllDateDependencies() {
  console.log('Updating all date dependencies for:', appData.currentDate);
  
  // Update all systems that depend on the current date
  updateCurrentDateDisplay();
  updateTrainingPhase();
  updateDailyWorkout();
  updateMenstrualCycleCalculations();
  updateProgressTimelines();
  updateCompetitionCountdown();
  updateNutritionForDay();
  updateWeeklyProgressDisplay();
}

function updateCurrentDateDisplay() {
  const currentDate = new Date(appData.currentDate + 'T00:00:00');
  const formattedDate = formatDateFull(currentDate);
  
  // Update main date display
  const currentDateText = document.getElementById('current-date-text');
  if (currentDateText) {
    currentDateText.textContent = formattedDate;
  }
  
  // Update navigation date
  const navDate = document.getElementById('nav-date');
  if (navDate) {
    navDate.textContent = formattedDate;
  }
  
  // Update workout section title
  const workoutTitle = document.getElementById('workout-section-title');
  if (workoutTitle) {
    workoutTitle.textContent = `Today's Workout - ${formattedDate}`;
  }
}

function calculateCurrentPhase() {
  const currentDate = new Date(appData.currentDate + 'T00:00:00');
  
  for (const [phaseKey, phase] of Object.entries(appData.trainingPhases)) {
    const startDate = new Date(phase.startDate + 'T00:00:00');
    const endDate = new Date(phase.endDate + 'T00:00:00');
    
    if (currentDate >= startDate && currentDate <= endDate) {
      return {
        key: phaseKey,
        phase: phase,
        status: 'CURRENT'
      };
    }
  }
  
  // If no current phase, check which is upcoming
  const sortedPhases = Object.entries(appData.trainingPhases).sort((a, b) => 
    new Date(a[1].startDate) - new Date(b[1].startDate)
  );
  
  for (const [phaseKey, phase] of sortedPhases) {
    const startDate = new Date(phase.startDate + 'T00:00:00');
    if (currentDate < startDate) {
      return {
        key: phaseKey,
        phase: phase,
        status: 'UPCOMING'
      };
    }
  }
  
  // All phases completed
  return {
    key: 'phase4',
    phase: appData.trainingPhases.phase4,
    status: 'COMPLETED'
  };
}

function updateTrainingPhase() {
  const currentPhaseInfo = calculateCurrentPhase();
  
  // Update phase status displays
  const phaseStatus = document.getElementById('current-phase-status');
  if (phaseStatus) {
    phaseStatus.textContent = `Phase ${currentPhaseInfo.key.charAt(5)}: ${currentPhaseInfo.phase.name}`;
    
    // Update status class
    phaseStatus.className = 'status';
    if (currentPhaseInfo.status === 'CURRENT') {
      phaseStatus.classList.add('status--success');
    } else if (currentPhaseInfo.status === 'UPCOMING') {
      phaseStatus.classList.add('status--warning');
    } else {
      phaseStatus.classList.add('status--info');
    }
  }
  
  // Update workout phase status
  const workoutPhaseStatus = document.getElementById('workout-phase-status');
  if (workoutPhaseStatus) {
    workoutPhaseStatus.textContent = `Phase ${currentPhaseInfo.key.charAt(5)}: ${currentPhaseInfo.phase.name}`;
    workoutPhaseStatus.className = 'status';
    if (currentPhaseInfo.status === 'CURRENT') {
      workoutPhaseStatus.classList.add('status--success');
    } else {
      workoutPhaseStatus.classList.add('status--warning');
    }
  }
  
  // Update phases timeline in progress section
  updatePhasesTimeline(currentPhaseInfo);
}

function updatePhasesTimeline(currentPhaseInfo) {
  const phasesTimeline = document.getElementById('phases-timeline');
  if (!phasesTimeline) return;
  
  const phaseItems = phasesTimeline.querySelectorAll('.phase-item');
  const currentDate = new Date(appData.currentDate + 'T00:00:00');
  
  phaseItems.forEach((item, index) => {
    const phaseKey = `phase${index + 1}`;
    const phase = appData.trainingPhases[phaseKey];
    
    // Reset classes
    item.className = 'phase-item';
    
    const startDate = new Date(phase.startDate + 'T00:00:00');
    const endDate = new Date(phase.endDate + 'T00:00:00');
    
    if (phaseKey === currentPhaseInfo.key && currentPhaseInfo.status === 'CURRENT') {
      item.classList.add('active');
      
      // Calculate week progress
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const daysPassed = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24));
      const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
      
      const progressFill = item.querySelector('.progress-fill');
      const progressText = item.querySelector('.phase-progress span');
      if (progressFill) progressFill.style.width = `${progress}%`;
      if (progressText) {
        const currentWeek = Math.ceil(daysPassed / 7);
        const totalWeeks = Math.ceil(totalDays / 7);
        progressText.textContent = `Week ${currentWeek}/${totalWeeks} - CURRENT PHASE`;
      }
    } else if (currentDate > endDate) {
      item.classList.add('completed');
      const statusEl = item.querySelector('.phase-status .status');
      if (statusEl) {
        statusEl.textContent = 'COMPLETED';
        statusEl.className = 'status status--success';
      }
    } else {
      const statusEl = item.querySelector('.phase-status .status');
      if (statusEl) {
        statusEl.textContent = 'UPCOMING';
        statusEl.className = 'status status--warning';
      }
    }
  });
}

function updateDailyWorkout() {
  const currentDate = new Date(appData.currentDate + 'T00:00:00');
  const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentPhase = calculateCurrentPhase();
  
  // Map day of week to English names
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dayOfWeek];
  
  // Check if it's a training day (Monday-Thursday + Saturday-Sunday)
  const isTrainingDay = dayOfWeek >= 1 && dayOfWeek <= 4 || dayOfWeek === 6 || dayOfWeek === 0;
  const isRestDay = dayOfWeek === 5; // Friday
  
  // Update workout day status
  const workoutDayStatus = document.getElementById('workout-day-status');
  if (workoutDayStatus) {
    if (isRestDay) {
      workoutDayStatus.textContent = 'REST/MOBILITY';
      workoutDayStatus.className = 'status status--info';
    } else if (isTrainingDay) {
      workoutDayStatus.textContent = '6xSBD';
      workoutDayStatus.className = 'status status--warning';
    }
  }
  
  // Update workout week info
  const workoutWeekInfo = document.getElementById('workout-week-info');
  if (workoutWeekInfo && currentPhase.status === 'CURRENT') {
    const phaseStart = new Date(currentPhase.phase.startDate + 'T00:00:00');
    const daysSinceStart = Math.ceil((currentDate - phaseStart) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.ceil(daysSinceStart / 7);
    const totalWeeks = parseInt(currentPhase.phase.duration.split(' ')[0]);
    const dayOfPhase = ((daysSinceStart - 1) % 7) + 1;
    
    workoutWeekInfo.textContent = `Week ${currentWeek}/${totalWeeks} | Day ${dayOfPhase}/7`;
  }
  
  // Update training calculations based on current phase
  updateWorkoutWeights();
}

function updateMenstrualCycleCalculations() {
  const currentDate = new Date(appData.currentDate + 'T00:00:00');
  const lastPeriod = new Date(appData.menstrualCycle.lastPeriod + 'T00:00:00');
  const daysSincePeriod = Math.floor((currentDate - lastPeriod) / (1000 * 60 * 60 * 24));
  const cycleDay = (daysSincePeriod % appData.menstrualCycle.cycleLength) + 1;

  let phase, phaseClass, recommendations, energy;
  
  if (cycleDay <= 5) {
    phase = "Menstruation";
    phaseClass = "status--error";
    energy = "Low";
    recommendations = [
      "⚠️ Decreased training energy",
      "⚠️ Focus on lighter loads",
      "✓ Priority on recovery"
    ];
  } else if (cycleDay <= 13) {
    phase = "Follicular Phase";
    phaseClass = "status--info"; 
    energy = "High";
    recommendations = [
      "✓ High training energy",
      "✓ Good load tolerance", 
      "✓ Fast recovery"
    ];
  } else if (cycleDay <= 16) {
    phase = "Ovulation";
    phaseClass = "status--success";
    energy = "Peak";
    recommendations = [
      "✓ Peak strength",
      "✓ Optimal PR attempts",
      "✓ Maximum capacity"
    ];
  } else {
    phase = "Luteal Phase";
    phaseClass = "status--warning";
    energy = "Declining";
    recommendations = [
      "⚠️ Gradually declining energy",
      "✓ Focus on technique", 
      "⚠️ Greater need for rest"
    ];
  }

  // Update all cycle displays
  const elements = {
    'cycle-phase': { text: phase, className: `status ${phaseClass}` },
    'cycle-day': { text: cycleDay },
    'training-energy': { text: energy },
    'last-period': { text: formatDate(appData.menstrualCycle.lastPeriod) },
    'days-since-period': { text: `${daysSincePeriod} days` },
    'phase-name': { text: phase },
    'cycle-day-display': { text: `Day ${cycleDay}` }
  };

  Object.entries(elements).forEach(([id, config]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = config.text;
      if (config.className) {
        element.className = config.className;
      }
    }
  });

  // Update recommendations
  const trainingRecs = document.getElementById('training-recs');
  if (trainingRecs) {
    trainingRecs.innerHTML = '';
    recommendations.forEach(rec => {
      const div = document.createElement('div');
      div.className = 'rec-item';
      div.textContent = rec;
      trainingRecs.appendChild(div);
    });
  }

  generateCycleCalendar();
}

function updateCompetitionCountdown() {
  const currentDate = new Date(appData.currentDate + 'T00:00:00');
  const competitionDate = new Date(appData.competitionInfo.targetDate + 'T00:00:00');
  
  const timeDiff = competitionDate - currentDate;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const weeksDiff = Math.ceil(daysDiff / 7);
  
  // Update countdown displays
  const daysElement = document.getElementById('days-to-competition');
  const weeksElement = document.getElementById('weeks-to-competition');
  
  if (daysElement) daysElement.textContent = Math.max(0, daysDiff);
  if (weeksElement) weeksElement.textContent = Math.max(0, weeksDiff);
}

function updateProgressTimelines() {
  // Update "X days ago" displays for measurements
  const latestMeasurement = appData.measurements[appData.measurements.length - 1];
  if (latestMeasurement) {
    const currentDate = new Date(appData.currentDate + 'T00:00:00');
    const measurementDate = new Date(latestMeasurement.date + 'T00:00:00');
    const daysSince = Math.floor((currentDate - measurementDate) / (1000 * 60 * 60 * 24));
    
    console.log(`Days since last measurement: ${daysSince}`);
  }
}

function updateNutritionForDay() {
  const currentDate = new Date(appData.currentDate + 'T00:00:00');
  const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Check if it's a training day
  const isTrainingDay = (dayOfWeek >= 1 && dayOfWeek <= 4) || dayOfWeek === 6 || dayOfWeek === 0;
  const isRestDay = dayOfWeek === 5; // Friday
  
  // Update nutrition day type
  const nutritionDayType = document.getElementById('nutrition-day-type');
  if (nutritionDayType) {
    if (isRestDay) {
      nutritionDayType.textContent = 'Rest Day';
      nutritionDayType.className = 'status status--info';
    } else {
      nutritionDayType.textContent = 'Training Day'; 
      nutritionDayType.className = 'status status--warning';
    }
  }
  
  // Update macro targets based on day type
  const calories = isRestDay ? '2200' : '2500';
  const protein = isRestDay ? '160g' : '180g';
  const carbs = isRestDay ? '250g' : '280g';
  
  const dailyCalories = document.getElementById('daily-calories');
  const dailyProtein = document.getElementById('daily-protein');  
  const dailyCarbs = document.getElementById('daily-carbs');
  const nutritionCalories = document.getElementById('nutrition-calories');
  const nutritionProtein = document.getElementById('nutrition-protein');
  const nutritionCarbs = document.getElementById('nutrition-carbs');
  
  if (dailyCalories) dailyCalories.textContent = calories;
  if (dailyProtein) dailyProtein.textContent = protein;
  if (dailyCarbs) dailyCarbs.textContent = carbs;
  if (nutritionCalories) nutritionCalories.textContent = calories + ' kcal';
  if (nutritionProtein) nutritionProtein.textContent = protein;
  if (nutritionCarbs) nutritionCarbs.textContent = carbs;
  
  // Update nutrition targets title
  const nutritionTitle = document.getElementById('nutrition-targets-title');
  if (nutritionTitle) {
    const dayType = isRestDay ? 'Rest Day' : 'Training Day';
    nutritionTitle.textContent = `Today's Goals - ${dayType}`;
  }
  
  // Update weekly schedule highlights
  updateNutritionWeekSchedule(dayOfWeek);
}

function updateNutritionWeekSchedule(currentDayOfWeek) {
  const scheduleGrid = document.getElementById('nutrition-week-schedule');
  if (!scheduleGrid) return;
  
  const dayElements = scheduleGrid.querySelectorAll('.day-nutrition');
  
  dayElements.forEach((element, index) => {
    // Reset classes
    element.className = 'day-nutrition';
    
    // Monday = index 0, Sunday = index 6
    const dayOfWeek = index === 6 ? 0 : index + 1; // Convert to JS day numbering
    
    if (dayOfWeek === currentDayOfWeek) {
      element.classList.add('active');
    } else if (dayOfWeek === 5) { // Friday
      element.classList.add('rest');
    }
  });
}

function updateWeeklyProgressDisplay() {
  const currentDate = new Date(appData.currentDate + 'T00:00:00');
  const dayOfWeek = currentDate.getDay();
  
  const weeklyStats = document.getElementById('weekly-stats');
  if (!weeklyStats) return;
  
  const dayIndicators = weeklyStats.querySelectorAll('.day-indicator');
  
  // Map indicators to days: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  const dayMapping = [1, 2, 3, 4, 5, 6, 0]; // Convert to JS day numbering
  
  dayIndicators.forEach((indicator, index) => {
    indicator.className = 'day-indicator';
    
    const indicatorDay = dayMapping[index];
    
    if (indicatorDay === dayOfWeek) {
      indicator.classList.add('active');
    } else if (indicatorDay === 5) { // Friday is always rest
      indicator.classList.add('rest');  
    } else {
      // For demo, show most days as completed
      if (index < 5) {
        indicator.classList.add('completed');
      }
    }
  });
}

// NEW: Auto-backup system with 3 changes
function incrementBackupCounter() {
  appData.autoBackup.changesCount++;
  updateAutoBackupDisplay();
  
  if (appData.autoBackup.changesCount >= appData.autoBackup.maxChanges) {
    triggerAutoBackup();
  }
}

function updateAutoBackupDisplay() {
  const backupCounter = document.getElementById('backup-counter');
  if (backupCounter) {
    backupCounter.textContent = `${appData.autoBackup.changesCount}/${appData.autoBackup.maxChanges} changes`;
  }
}

function triggerAutoBackup() {
  // Create backup data
  const backupData = {
    timestamp: new Date().toISOString(),
    currentDate: appData.currentDate,
    data: JSON.parse(JSON.stringify(appData)) // Deep clone
  };
  
  // Download backup file
  const dataStr = JSON.stringify(backupData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `aitashii-powerlifting-backup-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  // Reset counter
  appData.autoBackup.changesCount = 0;
  updateAutoBackupDisplay();
  
  // Also save to cloud if signed in
  if (isSignedIn) {
    saveUserData();
  }
  
  console.log('🌸 Auto-backup triggered and downloaded');
}

// Fixed Navigation
function initializeNavigation() {
  console.log('Initializing navigation...');
  
  const navItems = document.querySelectorAll('.nav__item');
  const sections = document.querySelectorAll('.section');
  
  console.log('Found nav items:', navItems.length);
  console.log('Found sections:', sections.length);

  navItems.forEach((item, index) => {
    console.log(`Nav item ${index}:`, item.dataset.section);
    
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = item.dataset.section;
      console.log('Clicking nav item:', targetSection);
      
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('nav__item--active'));
      item.classList.add('nav__item--active');
      
      // Update active section
      sections.forEach(section => {
        section.classList.remove('section--active');
        console.log('Removing active from:', section.id);
      });
      
      const targetElement = document.getElementById(targetSection);
      if (targetElement) {
        targetElement.classList.add('section--active');
        console.log('Adding active to:', targetSection);
      } else {
        console.error('Target section not found:', targetSection);
      }
    });
  });
}

// Timer Functions
function initializeTimer() {
  const startButton = document.getElementById('start-timer');
  if (!startButton) return;

  startButton.addEventListener('click', () => {
    if (!isTimerRunning) {
      startTimer();
      startButton.textContent = 'Stop Timer';
      startButton.classList.remove('btn--primary');
      startButton.classList.add('btn--secondary');
    } else {
      stopTimer();
      startButton.textContent = 'Start Timer';
      startButton.classList.remove('btn--secondary');
      startButton.classList.add('btn--primary');
    }
  });
}

function startTimer() {
  isTimerRunning = true;
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  isTimerRunning = false;
  clearInterval(timerInterval);
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById('timer-display');
  if (!timerDisplay) return;
  
  const hours = Math.floor(timerSeconds / 3600);
  const minutes = Math.floor((timerSeconds % 3600) / 60);
  const seconds = timerSeconds % 60;
  
  const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  timerDisplay.textContent = display;
}

// PR Management
function initializePRForm() {
  const form = document.getElementById('pr-form');
  if (!form) return;

  const weightInput = document.getElementById('pr-weight');
  const repsInput = document.getElementById('pr-reps');
  const estimatedDisplay = document.getElementById('estimated-1rm-display');
  const dateInput = document.getElementById('pr-date');

  // Set current app date (not system date)
  if (dateInput) {
    dateInput.value = appData.currentDate;
  }

  // Calculate estimated 1RM on input change
  if (weightInput && repsInput && estimatedDisplay) {
    [weightInput, repsInput].forEach(input => {
      input.addEventListener('input', () => {
        const weight = parseFloat(weightInput.value);
        const reps = parseInt(repsInput.value);
        
        if (weight && reps) {
          const estimated1RM = calculate1RM(weight, reps);
          estimatedDisplay.textContent = `${estimated1RM}kg`;
        } else {
          estimatedDisplay.textContent = '-';
        }
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewPR();
  });
}

function calculate1RM(weight, reps) {
  if (reps === 1) return weight;
  // Brzycki formula
  return Math.round((weight * 36) / (37 - reps) * 2) / 2; // Round to nearest 0.5kg
}

function addNewPR() {
  const exercise = document.getElementById('pr-exercise').value;
  const weight = parseFloat(document.getElementById('pr-weight').value);
  const reps = parseInt(document.getElementById('pr-reps').value);
  const date = document.getElementById('pr-date').value;

  const estimated1RM = calculate1RM(weight, reps);

  // Update current PRs
  appData.currentPRs[exercise] = {
    weight: weight,
    reps: reps,
    date: date,
    estimated1RM: estimated1RM
  };

  // Add to history
  if (!appData.prHistory[exercise]) {
    appData.prHistory[exercise] = [];
  }
  appData.prHistory[exercise].push({
    date: date,
    weight: weight,
    reps: reps,
    estimated1RM: estimated1RM
  });

  // Sort history by date
  appData.prHistory[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Increment backup counter
  incrementBackupCounter();

  // Update dashboard and charts
  updateDashboard();
  updatePRChart();
  
  // Reset form
  document.getElementById('pr-form').reset();
  document.getElementById('pr-date').value = appData.currentDate;
  document.getElementById('estimated-1rm-display').textContent = '-';

  alert(`🌸 New PR added! ${exercise.toUpperCase()}: ${weight}kg x${reps} (Est. 1RM: ${estimated1RM}kg)\n\nAll training weights have been updated.`);
  
  // Save to cloud if signed in
  if (isSignedIn) {
    saveUserData();
  }
}

// Enhanced Measurements with Fat Mass Calculation
function setupFatMassCalculation() {
  const weightInput = document.getElementById('measurement-weight');
  const bodyFatInput = document.getElementById('measurement-bodyfat');
  const fatMassInput = document.getElementById('measurement-fatmass');

  if (!weightInput || !bodyFatInput || !fatMassInput) return;

  function calculateFatMass() {
    const weight = parseFloat(weightInput.value);
    const bodyFat = parseFloat(bodyFatInput.value);
    
    if (weight && bodyFat) {
      const fatMass = Math.round((weight * bodyFat / 100) * 10) / 10;
      fatMassInput.value = fatMass;
    } else {
      fatMassInput.value = '';
    }
  }

  weightInput.addEventListener('input', calculateFatMass);
  bodyFatInput.addEventListener('input', calculateFatMass);
}

function initializeMeasurementsForm() {
  const form = document.getElementById('measurements-form');
  if (!form) return;
  
  // Set current app date
  const dateInput = document.getElementById('measurement-date');
  if (dateInput) {
    dateInput.value = appData.currentDate;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addMeasurement();
  });
}

function addMeasurement() {
  const date = document.getElementById('measurement-date').value;
  const weight = parseFloat(document.getElementById('measurement-weight').value);
  const bodyFat = parseFloat(document.getElementById('measurement-bodyfat').value);
  const muscle = parseFloat(document.getElementById('measurement-muscle').value);
  const fatMass = parseFloat(document.getElementById('measurement-fatmass').value);
  const bodyWater = parseFloat(document.getElementById('measurement-bodywater').value);

  const measurement = { 
    date, 
    weight, 
    bodyFat, 
    muscle, 
    fatMass: fatMass || (weight * bodyFat / 100),
    bodyWater 
  };
  
  appData.measurements.push(measurement);
  
  // Sort by date
  appData.measurements.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Update current stats in bodyGoals
  appData.bodyGoals.current = {
    weight: weight,
    bodyFat: bodyFat,
    fatMass: fatMass || (weight * bodyFat / 100),
    muscleMass: muscle,
    bodyWater: bodyWater
  };

  // Increment backup counter
  incrementBackupCounter();

  // Update charts and dashboard
  updateWeightChart();
  updateBodyFatChart();
  updateBodyCompositionDisplay();
  updateDashboard();

  // Reset form
  document.getElementById('measurements-form').reset();
  document.getElementById('measurement-date').value = appData.currentDate;

  alert('🌸 Measurements saved!');
  
  // Save to cloud if signed in
  if (isSignedIn) {
    saveUserData();
  }
}

// Menstrual Cycle Tracker
function initializeCycleTracker() {
  const updateButton = document.getElementById('update-cycle');
  if (!updateButton) return;
  
  // Set current period date
  const periodInput = document.getElementById('period-date');
  if (periodInput) {
    periodInput.value = appData.menstrualCycle.lastPeriod;
  }

  updateButton.addEventListener('click', () => {
    const periodDate = document.getElementById('period-date').value;
    if (periodDate) {
      appData.menstrualCycle.lastPeriod = periodDate;
      
      // Increment backup counter
      incrementBackupCounter();
      
      updateMenstrualCycleCalculations();
      updateDashboard();
      
      // Save to cloud if signed in
      if (isSignedIn) {
        saveUserData();
      }
      
      alert('🌸 Cycle updated!');
    }
  });
}

function generateCycleCalendar() {
  const calendar = document.getElementById('cycle-calendar-display');
  if (!calendar) return;
  
  const currentDate = new Date(appData.currentDate + 'T00:00:00');
  const lastPeriod = new Date(appData.menstrualCycle.lastPeriod + 'T00:00:00');
  
  // Clear calendar
  calendar.innerHTML = '';

  // Generate days for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Add day labels
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  dayLabels.forEach(label => {
    const dayLabel = document.createElement('div');
    dayLabel.className = 'calendar-day-label';
    dayLabel.textContent = label;
    dayLabel.style.fontWeight = 'bold';
    dayLabel.style.textAlign = 'center';
    dayLabel.style.padding = '8px';
    calendar.appendChild(dayLabel);
  });

  // Add empty cells for days before month starts
  const startDay = firstDay.getDay();
  for (let i = 0; i < startDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day';
    calendar.appendChild(emptyDay);
  }

  // Add days of month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;

    const dateToCheck = new Date(year, month, day);
    const daysDiff = Math.floor((dateToCheck - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysDiff % appData.menstrualCycle.cycleLength) + 1;

    // Mark special days
    if (dateToCheck.toDateString() === currentDate.toDateString()) {
      dayElement.classList.add('today');
    } else if (cycleDay <= 5) {
      dayElement.classList.add('period');
    } else if (cycleDay >= 12 && cycleDay <= 16) {
      dayElement.classList.add('fertile');
    }

    calendar.appendChild(dayElement);
  }
}

// Charts
function initializeCharts() {
  console.log('Initializing charts...');
  updatePRChart();
  updateWeightChart();
  updateBodyFatChart();
  updateProgressChart();
  updateVolumeChart();
}

function updatePRChart() {
  const canvas = document.getElementById('pr-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (charts.prChart) {
    charts.prChart.destroy();
  }

  const datasets = [];
  const colors = ['#1FB8CD', '#FFC185', '#B4413C'];
  let colorIndex = 0;

  ['squat', 'bench', 'deadlift'].forEach(lift => {
    if (appData.prHistory[lift]) {
      datasets.push({
        label: lift.charAt(0).toUpperCase() + lift.slice(1),
        data: appData.prHistory[lift].map(pr => ({
          x: pr.date,
          y: pr.estimated1RM
        })),
        borderColor: colors[colorIndex],
        backgroundColor: colors[colorIndex] + '20',
        fill: false,
        tension: 0.1
      });
      colorIndex++;
    }
  });

  charts.prChart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'PR Progress (Estimated 1RM)'
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
          beginAtZero: false,
          title: {
            display: true,
            text: 'Weight (kg)'
          }
        }
      }
    }
  });
}

function updateWeightChart() {
  const canvas = document.getElementById('weight-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  if (charts.weightChart) {
    charts.weightChart.destroy();
  }

  charts.weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: appData.measurements.map(m => formatDate(m.date)),
      datasets: [{
        label: 'Weight (kg)',
        data: appData.measurements.map(m => m.weight),
        borderColor: '#1FB8CD',
        backgroundColor: '#1FB8CD20',
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Weight Progress'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Weight (kg)'
          }
        }
      }
    }
  });
}

function updateBodyFatChart() {
  const canvas = document.getElementById('bodyfat-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  if (charts.bodyFatChart) {
    charts.bodyFatChart.destroy();
  }

  const muscleData = appData.measurements.map(m => m.muscle || (m.weight * (100 - m.bodyFat) / 100 * 0.7));
  const fatData = appData.measurements.map(m => m.fatMass || (m.weight * m.bodyFat / 100));
  const waterData = appData.measurements.map(m => m.bodyWater || 0);

  charts.bodyFatChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: appData.measurements.map(m => formatDate(m.date)),
      datasets: [
        {
          label: 'Muscle Mass (kg)',
          data: muscleData,
          borderColor: '#B4413C',
          backgroundColor: '#B4413C20',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Fat Mass (kg)',
          data: fatData,
          borderColor: '#FFC185',
          backgroundColor: '#FFC18520',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Body Water (kg)',
          data: waterData,
          borderColor: '#5D878F',
          backgroundColor: '#5D878F20',
          fill: false,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Body Composition - Detailed'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Mass (kg)'
          }
        }
      }
    }
  });
}

function updateProgressChart() {
  const canvas = document.getElementById('total-progress-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  if (charts.progressChart) {
    charts.progressChart.destroy();
  }

  const currentTotal = appData.currentPRs.squat.estimated1RM + 
                      appData.currentPRs.bench.estimated1RM + 
                      appData.currentPRs.deadlift.estimated1RM;

  const targetTotal = 60 + 65 + 120; // Target totals

  charts.progressChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Current Total', 'To Goal'],
      datasets: [{
        data: [currentTotal, targetTotal - currentTotal],
        backgroundColor: ['#1FB8CD', '#ECEBD5'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Progress to Goal: ${currentTotal}kg / ${targetTotal}kg`
        }
      }
    }
  });
}

function updateVolumeChart() {
  const canvas = document.getElementById('weekly-volume-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  if (charts.volumeChart) {
    charts.volumeChart.destroy();
  }

  // Sample weekly volume data across all phases
  const weeklyVolumes = [12450, 13200, 11800, 14100, 13600, 12900, 15200, 14800, 16100, 15400];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 
                 'Week 7', 'Week 8', 'Week 9', 'Week 10'];

  charts.volumeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weeks,
      datasets: [{
        label: 'Weekly Volume (kg)',
        data: weeklyVolumes,
        backgroundColor: '#5D878F',
        borderColor: '#5D878F',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Training Volume - 30 Week Plan'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Volume (kg)'
          }
        }
      }
    }
  });
}

// Enhanced Dashboard Updates
function updateDashboard() {
  updatePRDisplay();
  updateBodyCompositionDisplay();
  updateWorkoutPreview();
}

function updateBodyCompositionDisplay() {
  const current = appData.bodyGoals.current;
  const target = appData.bodyGoals.target;
  const changes = appData.bodyGoals.changes;

  // Update main status display
  const statusDisplay = document.querySelector('.body-comp-card .status');
  if (statusDisplay) {
    statusDisplay.textContent = `${current.weight}kg → ${target.weight}kg`;
  }

  // Calculate progress percentages for each metric
  const weightProgress = ((84.1 - current.weight) / (84.1 - target.weight)) * 100;
  const fatProgress = ((38 - current.bodyFat) / (38 - target.bodyFat)) * 100;
  const muscleProgress = ((current.muscleMass - 44.3) / (target.muscleMass - 44.3)) * 100;
  const waterProgress = ((current.bodyWater - 38.1) / (target.bodyWater - 38.1)) * 100;

  // Update progress bars and text
  const progressBars = document.querySelectorAll('.body-comp-card .progress-fill');
  const progressTexts = document.querySelectorAll('.body-comp-card .progress-text');
  
  if (progressBars.length >= 4 && progressTexts.length >= 4) {
    // Weight progress
    progressBars[0].style.width = `${Math.min(100, Math.max(0, weightProgress))}%`;
    progressTexts[0].textContent = `-${(84.1 - current.weight).toFixed(1)}kg of -${changes.netWeightLoss}kg`;
    
    // Fat progress  
    progressBars[1].style.width = `${Math.min(100, Math.max(0, fatProgress))}%`;
    progressTexts[1].textContent = `-${(38 - current.bodyFat).toFixed(1)}% body fat`;
    
    // Muscle progress
    progressBars[2].style.width = `${Math.min(100, Math.max(0, muscleProgress))}%`;
    progressTexts[2].textContent = `+${(current.muscleMass - 44.3).toFixed(1)}kg of +${changes.muscleGain}kg`;
    
    // Water progress
    progressBars[3].style.width = `${Math.min(100, Math.max(0, waterProgress))}%`;
    progressTexts[3].textContent = `+${(current.bodyWater - 38.1).toFixed(1)}kg of +${changes.waterGain}kg`;
  }
}

function updatePRDisplay() {
  const prItems = document.querySelectorAll('.pr-item');
  
  // Update Squat
  if (prItems[0]) {
    const squatWeight = prItems[0].querySelector('.pr-weight');
    const squatDate = prItems[0].querySelector('.pr-date');
    const squat1RM = prItems[0].querySelector('.pr-1rm');
    
    if (squatWeight) squatWeight.textContent = `${appData.currentPRs.squat.weight}kg x${appData.currentPRs.squat.reps}`;
    if (squatDate) squatDate.textContent = formatDate(appData.currentPRs.squat.date);
    if (squat1RM) squat1RM.textContent = `(Est. 1RM: ${appData.currentPRs.squat.estimated1RM}kg)`;
  }
  
  // Update Bench
  if (prItems[1]) {
    const benchWeight = prItems[1].querySelector('.pr-weight');
    const benchDate = prItems[1].querySelector('.pr-date');
    const bench1RM = prItems[1].querySelector('.pr-1rm');
    
    if (benchWeight) benchWeight.textContent = `${appData.currentPRs.bench.weight}kg x${appData.currentPRs.bench.reps}`;
    if (benchDate) benchDate.textContent = formatDate(appData.currentPRs.bench.date);
    if (bench1RM) bench1RM.textContent = `(1RM: ${appData.currentPRs.bench.estimated1RM}kg)`;
  }
  
  // Update Deadlift
  if (prItems[2]) {
    const deadliftWeight = prItems[2].querySelector('.pr-weight');
    const deadliftDate = prItems[2].querySelector('.pr-date');
    const deadlift1RM = prItems[2].querySelector('.pr-1rm');
    
    if (deadliftWeight) deadliftWeight.textContent = `${appData.currentPRs.deadlift.weight}kg x${appData.currentPRs.deadlift.reps}`;
    if (deadliftDate) deadliftDate.textContent = formatDate(appData.currentPRs.deadlift.date);
    if (deadlift1RM) deadlift1RM.textContent = `(1RM: ${appData.currentPRs.deadlift.estimated1RM}kg)`;
  }
}

function updateWorkoutPreview() {
  const currentPhase = calculateCurrentPhase();
  
  // Calculate training weights based on current PRs and phase
  let intensity = 0.67; // Default for hypertrophy phase
  
  if (currentPhase.key === 'phase1') intensity = 0.67;
  else if (currentPhase.key === 'phase2') intensity = 0.8;
  else if (currentPhase.key === 'phase3') intensity = 0.9;
  else if (currentPhase.key === 'phase4') intensity = 0.85;
  
  const squatWeight = Math.round(appData.currentPRs.squat.estimated1RM * intensity / 2.5) * 2.5;
  const benchWeight = Math.round(appData.currentPRs.bench.estimated1RM * intensity / 2.5) * 2.5;
  const deadliftWeight = Math.round(appData.currentPRs.deadlift.estimated1RM * intensity / 2.5) * 2.5;
  
  const liftPreviews = document.querySelectorAll('.lift-preview');
  if (liftPreviews.length >= 3) {
    liftPreviews[0].innerHTML = `<strong>Squat:</strong> 5x5 @ ${squatWeight}kg (${Math.round(intensity * 100)}%)`;
    liftPreviews[1].innerHTML = `<strong>Bench:</strong> 4x6 @ ${benchWeight}kg (${Math.round(intensity * 100)}%)`;
    liftPreviews[2].innerHTML = `<strong>Deadlift:</strong> 4x5 @ ${deadliftWeight}kg (${Math.round(intensity * 100)}%)`;
  }
  
  // Update actual workout weights in workout section
  updateWorkoutWeights();
}

function updateWorkoutWeights() {
  const currentPhase = calculateCurrentPhase();
  
  let intensity = 0.67; // Default for hypertrophy phase
  
  if (currentPhase.key === 'phase1') intensity = 0.67;
  else if (currentPhase.key === 'phase2') intensity = 0.8;
  else if (currentPhase.key === 'phase3') intensity = 0.9;
  else if (currentPhase.key === 'phase4') intensity = 0.85;
  
  const squatWeight = Math.round(appData.currentPRs.squat.estimated1RM * intensity / 2.5) * 2.5;
  const benchWeight = Math.round(appData.currentPRs.bench.estimated1RM * intensity / 2.5) * 2.5;
  const deadliftWeight = Math.round(appData.currentPRs.deadlift.estimated1RM * intensity / 2.5) * 2.5;
  
  // Update exercise intensities
  const intensityDisplays = document.querySelectorAll('.exercise-intensity');
  if (intensityDisplays.length >= 3) {
    intensityDisplays[0].textContent = `${Math.round(intensity * 100)}% (${squatWeight}kg)`;
    intensityDisplays[1].textContent = `${Math.round(intensity * 100)}% (${benchWeight}kg)`;
    intensityDisplays[2].textContent = `${Math.round(intensity * 100)}% (${deadliftWeight}kg)`;
  }
  
  // Update set rows
  const exerciseCards = document.querySelectorAll('.exercise-card');
  
  // Squat
  if (exerciseCards[0]) {
    const setRows = exerciseCards[0].querySelectorAll('.set-row span');
    if (setRows.length >= 6) {
      setRows[0].textContent = `Warm-up: ${Math.round((squatWeight * 0.7) / 2.5) * 2.5}kg x 8`;
      for (let i = 1; i <= 5; i++) {
        setRows[i].textContent = `Set ${i}: ${squatWeight}kg x 5`;
      }
    }
  }
  
  // Bench
  if (exerciseCards[1]) {
    const setRows = exerciseCards[1].querySelectorAll('.set-row span');
    if (setRows.length >= 5) {
      setRows[0].textContent = `Warm-up: ${Math.round((benchWeight * 0.7) / 2.5) * 2.5}kg x 8`;
      for (let i = 1; i <= 4; i++) {
        setRows[i].textContent = `Set ${i}: ${benchWeight}kg x 6`;
      }
    }
  }
  
  // Deadlift
  if (exerciseCards[2]) {
    const setRows = exerciseCards[2].querySelectorAll('.set-row span');
    if (setRows.length >= 5) {
      setRows[0].textContent = `Warm-up: ${Math.round((deadliftWeight * 0.7) / 2.5) * 2.5}kg x 5`;
      for (let i = 1; i <= 4; i++) {
        setRows[i].textContent = `Set ${i}: ${deadliftWeight}kg x 5`;
      }
    }
  }
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatDateFull(date) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${day} ${month} ${year}`;
}

// Additional Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Shake calculator
  const shakeButton = document.querySelector('.shake-calculator .btn--secondary');
  if (shakeButton) {
    shakeButton.addEventListener('click', function() {
      incrementBackupCounter();
      alert('🌸 Shake added to log!\n\n278 kcal, 53.5g protein has been counted towards today\'s macros.');
    });
  }

  // Set completion tracking with enhanced feedback
  const checkboxes = document.querySelectorAll('.set-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        incrementBackupCounter();
      }
      
      const setRow = this.closest('.set-row');
      if (this.checked) {
        setRow.style.backgroundColor = 'var(--color-success)';
        setRow.style.color = 'var(--color-white)';
        setRow.style.borderRadius = 'var(--radius-sm)';
        
        // Add completion animation
        setRow.style.transform = 'scale(1.02)';
        setTimeout(() => {
          setRow.style.transform = 'scale(1)';
        }, 200);
        
        // Save to cloud if signed in
        if (isSignedIn) {
          saveUserData();
        }
      } else {
        setRow.style.backgroundColor = '';
        setRow.style.color = '';
      }
    });
  });
});

console.log('🌸🐱 Aitashii Powerlifting Tracker loaded successfully!');
