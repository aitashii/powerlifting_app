// 🌸🐱 6xSBD PWA Training Tracker - COMPLETE VERSION
// Fixed data + all sections working + live saving

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
  },

  // Nutrition data for tracking
  nutrition: {
    dailyTargets: {
      trainingDays: { calories: 2500, protein: 180, carbs: 280, fat: 85 },
      restDays: { calories: 2200, protein: 160, carbs: 250, fat: 70 }
    },
    meals: [] // For future meal tracking
  },

  // Training schedule for complete program
  trainingSchedule: generateCompleteSchedule()
};

// Generate complete training schedule through December 2025
function generateCompleteSchedule() {
  const schedule = {};
  const startDate = new Date('2025-08-25');
  const endDate = new Date('2025-12-31');
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    // Get phase for this date
    const phase = getPhaseForDate(date);
    
    if (dayOfWeek === 5) { // Friday - Rest day
      schedule[dateStr] = {
        type: 'rest',
        activities: ['Mobility', 'Stretching', 'Adductor work']
      };
    } else { // Training days
      if (phase) {
        const squatWeight = Math.round(45 * phase.exercises.squat.intensity);
        const benchWeight = Math.round(45 * phase.exercises.bench.intensity);
        const deadliftWeight = Math.round(90 * phase.exercises.deadlift.intensity);
        
        schedule[dateStr] = {
          type: 'training',
          phase: phase.name,
          exercises: [
            {
              name: 'Squat',
              sets: phase.exercises.squat.sets,
              reps: phase.exercises.squat.reps,
              weight: squatWeight,
              intensity: Math.round(phase.exercises.squat.intensity * 100) + '%'
            },
            {
              name: 'Bench Press',
              sets: phase.exercises.bench.sets,
              reps: phase.exercises.bench.reps,
              weight: benchWeight,
              intensity: Math.round(phase.exercises.bench.intensity * 100) + '%'
            },
            {
              name: 'Deadlift',
              sets: phase.exercises.deadlift.sets,
              reps: phase.exercises.deadlift.reps,
              weight: deadliftWeight,
              intensity: Math.round(phase.exercises.deadlift.intensity * 100) + '%'
            }
          ],
          accessories: phase.accessories
        };
      }
    }
  }
  
  return schedule;
}

function getPhaseForDate(date) {
  const phases = [
    { start: '2025-08-25', end: '2025-10-06', phase: 'phase1' },
    { start: '2025-10-07', end: '2025-11-17', phase: 'phase2' },
    { start: '2025-11-18', end: '2025-12-29', phase: 'phase3' },
    { start: '2025-12-30', end: '2026-03-30', phase: 'phase4' }
  ];
  
  for (const p of phases) {
    if (date >= new Date(p.start) && date <= new Date(p.end)) {
      return appData.trainingPhases[p.phase];
    }
  }
  return appData.trainingPhases.phase1;
}

// Chart instances
let charts = {};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌸 6xSBD PWA initializing...');
  
  // Load data from localStorage - LIVE SAVING!
  loadDataFromStorage();
  
  initializeHamburgerMenu();
  initializeDateSystem();
  initializeAutoBackup();
  initializeForms();
  initializeCharts();
  initializeTrainingSchedule();
  initializeNutritionTracking();
  
  updateDashboard();
  updateAllDateDependencies();
  
  console.log('✅ 6xSBD PWA ready with LIVE SAVING!');
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
      background: var(--color-success);
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

// ==== HAMBURGER MENU FUNCTIONALITY ====

function initializeHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const menuOverlay = document.getElementById('menu-overlay');
  const slidingMenu = document.getElementById('sliding-menu');
  const menuItems = document.querySelectorAll('.menu-item');

  // Open menu
  hamburgerBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    openMenu();
  });

  // Close menu
  closeMenuBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  // Close menu when clicking overlay
  menuOverlay.addEventListener('click', function(e) {
    e.preventDefault();
    closeMenu();
  });

  // Menu item navigation
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const section = this.getAttribute('data-section');
      if (section) {
        showSection(section);
        closeMenu();
        
        // Update active menu item
        menuItems.forEach(mi => mi.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  function openMenu() {
    hamburgerBtn.classList.add('active');
    menuOverlay.classList.add('active');
    slidingMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    menuOverlay.classList.remove('active');
    slidingMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  console.log('🍔 Hamburger menu initialized');
}

// ==== DYNAMIC DATE SYSTEM ====

function initializeDateSystem() {
  const datePicker = document.getElementById('current-date-picker');
  
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
  updateDateDisplay();
  updateTrainingPhaseStatus();
  updateDailyWorkout();
  updateMenstrualCycleStatus();
  updateNutritionTargets();
  updateCompetitionCountdown();
  updateProgressTimelines();
  updateTrainingScheduleView();
  
  console.log('🔄 All date dependencies updated');
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
  updateDetailedWorkout(currentPhase, isTrainingDay, dayName);
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

// ==== TRAINING SCHEDULE SECTION ====

function initializeTrainingSchedule() {
  console.log('📅 Training Schedule initialized');
}

function updateTrainingScheduleView() {
  const trainingCalendar = document.getElementById('training-calendar');
  if (!trainingCalendar) return;
  
  const currentDate = new Date(appData.currentDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  let calendarHTML = `
    <div class="calendar-header">
      <h3>📅 ${getMonthNamePolish(currentMonth)} ${currentYear}</h3>
      <div class="calendar-controls">
        <button class="btn btn--small" onclick="changeMonth(-1)">← Poprzedni</button>
        <button class="btn btn--small" onclick="changeMonth(1)">Następny →</button>
      </div>
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
    
    const phase = getCurrentTrainingPhase();
    const phaseClass = phase ? `phase-${phase.name.toLowerCase().split(' ')[0]}` : '';
    
    calendarHTML += `
      <div class="calendar-day ${isToday ? 'today' : ''} ${isRestDay ? 'rest-day' : 'training-day'} ${phaseClass}" 
           onclick="selectTrainingDay('${dateStr}')">
        <div class="day-number">${day}</div>
        <div class="day-type">${isRestDay ? '💤' : '💪'}</div>
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
}

function selectTrainingDay(dateStr) {
  // Update current date and show workout for selected day
  document.getElementById('current-date-picker').value = dateStr;
  updateCurrentDate(dateStr);
  
  const selectedWorkout = document.getElementById('selected-day-workout');
  if (selectedWorkout) {
    const date = new Date(dateStr);
    const dayName = getDayOfWeekPolish(date);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 5) { // Rest day
      selectedWorkout.innerHTML = `
        <h4>💤 ${dayName} - Dzień odpoczynku</h4>
        <div class="rest-day-activities">
          <p>🧘‍♀️ Mobilność i stretching</p>
          <p>🎯 Praca nad przywodzicielami</p>
          <p>💆‍♀️ Regeneracja</p>
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
              <span>Squat: ${currentPhase.exercises.squat.sets}x${currentPhase.exercises.squat.reps} @ ${squatWeight}kg</span>
            </div>
            <div class="exercise-preview">
              <span>Bench: ${currentPhase.exercises.bench.sets}x${currentPhase.exercises.bench.reps} @ ${benchWeight}kg</span>
            </div>
            <div class="exercise-preview">
              <span>Deadlift: ${currentPhase.exercises.deadlift.sets}x${currentPhase.exercises.deadlift.reps} @ ${deadliftWeight}kg</span>
            </div>
            <div class="exercise-preview highlight">
              <span>🎯 ${currentPhase.accessories[0]}</span>
            </div>
          </div>
        `;
      }
    }
  }
}

function changeMonth(direction) {
  const currentDate = new Date(appData.currentDate);
  currentDate.setMonth(currentDate.getMonth() + direction);
  
  // Update the date picker and calendar view
  const newDateStr = currentDate.toISOString().split('T')[0];
  document.getElementById('current-date-picker').value = newDateStr;
  updateCurrentDate(newDateStr);
}

// ==== NUTRITION TRACKING SECTION ====

function initializeNutritionTracking() {
  console.log('🥗 Nutrition tracking initialized');
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
  
  const targets = isRestDay ? appData.nutrition.dailyTargets.restDays : appData.nutrition.dailyTargets.trainingDays;
  
  if (nutritionTitle) nutritionTitle.textContent = `🥗 Żywienie na ${dayName}`;
  if (nutritionStatus) {
    nutritionStatus.textContent = isRestDay ? 'Dzień odpoczynku' : 'Dzień treningowy';
    nutritionStatus.className = isRestDay ? 'status status--warning' : 'status status--success';
  }
  
  if (nutritionTargets) {
    nutritionTargets.innerHTML = `
      <div class="nutrition-overview">
        <h4>🎯 Dzienne cele makroelementów</h4>
        <div class="nutrition-grid">
          <div class="nutrient-card">
            <div class="nutrient-header">
              <span class="nutrient-name">Kalorie</span>
              <span class="nutrient-target">${targets.calories} kcal</span>
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
              <span class="nutrient-target">${targets.protein}g</span>
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
              <span class="nutrient-target">${targets.carbs}g</span>
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
              <span class="nutrient-target">${targets.fat}g</span>
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
        
        <div class="meal-tracker">
          <h5>🍽️ Dodaj posiłek</h5>
          <button class="btn btn--primary" onclick="addMeal()">➕ Dodaj Posiłek</button>
        </div>
      </div>
    `;
  }
}

function addMeal() {
  showNotification('info', '🚧 Wkrótce!', 'Tracker posiłków będzie dostępny w następnej aktualizacji!');
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

function getMonthNamePolish(monthIndex) {
  const months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];
  return months[monthIndex];
}

function setToday() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('current-date-picker').value = today;
  updateCurrentDate(today);
}

// ==== AUTO-BACKUP SYSTEM ====

function initializeAutoBackup() {
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
  
  console.log('💾 Auto-Backup System initialized (3 changes) with LIVE SAVING');
}

function trackChange(changeDescription = 'Dodano dane') {
  appData.autoBackup.changesCount++;
  
  console.log(`📊 Change tracked: ${changeDescription} (${appData.autoBackup.changesCount}/${appData.autoBackup.maxChanges})`);
  
  // LIVE SAVE every change!
  saveDataToStorage();
  
  // Update UI
  updateAutoBackupUI();
  
  // Show notification - less frequent for better UX
  if (appData.autoBackup.changesCount === appData.autoBackup.maxChanges) {
    showNotification('info', '💾 Auto-backup gotowy!', 'Kliknij Manual Backup aby pobrać plik.');
  }
  
  // Auto-backup when threshold reached
  if (appData.autoBackup.changesCount >= appData.autoBackup.maxChanges) {
    // Don't auto-download, just make it available
    console.log('🎯 Auto-backup threshold reached - ready for manual download');
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
      bodyGoals: appData.bodyGoals,
      
      // Analytics
      analytics: {
        totalTrainingDays: calculateTotalTrainingDays(),
        phaseProgress: calculatePhaseProgress(),
        strengthProgress: calculateStrengthProgress(),
        bodyCompositionProgress: calculateBodyCompositionProgress()
      },
      
      // Recommendations for AI trainer
      recommendations: generateTrainerRecommendations()
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
    showNotification('error', '❌ Błąd!', 'To nie wygląda na plik backupu 6xSBD. Sprawdź czy wybrałeś właściwy plik.');
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
      
      // Ensure auto-backup structure exists
      if (!appData.autoBackup) {
        appData.autoBackup = {
          changesCount: 0,
          maxChanges: 3,
          autoDownload: true,
          lastBackup: backupData.timestamp
        };
      }
      
      // Update date picker
      document.getElementById('current-date-picker').value = appData.currentDate;
      
      // LIVE SAVE and refresh UI
      saveDataToStorage();
      updateDashboard();
      updateAllDateDependencies();
      updateAutoBackupUI();
      updateCharts();
      
      const measurementCount = appData.measurements?.length || 0;
      const prCount = Object.keys(appData.currentPRs || {}).length;
      
      showNotification('success', '✅ Dane przywrócone!', `${measurementCount} pomiarów i ${prCount} rekordów PR zostało załadowanych.`);
      
      console.log('✅ Data restore completed successfully with LIVE SAVING');
      
    } catch (error) {
      console.error('❌ Restore failed:', error);
      showNotification('error', '❌ Błąd!', 'Nie można odczytać pliku backupu. Sprawdź czy plik nie jest uszkodzony.');
    }
  };
  
  reader.readAsText(file);
}

