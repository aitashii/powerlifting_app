// 🌸🐱 6xSBD PWA Training Tracker - FIXED HAMBURGER MENU
// Fixed menu + all functionality working

let appData = {
  // PWA version tracking
  version: '1.0.0',
  lastUpdated: null,
  
  // Current Date System - controls all date-dependent functionality
  currentDate: "2025-08-25",
  
  // Auto-backup settings (3 changes)
  autoBackup: {
    changesCount: 0,
    maxChanges: 3,
    autoDownload: true,
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
      muscle: 27.1,        // FIXED: was 44.3, now correct 27.1
      fatMass: 32.7,       // FIXED: was 32.0, now correct 32.7
      bodyWater: 37.7      // FIXED: was 38.1, now correct 37.7
    }
  ],
  
  // FIXED: Body composition goals with correct data
  bodyGoals: {
    current: {
      weight: 84.1,
      bodyFat: 38,
      fatMass: 32.7,      // FIXED
      muscleMass: 27.1,   // FIXED
      bodyWater: 37.7     // FIXED
    },
    target: {
      weight: 72,
      bodyFat: 20,        // FIXED: was 18, you said 20%
      fatMass: 13.0,
      muscleMass: 32.7,   // FIXED: +5.6kg from current
      bodyWater: 43.1     // FIXED: +5.4kg from current
    },
    changes: {
      fatLoss: 19.7,      // FIXED: 32.7 - 13.0
      muscleGain: 5.6,    // FIXED: 32.7 - 27.1
      waterGain: 5.4,     // FIXED: 43.1 - 37.7
      netWeightLoss: 12.1 // 84.1 - 72
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
  
  // Complete 4-phase training plan with exact dates
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

// Chart instances
let charts = {};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌸 6xSBD PWA initializing...');
  
  try {
    // Load data from localStorage - LIVE SAVING!
    loadDataFromStorage();
    
    // Initialize all components step by step
    initializeHamburgerMenu();
    initializeDateSystem();
    initializeAutoBackup();
    initializeForms();
    initializeCharts();
    
    updateDashboard();
    updateAllDateDependencies();
    
    console.log('✅ 6xSBD PWA ready with LIVE SAVING!');
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    // Show basic interface even if there's an error
    document.body.innerHTML += '<div style="position:fixed;top:10px;right:10px;background:red;color:white;padding:10px;border-radius:5px;">⚠️ JavaScript Error - Check Console</div>';
  }
});

// ==== LIVE SAVING PWA FUNCTIONALITY ====

function loadDataFromStorage() {
  try {
    const savedData = localStorage.getItem('6xsbd-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      appData = { ...appData, ...parsed };
      console.log('📱 Data loaded from localStorage - LIVE!');
    }
  } catch (error) {
    console.error('❌ Error loading data from localStorage:', error);
  }
}

function saveDataToStorage() {
  try {
    appData.lastUpdated = new Date().toISOString();
    localStorage.setItem('6xsbd-data', JSON.stringify(appData));
    console.log('💾 Data saved LIVE to localStorage');
    
    // Show subtle save indicator
    showSaveIndicator();
  } catch (error) {
    console.error('❌ Error saving data to localStorage:', error);
  }
}

function showSaveIndicator() {
  // Create or update save indicator
  let indicator = document.getElementById('save-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'save-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #22c55e;
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(indicator);
  }
  
  indicator.textContent = '💾 Zapisano';
  indicator.style.opacity = '1';
  
  setTimeout(() => {
    indicator.style.opacity = '0';
  }, 1500);
}

// ==== FIXED HAMBURGER MENU FUNCTIONALITY ====

