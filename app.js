// 🌸🐱 Aitashii Powerlifting Tracker - COMPLETE APPLICATION

let appData = {
  // Current Date System - controls all date-dependent functionality
  currentDate: "2025-08-25", // Default starting date
  
  // Auto-backup settings (updated to 3 changes)
  autoBackup: {
    changesCount: 0,
    maxChanges: 3,
    autoDownload: true
  },
  
  // Current PRs with rep categories
  currentPRs: {
    squat: {
      "1RM": { weight: 45, reps: 1, date: "2025-08-23", estimated1RM: 45 },
      "2RM": null,
      "3RM": null,
      "4RM": null,
      "5RM": { weight: 40, reps: 5, date: "2025-08-23", estimated1RM: 45 }
    },
    bench: {
      "1RM": { weight: 45, reps: 1, date: "2025-08-23", estimated1RM: 45 },
      "2RM": null,
      "3RM": null,
      "4RM": null,
      "5RM": null
    },
    deadlift: {
      "1RM": { weight: 90, reps: 1, date: "2025-07-31", estimated1RM: 90 },
      "2RM": null,
      "3RM": null,
      "4RM": null,
      "5RM": null
    }
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
      { date: "2025-08-23", weight: 40, reps: 5, estimated1RM: 45 },
      { date: "2025-08-23", weight: 45, reps: 1, estimated1RM: 45 }
    ],
    bench: [
      { date: "2025-08-06", weight: 42.5, reps: 1, estimated1RM: 42.5 },
      { date: "2025-08-23", weight: 45, reps: 1, estimated1RM: 45 }
    ],
    deadlift: [
      { date: "2025-07-31", weight: 90, reps: 1, estimated1RM: 90 }
    ]
  },
  
  // Nutrition data
  nutritionEntries: [
    {
      date: "2025-08-25",
      calories: 2350,
      protein: 175,
      carbs: 265,
      fat: 82,
      notes: "Good day"
    }
  ],
  
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

// Current week for training calendar
let currentWeekOffset = 0;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌸 Aitashii app loaded, initializing...');
  
  initializeNavigation();
  initializeTimer();
  initializePRForm();
  initializeMeasurementsForm();
  initializeCycleTracker();
  initializeNutritionForm();
  initializeTrainingCalendar();
  setupFatMassCalculation();
  initializeDateControl();
  
  // Wait for charts to initialize after DOM is ready
  setTimeout(() => {
    initializeCharts();
  }, 100);
  
  updateAllDateDependencies();
  updateDashboard();
  updateAutoBackupDisplay();
  
  console.log('✅ App fully initialized');
});

// Training Calendar Functions
function initializeTrainingCalendar() {
  const prevWeekBtn = document.getElementById('prev-week');
  const nextWeekBtn = document.getElementById('next-week');
  
  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
      currentWeekOffset--;
      generateTrainingCalendar();
    });
  }
  
  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => {
      currentWeekOffset++;
      generateTrainingCalendar();
    });
  }
  
  generateTrainingCalendar();
}

function generateTrainingCalendar() {
  const calendar = document.getElementById('training-calendar');
  const weekDisplay = document.getElementById('current-week-display');
  
  if (!calendar || !weekDisplay) return;
  
  // Calculate current week dates
  const startDate = new Date(appData.currentDate + 'T00:00:00');
  const monday = new Date(startDate);
  const dayOfWeek = startDate.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Handle Sunday as 0
  monday.setDate(startDate.getDate() - daysFromMonday + (currentWeekOffset * 7));
  
  // Update week display
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  weekDisplay.textContent = `Week ${currentWeekOffset + 1} (${formatDateShort(monday)} - ${formatDateShort(sunday)})`;
  
  // Generate calendar HTML
  calendar.innerHTML = '';
  
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    
    const dayElement = document.createElement('div');
    dayElement.className = 'training-day';
    
    const dayName = days[i];
    const dayNumber = dayDate.getDate();
    
    // Determine workout type
    let workoutType = 'SBD TRAINING';
    let workoutClass = 'training';
    
    if (i === 4) { // Friday
      workoutType = 'REST';
      workoutClass = 'rest';
    }
    
    // Check if it's current date
    const isToday = dayDate.toDateString() === new Date(appData.currentDate + 'T00:00:00').toDateString();
    
    dayElement.innerHTML = `
      <div class="day-header">
        <div class="day-name">${dayName}</div>
        <div class="day-number">${dayNumber}</div>
      </div>
      <div class="workout-type ${workoutClass}">${workoutType}</div>
    `;
    
    if (isToday) {
      dayElement.classList.add('today');
    }
    
    // Add click handler for interactive workout details
    dayElement.addEventListener('click', () => {
      showWorkoutDetails(dayDate, dayName, workoutType);
    });
    
    calendar.appendChild(dayElement);
  }
}