// Analytics Functions for Trainer Export
function calculateTotalTrainingDays() {
  const startDate = new Date(appData.trainingPhases.phase1.startDate);
  const currentDate = new Date(appData.currentDate);
  const daysDiff = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
  
  // Exclude Fridays (rest days) - approximately 6/7 of days are training days
  return Math.floor(daysDiff * 6 / 7);
}

function calculatePhaseProgress() {
  const currentPhase = getCurrentTrainingPhase();
  const currentDate = new Date(appData.currentDate);
  const startDate = new Date(currentPhase.startDate);
  const endDate = new Date(currentPhase.endDate);
  
  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  const completedDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
  
  return {
    phase: currentPhase.name,
    completedDays: Math.max(0, completedDays),
    totalDays: totalDays,
    percentage: Math.max(0, Math.min(100, Math.round((completedDays / totalDays) * 100)))
  };
}

function calculateStrengthProgress() {
  const progress = {};
  
  ['squat', 'bench', 'deadlift'].forEach(exercise => {
    const history = appData.prHistory[exercise] || [];
    const current = appData.currentPRs[exercise];
    
    if (history.length > 1) {
      const first = history[0];
      const improvement = current.estimated1RM - first.estimated1RM;
      const percentage = ((improvement / first.estimated1RM) * 100);
      
      progress[exercise] = {
        starting1RM: first.estimated1RM,
        current1RM: current.estimated1RM,
        improvement: improvement,
        improvementPercentage: Math.round(percentage * 10) / 10
      };
    }
  });
  
  return progress;
}