function initializeHamburgerMenu() {
  console.log('🍔 Initializing hamburger menu...');
  
  // Wait a bit for DOM to be fully ready
  setTimeout(() => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const slidingMenu = document.getElementById('sliding-menu');
    const menuItems = document.querySelectorAll('.menu-item');

    if (!hamburgerBtn) {
      console.error('❌ Hamburger button not found!');
      return;
    }

    console.log('✅ Found hamburger button, setting up events...');

    // Clear any existing event listeners
    hamburgerBtn.replaceWith(hamburgerBtn.cloneNode(true));
    const newHamburgerBtn = document.getElementById('hamburger-btn');

    // Open menu
    newHamburgerBtn.addEventListener('click', function(e) {
      console.log('🍔 Hamburger clicked!');
      e.preventDefault();
      e.stopPropagation();
      openMenu();
    });

    // Close menu
    if (closeMenuBtn) {
      closeMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      });
    }

    // Close menu when clicking overlay
    if (menuOverlay) {
      menuOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
      });
    }

    // Menu item navigation
    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const section = this.getAttribute('data-section');
        console.log('📱 Menu item clicked:', section);
        
        if (section) {
          showSection(section);
          closeMenu();
          
          // Update active menu item
          menuItems.forEach(mi => mi.classList.remove('active'));
          this.classList.add('active');
        }
      });
    });

    // Swipe to open menu
    let startX = 0;
    let currentX = 0;
    let isSwipingFromEdge = false;

    document.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isSwipingFromEdge = startX < 30; // Edge swipe detection
    });

    document.addEventListener('touchmove', function(e) {
      if (!isSwipingFromEdge) return;
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      
      if (deltaX > 50 && slidingMenu && !slidingMenu.classList.contains('active')) {
        openMenu();
      }
    });

    function openMenu() {
      console.log('📂 Opening menu...');
      if (newHamburgerBtn) newHamburgerBtn.classList.add('active');
      if (menuOverlay) menuOverlay.classList.add('active');
      if (slidingMenu) slidingMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Add haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }

    function closeMenu() {
      console.log('📁 Closing menu...');
      if (newHamburgerBtn) newHamburgerBtn.classList.remove('active');
      if (menuOverlay) menuOverlay.classList.remove('active');
      if (slidingMenu) slidingMenu.classList.remove('active');
      document.body.style.overflow = '';
    }

    console.log('🍔 Hamburger menu initialized successfully!');
  }, 100);
}

// ==== DYNAMIC DATE SYSTEM ====

function initializeDateSystem() {
  console.log('📅 Initializing date system...');
  
  const datePicker = document.getElementById('current-date-picker');
  if (!datePicker) {
    console.warn('⚠️ Date picker not found');
    return;
  }
  
  // Set initial date
  datePicker.value = appData.currentDate;
  
  // Listen for date changes
  datePicker.addEventListener('change', function(e) {
    const newDate = e.target.value;
    if (newDate) {
      updateCurrentDate(newDate);
    }
  });
  
  console.log('📅 Dynamic Date System initialized');
}

function updateCurrentDate(newDate) {
  const oldDate = appData.currentDate;
  appData.currentDate = newDate;
  
  console.log(`📅 Date changed: ${oldDate} → ${newDate}`);
  
  // LIVE SAVE the change
  saveDataToStorage();
  
  // Track change for auto-backup
  trackChange(`Zmieniono datę na ${formatDatePolish(newDate)}`);
  
  // Update all date-dependent systems
  updateAllDateDependencies();
  
  // Show notification
  showNotification('success', 'Data ustawiona!', `Ustawiono na ${formatDatePolish(newDate)}`);
}

function updateAllDateDependencies() {
  try {
    updateDateDisplay();
    updateTrainingPhaseStatus();
    updateDailyWorkout();
    updateMenstrualCycleStatus();
    updateNutritionTargets();
    updateCompetitionCountdown();
    updateProgressTimelines();
    
    console.log('🔄 All date dependencies updated');
  } catch (error) {
    console.error('❌ Error updating date dependencies:', error);
  }
}

function updateDateDisplay() {
  const currentDate = new Date(appData.currentDate);
  const formattedDate = formatDatePolish(appData.currentDate);
  const dayOfWeek = getDayOfWeekPolish(currentDate);
  
  // Update header date info
  const dateInfo = document.getElementById('date-info');
  if (dateInfo) {
    dateInfo.textContent = `${dayOfWeek}, ${formattedDate}`;
  }
  
  // Update main dashboard date display
  const currentDateDisplay = document.getElementById('current-date-display');
  if (currentDateDisplay) {
    currentDateDisplay.textContent = `${dayOfWeek}, ${formattedDate}`;
  }
}