function showWorkoutDetails(date, dayName, workoutType) {
  const detailsSection = document.getElementById('selected-workout-details');
  const titleElement = document.getElementById('selected-date-title');
  const contentElement = document.getElementById('workout-details-content');
  
  if (!detailsSection || !titleElement || !contentElement) return;
  
  const formattedDate = formatDateFull(date);
  titleElement.textContent = `${dayName}, ${formattedDate}`;
  
  detailsSection.style.display = 'block';
  
  if (workoutType === 'REST') {
    contentElement.innerHTML = `
      <div class="rest-day-content">
        <h4>🧘‍♀️ Rest & Recovery Day</h4>
        <div class="recovery-activities">
          <div class="activity-item">
            <strong>Mobility Work:</strong> 20-30 minutes of stretching and foam rolling
          </div>
          <div class="activity-item">
            <strong>Light Walking:</strong> 20-30 minutes easy pace
          </div>
          <div class="activity-item">
            <strong>Sleep:</strong> Aim for 8+ hours of quality sleep
          </div>
          <div class="activity-item">
            <strong>Nutrition:</strong> Focus on recovery nutrition and hydration
          </div>
        </div>
      </div>
    `;
  } else {
    // Generate SBD workout based on current training phase
    const currentPhase = calculateCurrentPhase();
    let intensity = 0.67; // Default for hypertrophy phase
    
    if (currentPhase.key === 'phase1') intensity = 0.67;
    else if (currentPhase.key === 'phase2') intensity = 0.8;
    else if (currentPhase.key === 'phase3') intensity = 0.9;
    else if (currentPhase.key === 'phase4') intensity = 0.85;
    
    const squatWeight = Math.round(getBest1RM('squat') * intensity / 2.5) * 2.5;
    const benchWeight = Math.round(getBest1RM('bench') * intensity / 2.5) * 2.5;
    const deadliftWeight = Math.round(getBest1RM('deadlift') * intensity / 2.5) * 2.5;
    
    contentElement.innerHTML = `
      <div class="workout-details">
        <div class="phase-info">
          <span class="status status--success">${currentPhase.phase.name}</span>
          <span>Intensity: ${Math.round(intensity * 100)}% 1RM</span>
        </div>
        
        <h4>Main Movements - 6xSBD</h4>
        <div class="exercise-preview">
          <div class="exercise-line">
            <strong>Squat:</strong> 5x5 @ ${squatWeight}kg (${Math.round(intensity * 100)}%)
          </div>
          <div class="exercise-line">
            <strong>Bench Press:</strong> 4x6 @ ${benchWeight}kg (${Math.round(intensity * 100)}%)
          </div>
          <div class="exercise-line">
            <strong>Deadlift:</strong> 4x5 @ ${deadliftWeight}kg (${Math.round(intensity * 100)}%)
          </div>
        </div>
        
        <h4>Accessories</h4>
        <div class="accessories-preview">
          <div class="accessory-line">
            <strong>Adductor Work (PRIORITY):</strong> Cossack Squats 3x12-15, Lateral Lunges 3x10/leg, Copenhagen Planks 3x30s
          </div>
          <div class="accessory-line">
            <strong>Hip Thrusts:</strong> 3x10 @ 40kg
          </div>
          <div class="accessory-line">
            <strong>Core Work:</strong> 3 sets of choice
          </div>
        </div>
      </div>
    `;
  }
  
  // Scroll to details section
  detailsSection.scrollIntoView({ behavior: 'smooth' });
}

