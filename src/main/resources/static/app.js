// ==================== Step Counter ====================
const STEPS_PER_KM = 1300;
const CALORIES_PER_KM = 50;
const DAILY_GOAL = 10000;

async function fetchTotal() {
  const res = await fetch('/api/steps');
  const json = await res.json();
  const total = json.total;
  document.getElementById('total').textContent = total.toLocaleString();
  updateStepStats(total);
}

function updateStepStats(total) {
  // Distance calculation
  const distance = (total / STEPS_PER_KM).toFixed(2);
  document.getElementById('distance').textContent = distance;

  // Calories burned
  const caloriesBurned = Math.round(distance * CALORIES_PER_KM);
  document.getElementById('caloriesBurned').textContent = caloriesBurned.toLocaleString();

  // Progress bar
  const progress = Math.min((total / DAILY_GOAL) * 100, 100);
  document.getElementById('progressBar').style.width = progress + '%';
  document.getElementById('progressBar').setAttribute('aria-valuenow', Math.round(progress));
  document.getElementById('progressPercent').textContent = Math.round(progress) + '%';

  // Average speed (assuming 30 min walking for demo)
  const avgSpeed = distance > 0 ? (distance / 0.5).toFixed(1) : '0.0';
  document.getElementById('avgSpeed').textContent = avgSpeed + ' km/h';
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const v = parseInt(document.getElementById('stepsInput').value, 10) || 0;
  if (v <= 0) {
    alert('Please enter a positive number');
    return;
  }
  try {
    await fetch('/api/steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: v })
    });
    document.getElementById('stepsInput').value = '1000';
    fetchTotal();
  } catch (error) {
    console.error('Error adding steps:', error);
  }
});

document.getElementById('resetBtn').addEventListener('click', async () => {
  if (confirm('Are you sure you want to reset all steps?')) {
    try {
      await fetch('/api/steps/reset', { method: 'POST' });
      fetchTotal();
    } catch (error) {
      console.error('Error resetting:', error);
    }
  }
});

// Allow Enter key to add steps
document.getElementById('stepsInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('addBtn').click();
  }
});

// ==================== Calorie Calculator ====================
function calculateBMR(weight, height, age, gender) {
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  return Math.round(bmr);
}

document.getElementById('calculateBtn').addEventListener('click', () => {
  const age = parseInt(document.getElementById('age').value, 10);
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseInt(document.getElementById('height').value, 10);
  const gender = document.getElementById('gender').value;
  const activityLevel = parseFloat(document.getElementById('activityLevel').value);

  if (!age || !weight || !height) {
    alert('Please fill in all fields');
    return;
  }

  if (age < 1 || age > 120 || weight < 1 || weight > 300 || height < 1 || height > 250) {
    alert('Please enter valid values');
    return;
  }

  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = Math.round(bmr * activityLevel);
  const weightLoss = tdee - 500;
  const maintenance = tdee;
  const weightGain = tdee + 500;

  document.getElementById('bmrResult').textContent = bmr.toLocaleString();
  document.getElementById('tdeeResult').textContent = tdee.toLocaleString();
  document.getElementById('weightLoss').textContent = weightLoss.toLocaleString();
  document.getElementById('maintenance').textContent = maintenance.toLocaleString();
  document.getElementById('weightGain').textContent = weightGain.toLocaleString();

  document.getElementById('calorieResults').style.display = 'block';
});

// Allow Enter key in form fields
document.getElementById('age').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('calculateBtn').click();
});
document.getElementById('weight').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('calculateBtn').click();
});
document.getElementById('height').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('calculateBtn').click();
});

// ==================== Initialize ====================
window.addEventListener('load', () => {
  fetchTotal();
  // Auto-calculate on activity level change
  document.getElementById('activityLevel').addEventListener('change', () => {
    if (document.getElementById('calorieResults').style.display !== 'none') {
      document.getElementById('calculateBtn').click();
    }
  });
});