function updateTrainingPhaseStatus() {
  const currentDate = new Date(appData.currentDate);
  let currentPhase = null;
  let phaseStatus = "";
  
  // Check which phase we're in
  for (const [phaseKey, phase] of Object.entries(appData.trainingPhases)) {
    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);
    
    if (currentDate >= startDate && currentDate <= endDate) {
      currentPhase = phase;
      phaseStatus = `${phaseKey.charAt(phaseKey.length - 1)}/4 - ${phase.name.split(' ')[0]}`;
      break;
    }
  }
  
  // Update phase indicators
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
  const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayName = getDayOfWeekPolish(currentDate);
  
  const workoutTitle = document.getElementById('workout-title');
  const workoutStatus = document.getElementById('workout-status');
  const workoutSummary = document.getElementById('workout-summary');
  const dayType = document.getElementById('day-type');
  
  let isTrainingDay = true;
  let workoutContent = '';
  
  // Friday (5) is rest day, all other days are training days
  if (dayOfWeek === 5) { // Friday
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
        <span class="exercise-name">🔧 Dynamic stretching w rozgrzewce</span>
      </div>
      <div class="exercise-item rest-day">
        <span class="exercise-name">🦵 Joint mobility</span>
      </div>
    `;
  } else {
    // Training day - calculate workout based on current phase
    const currentPhase = getCurrentTrainingPhase();
    
    if (workoutTitle) workoutTitle.textContent = `💪 Trening na ${dayName}`;
    if (workoutStatus) {
      workoutStatus.textContent = 'Dzień treningowy - 6xSBD';
      workoutStatus.className = 'status status--success';
    }
    if (dayType) dayType.textContent = 'Dzień treningowy (6xSBD)';
    
    if (currentPhase) {
      // Calculate weights based on CURRENT PRs and phase intensity
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
  
  // Update detailed workout view
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
            <ul>
              <li>Leg swings - 2x10 każda noga</li>
              <li>Hip circles - 2x10 każdy kierunek</li>
              <li>Arm circles - 2x10 każdy kierunek</li>
            </ul>
          </div>
        </div>
        
        <div class="exercise-item rest-day">
          <div class="exercise-details">
            <h5>🎯 Praca nad przywodzicielami</h5>
            <p>Specjalnie dla Ciebie - wzmacnianie</p>
            <ul>
              <li>Adductor squeezes - 3x15</li>
              <li>Side lunges - 2x12 każda strona</li>
              <li>Cossack squats - 2x8 każda strona</li>
            </ul>
          </div>
        </div>
        
        <div class="exercise-item rest-day">
          <div class="exercise-details">
            <h5>Mobility Work</h5>
            <p>Joint mobility i deep stretching</p>
            <ul>
              <li>Cat-cow stretches - 2x10</li>
              <li>Hip flexor stretches - 2x30s każda strona</li>
              <li>Thoracic spine rotation - 2x10 każda strona</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (currentPhase) {
    if (workoutDetailTitle) {
      workoutDetailTitle.textContent = `💪 Trening na ${dayName} - ${currentPhase.name}`;
    }
    
    // Use CURRENT PRs to calculate weights - this updates when PRs change!
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
          <p>💡 <strong>Tip:</strong> Bazowane na metodach Agaty Sitko</p>
          <p>🎪 Dostosuj ciężary do swojego samopoczucia</p>
          <p>🌸 Pamiętaj o rozgrzewce i cool-down!</p>
          <p>🔥 <strong>Ciężary aktualizują się automatycznie gdy dodasz nowe PR!</strong></p>
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
  
  // Update UI elements
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
  const isRestDay = dayOfWeek === 5; // Friday
  
  const nutritionTitle = document.getElementById('nutrition-title');
  const nutritionStatus = document.getElementById('nutrition-status');
  const nutritionTargets = document.getElementById('nutrition-targets');
  
  let calories, protein, carbs, fat;
  
  if (isRestDay) {
    calories = 2200;
    protein = 160;
    carbs = 250;
    fat = 70;
    
    if (nutritionTitle) nutritionTitle.textContent = `🥗 Żywienie na ${dayName}`;
    if (nutritionStatus) {
      nutritionStatus.textContent = 'Dzień odpoczynku';
      nutritionStatus.className = 'status status--warning';
    }
  } else {
    calories = 2500;
    protein = 180;
    carbs = 280;
    fat = 85;
    
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
            <div class="nutrient-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
              </div>
              <span class="nutrient-current">0 kcal</span>
            </div>
          </div>
          
          <div class="nutrient-card">
            <div class="nutrient-header">
              <span class="nutrient-name">Białko</span>
              <span class="nutrient-target">${protein}g</span>
            </div>
            <div class="nutrient-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
              </div>
              <span class="nutrient-current">0g</span>
            </div>
          </div>
          
          <div class="nutrient-card">
            <div class="nutrient-header">
              <span class="nutrient-name">Węglowodany</span>
              <span class="nutrient-target">${carbs}g</span>
            </div>
            <div class="nutrient-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
              </div>
              <span class="nutrient-current">0g</span>
            </div>
          </div>
          
          <div class="nutrient-card">
            <div class="nutrient-header">
              <span class="nutrient-name">Tłuszcz</span>
              <span class="nutrient-target">${fat}g</span>
            </div>
            <div class="nutrient-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
              </div>
              <span class="nutrient-current">0g</span>
            </div>
          </div>
        </div>
        
        <div class="nutrition-tips">
          <h5>💡 ${isRestDay ? 'Wskazówki na dzień odpoczynku' : 'Wskazówki na dzień treningowy'}</h5>
          ${isRestDay ? 
            `<p>🌙 Utrzymuj stabilny poziom cukru we krwi. Skup się na jakościowych źródłach białka i zdrowych tłuszczach.</p>
             <p>💧 Pij dużo wody (minimum 2.5L)</p>
             <p>🥬 Zwiększ spożycie warzyw liściastych</p>` :
            `<p>💪 Zwiększ spożycie węglowodanów 2-3h przed treningiem. Po treningu skup się na białku (25-30g) i węglowodanach prostych.</p>
             <p>⏰ Posiłek potreningowy w ciągu 30 minut</p>
             <p>💧 Pij dużo wody (minimum 3L w dni treningowe)</p>`
          }
        </div>
      </div>
    `;
  }
}