// Enhanced PR Management with Rep Categories
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

  // Initialize PR categories tabs
  initializePRTabs();
  updatePRCategories('squat'); // Default to squat
}

function initializePRTabs() {
  const tabs = document.querySelectorAll('.pr-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update displayed categories
      const exercise = tab.dataset.exercise;
      updatePRCategories(exercise);
    });
  });
}

function updatePRCategories(exercise) {
  const container = document.getElementById('pr-rep-categories');
  if (!container) return;
  
  const categories = appData.currentPRs[exercise];
  
  container.innerHTML = '';
  
  ['1RM', '2RM', '3RM', '4RM', '5RM'].forEach(repCategory => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'pr-category';
    
    const pr = categories[repCategory];
    
    if (pr) {
      categoryDiv.innerHTML = `
        <div class="pr-category-header">
          <h4>${repCategory}</h4>
          <span class="status status--success">Set</span>
        </div>
        <div class="pr-category-details">
          <div class="pr-weight">${pr.weight}kg x ${pr.reps}</div>
          <div class="pr-date">${formatDate(pr.date)}</div>
          <div class="pr-1rm">Est. 1RM: ${pr.estimated1RM}kg</div>
        </div>
      `;
    } else {
      categoryDiv.innerHTML = `
        <div class="pr-category-header">
          <h4>${repCategory}</h4>
          <span class="status status--info">Not Set</span>
        </div>
        <div class="pr-category-details">
          <div class="pr-empty">No record yet</div>
        </div>
      `;
    }
    
    container.appendChild(categoryDiv);
  });
}

function getBest1RM(exercise) {
  const categories = appData.currentPRs[exercise];
  let best1RM = 0;
  
  Object.values(categories).forEach(pr => {
    if (pr && pr.estimated1RM > best1RM) {
      best1RM = pr.estimated1RM;
    }
  });
  
  return best1RM || 45; // Default minimum
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
  const repCategory = `${reps}RM`;

  // Update current PRs in rep category
  appData.currentPRs[exercise][repCategory] = {
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
  updatePRCategories(exercise);
  
  // Reset form
  document.getElementById('pr-form').reset();
  document.getElementById('pr-date').value = appData.currentDate;
  document.getElementById('estimated-1rm-display').textContent = '-';

  alert(`🌸 New ${repCategory} PR added! ${exercise.toUpperCase()}: ${weight}kg x${reps} (Est. 1RM: ${estimated1RM}kg)\n\nAll training weights have been updated.`);
}

// Enhanced Measurements with proper saving and history
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
  
  // Update measurements history display
  updateMeasurementsHistory();
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

  // Update charts, dashboard, and history
  updateWeightChart();
  updateBodyFatChart();
  updateBodyCompositionDisplay();
  updateMeasurementsHistory();
  updateDashboard();

  // Reset form
  document.getElementById('measurements-form').reset();
  document.getElementById('measurement-date').value = appData.currentDate;

  alert('🌸 Measurements saved and body composition updated!');
}

