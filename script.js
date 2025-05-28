const principlesData = [
  {
    id: "principle-1",
    name: "Legalidad",
    definition:
      "El Tratamiento a que se refiere la ley 1581 de 2012 es una actividad reglada que debe sujetarse a lo establecido en ella y en las demás disposiciones que la desarrolle.",
  },
  {
    id: "principle-2",
    name: "Finalidad",
    definition:
      "El Tratamiento debe obedecer a una finalidad legítima de acuerdo con la Constitución y la Ley, la cual debe ser informada al Titular.",
  },
  {
    id: "principle-3",
    name: "Libertad",
    definition:
      "Los datos personales no podrán ser obtenidos o divulgados sin previa autorización, o en ausencia de mandato legal o judicial que releve el consentimiento.",
  },
  {
    id: "principle-4",
    name: "Veracidad o Calidad",
    definition:
      "La información sujeta a Tratamiento debe ser veraz, completa, exacta, actualizada, comprobable y comprensible.",
  },
  {
    id: "principle-5",
    name: "Transparencia",
    definition:
      "En el Tratamiento debe garantizarse el derecho del titular a obtener del responsable o del Encargado del Tratamiento, en cualquier momento y sin restricciones, información acerca de datos que le conciernan.",
  },
  {
    id: "principle-6",
    name: "Acceso y Circulación Restringida",
    definition:
      "El Tratamiento solo podrá hacerse por personas autorizadas por el Titular y/o por las personas previstas en la ley.",
  },
  {
    id: "principle-7",
    name: "Seguridad",
    definition:
      "La información se deberá manejar con las medidas técnicas, humanas y administrativas que sean necesarias para otorgar seguridad a los registros evitando su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.",
  },
  {
    id: "principle-8",
    name: "Confidencialidad",
    definition:
      "Las personas que intervengan en el Tratamiento de datos personales están obligadas a garantizar la reserva de la información, inclusive después de finalizada su relación con alguna de las labores que comprende el tratamiento.",
  },
];

const principlesElement = document.querySelectorAll('.principle');
const score = document.getElementById('score');
const resetButton = document.getElementById('reset');
const timer = document.getElementById('timer');
const toggleDarkModeButton = document.getElementById('toggle-dark');

let correctCount = 0;
let tryCount = 0;
let timerInterval = null;

// Inicializa el juego
window.addEventListener('DOMContentLoaded', () => {
  renderDefinitions();
  attachDefinitionEvents();
});

toggleDarkModeButton.addEventListener('click', () => {
  const mode = document.documentElement.getAttribute('data-theme');
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleDarkModeButton.textContent = '🌙';
    toggleDarkModeButton.setAttribute('aria-label', 'Activar modo oscuro');
    showNotification('Modo claro activado.', 'info');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleDarkModeButton.textContent = '☀️';
    toggleDarkModeButton.setAttribute('aria-label', 'Activar modo claro');
    showNotification('Modo oscuro activado.', 'info');
  }
});

principlesElement.forEach((principle) => {
  principle.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', principle.id);
    correctCount === 0 && startTimer();
  });

  principle.addEventListener('dragend', () => {
    principle.classList.remove('dragging');
  });
});

resetButton.addEventListener('click', () => {
  principlesElement.forEach((principle) => {
    principle.classList.remove('correct', 'incorrect');
    principle.draggable = true;
  });

  renderDefinitions();
  attachDefinitionEvents();

  correctCount = 0;
  score.textContent = '0';
  stopTimer();
  timer.textContent = '00:00';
  showNotification('El juego ha sido reiniciado.', 'info');
});

function showNotification(message, type = 'info') {
  const container = document.querySelector('.notifications-container');

  const notification = document.createElement('section');

  if (type === 'info') {
    notification.classList.add('notification', 'info');
    notification.textContent = `ℹ️ ${message}`;
  } else if (type === 'success') {
    notification.classList.add('notification', 'success');
    notification.textContent = `✔️ ${message}`;
  } else if (type === 'error') {
    notification.classList.add('notification', 'error');
    notification.textContent = `❌ ${message}`;
  } else {
    notification.classList.add('notification', 'warning');
    notification.textContent = `⚠️ ${message}`;
  }

  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// Timer chronometer
function startTimer() {
  if (timerInterval !== null) return; // Prevent multiple intervals

  let seconds = 0;
  let minutes = 0;
  timerInterval = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  timerInterval !== null && clearInterval(timerInterval);
  timerInterval = null;
}

function correctTry() {
  correctCount++;

  score.textContent = `${correctCount}`;
}

// Función para mezclar aleatoriamente (Fisher-Yates)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
}

// Función para renderizar las definiciones en el DOM
function renderDefinitions() {
  const definitionsSection = document.querySelector('.definitions');
  // Elimina las definiciones actuales (excepto el título)
  definitionsSection.querySelectorAll('.definition')?.forEach(el => el.remove());

  // Mezcla las definiciones
  const shuffled = shuffle([...principlesData]);

  // Inserta las definiciones mezcladas
  shuffled.forEach(principle => {
    const div = document.createElement('div');
    div.className = 'definition';
    div.setAttribute('data-principle', principle.id);
    div.innerHTML = `<p>${principle.definition}</p>`;
    definitionsSection.appendChild(div);
  });
}

function attachDefinitionEvents() {
  // Reasigna los eventos a las nuevas definiciones
  const definitionsElement = document.querySelectorAll('.definition');
  definitionsElement.forEach((definition) => {
    definition.addEventListener('dragover', (e) => {
      e.preventDefault();
      definition.classList.add('highlight');
    });

    definition.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.target.classList.remove('highlight');
    });

    definition.addEventListener('drop', handleDrop);
  });
}

function handleDrop(e) {
  e.preventDefault();
  const definition = e.target.closest('.definition');

  definition.classList.remove('highlight');

  const principleId = e.dataTransfer.getData('text/plain');
  const principle = document.getElementById(principleId);
  const principleAllowed = definition.dataset.principle;
  principle.classList.remove('correct', 'incorrect');
  principle.draggable = false;

  if (principleAllowed === principleId) {
    principle.classList.add('correct');
    definition.style.visibility = 'hidden';
    correctTry();
    showNotification('¡Correcto! Has relacionado el principio correctamente.', 'success');
  } else {
    principle.classList.add('incorrect');
    showNotification('Incorrecto. Intenta de nuevo.', 'error');
  }

  tryCount++;
  if (tryCount === principlesData.length) {
    stopTimer();
    showNotification('¡Has completado el juego!', 'info');
    showNotification(`Tu puntuación final es: ${correctCount} de ${principlesData.length}`, 'info');
  }
}