function updateCompetitionCountdown() {
  const currentDate = new Date(appData.currentDate);
  const competitionDate = new Date('2026-03-30'); // End of peaking phase
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
  
  // Update PR age display
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
  
  return appData.trainingPhases.phase1; // Default to phase 1
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

function setToday() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('current-date-picker').value = today;
  updateCurrentDate(today);
}

// ==== AUTO-BACKUP SYSTEM ====

function initializeAutoBackup() {
  console.log('💾 Initializing auto-backup...');
  
  // Manual backup button
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
  
  console.log('💾 Auto-Backup System initialized');
}

function trackChange(changeDescription = 'Dodano dane') {
  appData.autoBackup.changesCount++;
  
  console.log(`📊 Change tracked: ${changeDescription} (${appData.autoBackup.changesCount}/${appData.autoBackup.maxChanges})`);
  
  // LIVE SAVE every change!
  saveDataToStorage();
  
  // Update UI
  updateAutoBackupUI();
  
  // Show notification when backup is ready
  if (appData.autoBackup.changesCount === appData.autoBackup.maxChanges) {
    showNotification('info', '💾 Auto-backup gotowy!', 'Kliknij Manual Backup aby pobrać plik.');
  }
}

function performManualBackup() {
  try {
    console.log('🔧 Performing manual backup...');
    
    const backupData = createBackupData();
    const fileName = generateBackupFileName('manual');
    
    downloadBackupFile(backupData, fileName);
    
    // Reset counter
    appData.autoBackup.changesCount = 0;
    appData.autoBackup.lastBackup = new Date().toISOString();
    
    // LIVE SAVE the reset
    saveDataToStorage();
    updateAutoBackupUI();
    
    showNotification('success', '✅ Manual backup wykonany!', 'Backup został pobrany pomyślnie!');
    
  } catch (error) {
    console.error('❌ Manual backup failed:', error);
    showNotification('error', '❌ Błąd!', 'Backup nie powiódł się!');
  }
}

function exportForTrainer() {
  try {
    console.log('📊 Creating trainer export...');
    
    const trainerData = {
      exportType: 'trainer-analysis',
      version: appData.version,
      timestamp: new Date().toISOString(),
      currentDate: appData.currentDate,
      
      // Current status
      currentPRs: appData.currentPRs,
      currentMeasurements: appData.measurements[appData.measurements.length - 1] || null,
      currentPhase: getCurrentTrainingPhase(),
      
      // Historical data
      prHistory: appData.prHistory,
      measurementsHistory: appData.measurements,
      
      // Health data
      menstrualCycle: appData.menstrualCycle,
      bodyGoals: appData.bodyGoals
    };
    
    const fileName = `6xSBD-trainer-export-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-')}.json`;
    const jsonString = JSON.stringify(trainerData, null, 2);
    downloadJsonFile(jsonString, fileName);
    
    showNotification('success', '📊 Export dla trenera gotowy!', 'Wyślij ten plik swojemu AI trenerowi do analizy!');
    
  } catch (error) {
    console.error('❌ Trainer export failed:', error);
    showNotification('error', '❌ Błąd!', 'Export nie powiódł się!');
  }
}