function calculateBodyCompositionProgress() {
  if (appData.measurements.length < 2) return null;
  
  const first = appData.measurements[0];
  const latest = appData.measurements[appData.measurements.length - 1];
  
  return {
    weightChange: +(latest.weight - first.weight).toFixed(1),
    fatMassChange: +(latest.fatMass - first.fatMass).toFixed(1),
    muscleMassChange: +(latest.muscle - first.muscle).toFixed(1),
    bodyFatPercentageChange: +(latest.bodyFat - first.bodyFat).toFixed(1),
    timespan: Math.floor((new Date(latest.date) - new Date(first.date)) / (1000 * 60 * 60 * 24))
  };
}

function generateTrainerRecommendations() {
  const recommendations = [];
  
  // Phase-based recommendations
  const currentPhase = getCurrentTrainingPhase();
  recommendations.push(`Aktualna faza: ${currentPhase.name} - ${currentPhase.focus}`);
  
  // Strength progress analysis
  const strengthProgress = calculateStrengthProgress();
  Object.entries(strengthProgress).forEach(([exercise, data]) => {
    if (data.improvementPercentage > 10) {
      recommendations.push(`Świetny postęp w ${exercise}: +${data.improvementPercentage}% (${data.improvement}kg)`);
    } else if (data.improvementPercentage < 5) {
      recommendations.push(`Powolny postęp w ${exercise}: +${data.improvementPercentage}% - rozważ zmianę podejścia`);
    }
  });
  
  return recommendations;
}

// ==== FORMS AND USER INPUT ====

function initializeForms() {
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
  
  console.log('📝 Forms initialized with LIVE SAVING');
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
  
  showNotification('success', '📊 Nowy pomiar dodany!', 'Dane zostały zaktualizowane i zapisane!');
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
    
    // Update cycle status based on current date
    updateMenstrualCycleStatus();
    updateDashboard();
    
    // Clear form
    document.getElementById('cycle-form').reset();
    
    showNotification('success', '🌙 Cykl zaktualizowany!', 'Rekomendacje treningowe zostały dostosowane i zapisane!');
  }
}

// ==== CHARTS FUNCTIONALITY ====

function initializeCharts() {
  initializePRChart();
  initializeBodyCompositionChart();
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
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          title: {
            display: true,
            text: 'Data'
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Ciężar (kg)'
          }
        }
      },
      elements: {
        point: {
          backgroundColor: '#FFB7C5'
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
          beginAtZero: false,
          title: {
            display: true,
            text: 'Masa (kg)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Data'
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
  
  if (sectionName === 'treningi') {
    updateTrainingScheduleView();
  }
  
  console.log(`📱 Switched to section: ${sectionName}`);
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
  const container = document.getElementById('notifications-container');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  notification.innerHTML = `
    <div class="notification__icon">${icons[type] || 'ℹ️'}</div>
    <div class="notification__content">
      <div class="notification__title">${title}</div>
      <div class="notification__text">${message}</div>
    </div>
    <button class="notification__dismiss" onclick="this.parentElement.remove()">×</button>
  `;
  
  container.appendChild(notification);
  
  // Auto-remove after duration
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, duration);
  
  // Limit to max 3 notifications
  const notifications = container.children;
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
  // Set today's date as default for forms
  const today = new Date().toISOString().split('T')[0];
  
  const prDateInput = document.getElementById('pr-date');
  const measurementDateInput = document.getElementById('measurement-date');
  
  if (prDateInput) prDateInput.value = today;
  if (measurementDateInput) measurementDateInput.value = today;
  
  // Initialize auto-backup UI
  updateAutoBackupUI();
  
  // Show live saving notification
  showNotification('info', '🌸 6xSBD PWA gotowa!', 'Wszystkie zmiany zapisują się automatycznie na telefonie. Manual backup tylko do przesyłania!', 5000);
  
  console.log('🎉 6xSBD PWA fully loaded with LIVE SAVING and ALL SECTIONS working!');
});