function updateMeasurementsHistory() {
  const historyTable = document.getElementById('measurements-history-table');
  if (!historyTable) return;
  
  historyTable.innerHTML = '';
  
  // Show latest 10 measurements
  const recentMeasurements = appData.measurements.slice(-10).reverse();
  
  recentMeasurements.forEach(measurement => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(measurement.date)}</td>
      <td>${measurement.weight}kg</td>
      <td>${measurement.bodyFat}%</td>
      <td>${measurement.muscle}kg</td>
      <td>${measurement.fatMass}kg</td>
      <td>${measurement.bodyWater}kg</td>
    `;
    historyTable.appendChild(row);
  });
}

// Nutrition Form Functions
function initializeNutritionForm() {
  const form = document.getElementById('nutrition-form');
  const shakeBtn = document.getElementById('add-shake-btn');
  
  if (form) {
    // Set current app date
    const dateInput = document.getElementById('nutrition-date');
    if (dateInput) {
      dateInput.value = appData.currentDate;
    }
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addNutritionEntry();
    });
  }
  
  if (shakeBtn) {
    shakeBtn.addEventListener('click', addShakeToLog);
  }
  
  updateNutritionHistory();
}

function addNutritionEntry() {
  const date = document.getElementById('nutrition-date').value;
  const calories = parseInt(document.getElementById('nutrition-calories-input').value);
  const protein = parseFloat(document.getElementById('nutrition-protein-input').value);
  const carbs = parseFloat(document.getElementById('nutrition-carbs-input').value);
  const fat = parseFloat(document.getElementById('nutrition-fat-input').value);
  const notes = document.getElementById('nutrition-notes').value;

  const entry = {
    date,
    calories,
    protein,
    carbs,
    fat,
    notes
  };
  
  appData.nutritionEntries.push(entry);
  
  // Sort by date
  appData.nutritionEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Increment backup counter
  incrementBackupCounter();

  // Update display
  updateNutritionHistory();

  // Reset form
  document.getElementById('nutrition-form').reset();
  document.getElementById('nutrition-date').value = appData.currentDate;

  alert('🌸 Nutrition entry added!');
}

function addShakeToLog() {
  const today = appData.currentDate;
  
  // Check if there's already an entry for today
  const existingEntry = appData.nutritionEntries.find(entry => entry.date === today);
  
  if (existingEntry) {
    // Add shake to existing entry
    existingEntry.calories += 278;
    existingEntry.protein += 53.5;
    existingEntry.carbs += 10.8;
    existingEntry.fat += 6;
    existingEntry.notes = existingEntry.notes ? existingEntry.notes + ', Added shake' : 'Added shake';
  } else {
    // Create new entry with shake
    appData.nutritionEntries.push({
      date: today,
      calories: 278,
      protein: 53.5,
      carbs: 10.8,
      fat: 6,
      notes: 'Shake only'
    });
  }
  
  // Sort by date
  appData.nutritionEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Increment backup counter
  incrementBackupCounter();

  // Update display
  updateNutritionHistory();

  alert('🌸 Shake added to today\'s nutrition log!\n\n278 kcal, 53.5g protein counted.');
}

function updateNutritionHistory() {
  const historyList = document.getElementById('nutrition-history-list');
  if (!historyList) return;
  
  historyList.innerHTML = '';
  
  // Show latest 7 entries
  const recentEntries = appData.nutritionEntries.slice(-7).reverse();
  
  if (recentEntries.length === 0) {
    historyList.innerHTML = '<div class="no-entries">No nutrition entries yet. Add your first entry above!</div>';
    return;
  }
  
  recentEntries.forEach(entry => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'nutrition-entry-item';
    entryDiv.innerHTML = `
      <div class="entry-header">
        <strong>${formatDate(entry.date)}</strong>
        <span class="entry-calories">${entry.calories} kcal</span>
      </div>
      <div class="entry-macros">
        Protein: ${entry.protein}g | Carbs: ${entry.carbs}g | Fat: ${entry.fat}g
      </div>
      ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ''}
    `;
    historyList.appendChild(entryDiv);
  });
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

// Date Control Functions
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
  generateTrainingCalendar(); // Update training calendar
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

// Auto-backup system
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
  
  console.log('🌸 Auto-backup triggered and downloaded');
}

// Navigation Functions
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

  const currentTotal = getBest1RM('squat') + getBest1RM('bench') + getBest1RM('deadlift');
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

// Dashboard Updates
function updateDashboard() {
  updatePRDisplay();
  updateBodyCompositionDisplay();
  updateWorkoutPreview();
}

function updateBodyCompositionDisplay() {
  const current = appData.bodyGoals.current;
  const target = appData.bodyGoals.target;
  const changes = appData.bodyGoals.changes;

  // Update dashboard body composition values from latest measurements
  const latestMeasurement = appData.measurements[appData.measurements.length - 1];
  if (latestMeasurement) {
    // Update current values with latest measurement
    appData.bodyGoals.current = {
      weight: latestMeasurement.weight,
      bodyFat: latestMeasurement.bodyFat,
      fatMass: latestMeasurement.fatMass,
      muscleMass: latestMeasurement.muscle,
      bodyWater: latestMeasurement.bodyWater
    };
    
    // Update dashboard displays
    const dashboardBodyStatus = document.getElementById('dashboard-body-status');
    const dashboardWeightValues = document.getElementById('dashboard-weight-values');
    const dashboardFatValues = document.getElementById('dashboard-fat-values');
    const dashboardMuscleValues = document.getElementById('dashboard-muscle-values');
    const dashboardWaterValues = document.getElementById('dashboard-water-values');
    
    if (dashboardBodyStatus) {
      dashboardBodyStatus.textContent = `${latestMeasurement.weight}kg → ${target.weight}kg`;
    }
    
    if (dashboardWeightValues) {
      dashboardWeightValues.textContent = `${latestMeasurement.weight}kg → ${target.weight}kg`;
    }
    
    if (dashboardFatValues) {
      dashboardFatValues.textContent = `${latestMeasurement.bodyFat}% (${latestMeasurement.fatMass}kg) → ${target.bodyFat}% (${target.fatMass}kg)`;
    }
    
    if (dashboardMuscleValues) {
      dashboardMuscleValues.textContent = `${latestMeasurement.muscle}kg → ${target.muscleMass}kg`;
    }
    
    if (dashboardWaterValues) {
      dashboardWaterValues.textContent = `${latestMeasurement.bodyWater}kg → ${target.bodyWater}kg`;
    }
    
    // Update progress bars
    const weightProgress = ((84.1 - latestMeasurement.weight) / (84.1 - target.weight)) * 100;
    const fatProgress = ((38 - latestMeasurement.bodyFat) / (38 - target.bodyFat)) * 100;
    const muscleProgress = ((latestMeasurement.muscle - 44.3) / (target.muscleMass - 44.3)) * 100;
    const waterProgress = ((latestMeasurement.bodyWater - 38.1) / (target.bodyWater - 38.1)) * 100;

    const dashboardWeightProgress = document.getElementById('dashboard-weight-progress');
    const dashboardFatProgress = document.getElementById('dashboard-fat-progress');
    const dashboardMuscleProgress = document.getElementById('dashboard-muscle-progress');
    const dashboardWaterProgress = document.getElementById('dashboard-water-progress');
    
    const dashboardWeightText = document.getElementById('dashboard-weight-text');
    const dashboardFatText = document.getElementById('dashboard-fat-text');
    const dashboardMuscleText = document.getElementById('dashboard-muscle-text');
    const dashboardWaterText = document.getElementById('dashboard-water-text');
    
    if (dashboardWeightProgress) dashboardWeightProgress.style.width = `${Math.min(100, Math.max(0, weightProgress))}%`;
    if (dashboardFatProgress) dashboardFatProgress.style.width = `${Math.min(100, Math.max(0, fatProgress))}%`;
    if (dashboardMuscleProgress) dashboardMuscleProgress.style.width = `${Math.min(100, Math.max(0, muscleProgress))}%`;
    if (dashboardWaterProgress) dashboardWaterProgress.style.width = `${Math.min(100, Math.max(0, waterProgress))}%`;
    
    if (dashboardWeightText) dashboardWeightText.textContent = `-${(84.1 - latestMeasurement.weight).toFixed(1)}kg of -${changes.netWeightLoss}kg`;
    if (dashboardFatText) dashboardFatText.textContent = `-${(38 - latestMeasurement.bodyFat).toFixed(1)}% body fat`;
    if (dashboardMuscleText) dashboardMuscleText.textContent = `+${(latestMeasurement.muscle - 44.3).toFixed(1)}kg of +${changes.muscleGain}kg`;
    if (dashboardWaterText) dashboardWaterText.textContent = `+${(latestMeasurement.bodyWater - 38.1).toFixed(1)}kg of +${changes.waterGain}kg`;
  }
}

function updatePRDisplay() {
  // Update dashboard PR displays with best 1RMs
  const dashboardSquatPR = document.getElementById('dashboard-squat-pr');
  const dashboardSquatDate = document.getElementById('dashboard-squat-date');
  const dashboardSquat1RM = document.getElementById('dashboard-squat-1rm');
  
  const dashboardBenchPR = document.getElementById('dashboard-bench-pr');
  const dashboardBenchDate = document.getElementById('dashboard-bench-date');
  const dashboardBench1RM = document.getElementById('dashboard-bench-1rm');
  
  const dashboardDeadliftPR = document.getElementById('dashboard-deadlift-pr');
  const dashboardDeadliftDate = document.getElementById('dashboard-deadlift-date');
  const dashboardDeadlift1RM = document.getElementById('dashboard-deadlift-1rm');
  
  // Get best PRs for each exercise
  ['squat', 'bench', 'deadlift'].forEach(exercise => {
    const categories = appData.currentPRs[exercise];
    let bestPR = null;
    let best1RM = 0;
    
    Object.values(categories).forEach(pr => {
      if (pr && pr.estimated1RM > best1RM) {
        best1RM = pr.estimated1RM;
        bestPR = pr;
      }
    });
    
    if (bestPR) {
      if (exercise === 'squat') {
        if (dashboardSquatPR) dashboardSquatPR.textContent = `${bestPR.weight}kg x${bestPR.reps}`;
        if (dashboardSquatDate) dashboardSquatDate.textContent = formatDate(bestPR.date);
        if (dashboardSquat1RM) dashboardSquat1RM.textContent = `(Est. 1RM: ${bestPR.estimated1RM}kg)`;
      } else if (exercise === 'bench') {
        if (dashboardBenchPR) dashboardBenchPR.textContent = `${bestPR.weight}kg x${bestPR.reps}`;
        if (dashboardBenchDate) dashboardBenchDate.textContent = formatDate(bestPR.date);
        if (dashboardBench1RM) dashboardBench1RM.textContent = `(Est. 1RM: ${bestPR.estimated1RM}kg)`;
      } else if (exercise === 'deadlift') {
        if (dashboardDeadliftPR) dashboardDeadliftPR.textContent = `${bestPR.weight}kg x${bestPR.reps}`;
        if (dashboardDeadliftDate) dashboardDeadliftDate.textContent = formatDate(bestPR.date);
        if (dashboardDeadlift1RM) dashboardDeadlift1RM.textContent = `(Est. 1RM: ${bestPR.estimated1RM}kg)`;
      }
    }
  });
}

function updateWorkoutPreview() {
  const currentPhase = calculateCurrentPhase();
  
  // Calculate training weights based on current PRs and phase
  let intensity = 0.67; // Default for hypertrophy phase
  
  if (currentPhase.key === 'phase1') intensity = 0.67;
  else if (currentPhase.key === 'phase2') intensity = 0.8;
  else if (currentPhase.key === 'phase3') intensity = 0.9;
  else if (currentPhase.key === 'phase4') intensity = 0.85;
  
  const squatWeight = Math.round(getBest1RM('squat') * intensity / 2.5) * 2.5;
  const benchWeight = Math.round(getBest1RM('bench') * intensity / 2.5) * 2.5;
  const deadliftWeight = Math.round(getBest1RM('deadlift') * intensity / 2.5) * 2.5;
  
  const dashboardSquatPreview = document.getElementById('dashboard-squat-preview');
  const dashboardBenchPreview = document.getElementById('dashboard-bench-preview');
  const dashboardDeadliftPreview = document.getElementById('dashboard-deadlift-preview');
  
  if (dashboardSquatPreview) dashboardSquatPreview.innerHTML = `<strong>Squat:</strong> 5x5 @ ${squatWeight}kg (${Math.round(intensity * 100)}%)`;
  if (dashboardBenchPreview) dashboardBenchPreview.innerHTML = `<strong>Bench:</strong> 4x6 @ ${benchWeight}kg (${Math.round(intensity * 100)}%)`;
  if (dashboardDeadliftPreview) dashboardDeadliftPreview.innerHTML = `<strong>Deadlift:</strong> 4x5 @ ${deadliftWeight}kg (${Math.round(intensity * 100)}%)`;
  
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
  
  const squatWeight = Math.round(getBest1RM('squat') * intensity / 2.5) * 2.5;
  const benchWeight = Math.round(getBest1RM('bench') * intensity / 2.5) * 2.5;
  const deadliftWeight = Math.round(getBest1RM('deadlift') * intensity / 2.5) * 2.5;
  
  // Update exercise intensities
  const squatIntensity = document.getElementById('squat-intensity');
  const benchIntensity = document.getElementById('bench-intensity');
  const deadliftIntensity = document.getElementById('deadlift-intensity');
  
  if (squatIntensity) squatIntensity.textContent = `${Math.round(intensity * 100)}% (${squatWeight}kg)`;
  if (benchIntensity) benchIntensity.textContent = `${Math.round(intensity * 100)}% (${benchWeight}kg)`;
  if (deadliftIntensity) deadliftIntensity.textContent = `${Math.round(intensity * 100)}% (${deadliftWeight}kg)`;
  
  // Update squat sets
  const squatWarmup = document.getElementById('squat-warmup');
  const squatSet1 = document.getElementById('squat-set1');
  const squatSet2 = document.getElementById('squat-set2');
  const squatSet3 = document.getElementById('squat-set3');
  const squatSet4 = document.getElementById('squat-set4');
  const squatSet5 = document.getElementById('squat-set5');
  
  if (squatWarmup) squatWarmup.textContent = `Warm-up: ${Math.round((squatWeight * 0.7) / 2.5) * 2.5}kg x 8`;
  if (squatSet1) squatSet1.textContent = `Set 1: ${squatWeight}kg x 5`;
  if (squatSet2) squatSet2.textContent = `Set 2: ${squatWeight}kg x 5`;
  if (squatSet3) squatSet3.textContent = `Set 3: ${squatWeight}kg x 5`;
  if (squatSet4) squatSet4.textContent = `Set 4: ${squatWeight}kg x 5`;
  if (squatSet5) squatSet5.textContent = `Set 5: ${squatWeight}kg x 5`;
  
  // Update bench sets
  const benchWarmup = document.getElementById('bench-warmup');
  const benchSet1 = document.getElementById('bench-set1');
  const benchSet2 = document.getElementById('bench-set2');
  const benchSet3 = document.getElementById('bench-set3');
  const benchSet4 = document.getElementById('bench-set4');
  
  if (benchWarmup) benchWarmup.textContent = `Warm-up: ${Math.round((benchWeight * 0.7) / 2.5) * 2.5}kg x 8`;
  if (benchSet1) benchSet1.textContent = `Set 1: ${benchWeight}kg x 6`;
  if (benchSet2) benchSet2.textContent = `Set 2: ${benchWeight}kg x 6`;
  if (benchSet3) benchSet3.textContent = `Set 3: ${benchWeight}kg x 6`;
  if (benchSet4) benchSet4.textContent = `Set 4: ${benchWeight}kg x 6`;
  
  // Update deadlift sets
  const deadliftWarmup = document.getElementById('deadlift-warmup');
  const deadliftSet1 = document.getElementById('deadlift-set1');
  const deadliftSet2 = document.getElementById('deadlift-set2');
  const deadliftSet3 = document.getElementById('deadlift-set3');
  const deadliftSet4 = document.getElementById('deadlift-set4');
  
  if (deadliftWarmup) deadliftWarmup.textContent = `Warm-up: ${Math.round((deadliftWeight * 0.7) / 2.5) * 2.5}kg x 5`;
  if (deadliftSet1) deadliftSet1.textContent = `Set 1: ${deadliftWeight}kg x 5`;
  if (deadliftSet2) deadliftSet2.textContent = `Set 2: ${deadliftWeight}kg x 5`;
  if (deadliftSet3) deadliftSet3.textContent = `Set 3: ${deadliftWeight}kg x 5`;
  if (deadliftSet4) deadliftSet4.textContent = `Set 4: ${deadliftWeight}kg x 5`;
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

function formatDateShort(date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit'
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

// Event Listeners for set completion tracking
document.addEventListener('DOMContentLoaded', function() {
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
      } else {
        setRow.style.backgroundColor = '';
        setRow.style.color = '';
      }
    });
  });
});

console.log('🌸🐱 Aitashii Powerlifting Tracker loaded successfully!');