function createBackupData() {
  return {
    version: "1.0",
    backupType: "complete",
    timestamp: new Date().toISOString(),
    appData: { ...appData }
  };
}

function generateBackupFileName(type = 'auto') {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 16).replace(/[T:]/g, '-');
  return `6xSBD-backup-${type}-${dateStr}.json`;
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
  const remaining = maxChanges - changesCount;
  const progressPercent = (changesCount / maxChanges) * 100;
  
  // Update counter in menu
  const backupCounter = document.getElementById('backup-counter');
  if (backupCounter) {
    backupCounter.textContent = `${changesCount}/${maxChanges} zmian`;
  }
  
  // Update progress bar in menu
  const backupProgressFill = document.getElementById('backup-progress-fill');
  if (backupProgressFill) {
    backupProgressFill.style.width = `${progressPercent}%`;
  }
  
  // Update backup status page elements
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
  
  if (!file.name.includes('6xSBD-backup') || !file.name.endsWith('.json')) {
    showNotification('error', '❌ Błąd!', 'To nie wygląda na plik backupu 6xSBD.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const backupData = JSON.parse(e.target.result);
      
      if (!backupData.appData) {
        throw new Error('Invalid backup format');
      }
      
      // Restore data
      appData = { ...backupData.appData };
      
      // Update date picker
      const datePicker = document.getElementById('current-date-picker');
      if (datePicker) {
        datePicker.value = appData.currentDate;
      }
      
      // LIVE SAVE and refresh UI
      saveDataToStorage();
      updateDashboard();
      updateAllDateDependencies();
      updateAutoBackupUI();
      updateCharts();
      
      showNotification('success', '✅ Dane przywrócone!', 'Backup został załadowany pomyślnie!');
      
    } catch (error) {
      console.error('❌ Restore failed:', error);
      showNotification('error', '❌ Błąd!', 'Nie można odczytać pliku backupu.');
    }
  };
  
  reader.readAsText(file);
}

// ==== FORMS AND USER INPUT ====

function initializeForms() {
  console.log('📝 Initializing forms...');
  
  // PR Form
  const prForm = document.getElementById('pr-form');
  if (prForm) {
    prForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addNewPR();
    });
  }
  
  // Measurements Form
  const measurementsForm = document.getElementById('measurements-form');
  if (measurementsForm) {
    measurementsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addNewMeasurement();
    });
  }
  
  // Cycle Form
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
    // Calculate estimated 1RM using Epley formula
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
    
    // Sort history by date
    appData.prHistory[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Track change for auto-backup + LIVE SAVE
    trackChange(`Nowe PR ${exercise}: ${weight}kg x${reps}`);
    
    // Update UI - this will show new weights in all workouts!
    updateDashboard();
    updateAllDateDependencies();
    updateCharts();
    
    // Clear form
    document.getElementById('pr-form').reset();
    
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
    
    showNotification('success', `🏆 Nowe PR ${exercise}!`, `${weight}kg x${reps} - wszystkie treningi zaktualizowane!`);
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
  
  // Update current stats with latest measurement
  const latest = appData.measurements[appData.measurements.length - 1];
  appData.bodyGoals.current = {
    weight: latest.weight,
    bodyFat: latest.bodyFat,
    fatMass: latest.fatMass,
    muscleMass: latest.muscle,
    bodyWater: latest.bodyWater
  };
  
  // Track change for auto-backup + LIVE SAVE
  trackChange('Dodano nowy pomiar');
  
  updateDashboard();
  updateAllDateDependencies();
  updateCharts();
  
  // Clear form
  document.getElementById('measurements-form').reset();
  
  showNotification('success', '📊 Nowy pomiar dodany!', 'Dane zostały zapisane!');
}

function updateCycleData() {
  const periodStart = document.getElementById('period-start').value;
  const periodEnd = document.getElementById('period-end').value;
  const cycleLength = parseInt(document.getElementById('cycle-length').value);
  
  if (periodStart && periodEnd && cycleLength) {
    appData.menstrualCycle.lastPeriodStart = periodStart;
    appData.menstrualCycle.lastPeriodEnd = periodEnd;
    appData.menstrualCycle.cycleLength = cycleLength;
    
    // Calculate period length
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    const periodLength = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    appData.menstrualCycle.periodLength = periodLength;
    
    // Track change for auto-backup + LIVE SAVE
    trackChange('Zaktualizowano cykl menstruacyjny');
    
    updateMenstrualCycleStatus();
    updateDashboard();
    
    // Clear form
    document.getElementById('cycle-form').reset();
    
    showNotification('success', '🌙 Cykl zaktualizowany!', 'Dane zostały zapisane!');
  }
}

// ==== CHARTS FUNCTIONALITY ====

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
  
  // Update active section
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('section--active'));
  
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('section--active');
  }
  
  // Render specific content when section is activated
  if (sectionName === 'progress' && charts.prChart) {
    setTimeout(() => {
      charts.prChart.resize();
      charts.bodyChart?.resize();
    }, 100);
  }
}

// ==== DASHBOARD UPDATES ====

function updateDashboard() {
  updatePRCards();
  updateBodyCompositionCard();
}

function updatePRCards() {
  // Update PR values in dashboard
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
  
  // Update progress bars with CORRECT DATA
  const weightProgress = (target.weight / current.weight) * 100;
  const weightBar = document.querySelector('.comp-item:nth-child(1) .progress-fill');
  if (weightBar) {
    weightBar.style.width = `${Math.min(weightProgress, 100)}%`;
  }
  
  // Update fat progress (reverse - lower is better)
  const fatProgress = (1 - (current.fatMass - target.fatMass) / current.fatMass) * 100;
  const fatBar = document.querySelector('.comp-item:nth-child(2) .progress-fill');
  if (fatBar) {
    fatBar.style.width = `${Math.max(0, Math.min(fatProgress, 100))}%`;
  }
  
  // Update muscle progress
  const muscleProgress = (current.muscleMass / target.muscleMass) * 100;
  const muscleBar = document.querySelector('.comp-item:nth-child(3) .progress-fill');
  if (muscleBar) {
    muscleBar.style.width = `${Math.min(muscleProgress, 100)}%`;
  }
}

// ==== NOTIFICATION SYSTEM ====

function showNotification(type, title, message, duration = 3000) {
  console.log(`📢 Notification: ${type} - ${title}: ${message}`);
  
  const container = document.getElementById('notifications-container');
  if (!container) {
    // Create container if it doesn't exist
    const newContainer = document.createElement('div');
    newContainer.id = 'notifications-container';
    newContainer.style.cssText = `
      position: fixed;
      top: 100px;
      right: 16px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 350px;
      width: calc(100vw - 32px);
    `;
    document.body.appendChild(newContainer);
  }
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-pink-300, #E8B4CB);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 10px 15px -3px rgba(107, 91, 94, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideInRight 0.3s ease;
    border-left: 4px solid ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
  `;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  notification.innerHTML = `
    <div style="font-size: 18px;">${icons[type] || 'ℹ️'}</div>
    <div style="flex: 1;">
      <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
      <div style="font-size: 14px; color: var(--color-text-secondary, #666);">${message}</div>
    </div>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 4px;">×</button>
  `;
  
  const finalContainer = document.getElementById('notifications-container');
  finalContainer.appendChild(notification);
  
  // Auto-remove after duration
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, duration);
  
  // Limit to max 3 notifications
  const notifications = finalContainer.children;
  if (notifications.length > 3) {
    notifications[0].remove();
  }
  
  // Add haptic feedback for important notifications
  if (navigator.vibrate && (type === 'success' || type === 'error')) {
    navigator.vibrate(type === 'success' ? [25] : [50, 50, 50]);
  }
}

// ==== INITIALIZE ON FIRST LOAD ====

// Set default form values
window.addEventListener('load', function() {
  console.log('🌸 Window loaded, setting defaults...');
  
  // Set today's date as default for forms
  const today = new Date().toISOString().split('T')[0];
  
  const prDateInput = document.getElementById('pr-date');
  const measurementDateInput = document.getElementById('measurement-date');
  
  if (prDateInput) prDateInput.value = today;
  if (measurementDateInput) measurementDateInput.value = today;
  
  // Initialize auto-backup UI
  updateAutoBackupUI();
  
  // Show live saving notification
  showNotification('info', '🌸 6xSBD PWA gotowa!', 'Menu hamburger i wszystkie funkcje działają. Live saving aktywne!', 5000);
  
  console.log('🎉 6xSBD PWA fully loaded with FIXED HAMBURGER MENU!');
});
