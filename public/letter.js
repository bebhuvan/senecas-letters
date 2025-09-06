// Font selection
function changeFont(fontType) {
  const body = document.body;
  // Remove existing font classes
  body.classList.remove('font-serif', 'font-georgia', 'font-sans', 'font-system', 'font-mono');
  
  body.classList.add(`font-${fontType}`);
  localStorage.setItem('fontType', fontType);
}

// Reading mode
function changeFontSize(action) {
  const body = document.body;
  // Remove existing reading mode classes
  body.classList.remove('reading-mode-compact', 'reading-mode-comfort', 'reading-mode-spacious');
  
  if (action === 'decrease') {
    body.classList.add('reading-mode-compact');
    localStorage.setItem('readingMode', 'compact');
  } else if (action === 'increase') {
    body.classList.add('reading-mode-spacious');
    localStorage.setItem('readingMode', 'spacious');
  } else {
    body.classList.add('reading-mode-comfort');
    localStorage.setItem('readingMode', 'comfort');
  }
}

// Load saved preferences
const savedMode = localStorage.getItem('readingMode') || 'comfort';
const savedFont = localStorage.getItem('fontType') || 'serif';

// Apply saved reading mode
document.body.classList.remove('reading-mode-compact', 'reading-mode-comfort', 'reading-mode-spacious');
document.body.classList.add(`reading-mode-${savedMode}`);

// Apply saved font
document.body.classList.add(`font-${savedFont}`);

// Set the select dropdown to match
window.addEventListener('DOMContentLoaded', () => {
  const fontSelector = document.querySelector('.font-selector');
  if (fontSelector) {
    fontSelector.value = savedFont;
  }
});

// Highly optimized scroll handling with passive events and reduced DOM queries
let lastScrollTop = 0;
let ticking = false;
let progressBar = null;
let header = null;
let documentHeight = 0;
let clientHeight = 0;

// Cache DOM elements and dimensions
function initializeScrollElements() {
  progressBar = document.getElementById('progressBar');
  header = document.getElementById('header');
  documentHeight = document.documentElement.scrollHeight;
  clientHeight = document.documentElement.clientHeight;
}

function updateScrollElements() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Update progress bar with cached dimensions
  if (progressBar && documentHeight > clientHeight) {
    const scrolled = (scrollTop / (documentHeight - clientHeight)) * 100;
    progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
  }
  
  // Header visibility with threshold
  if (header) {
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.classList.add('hidden');
    } else if (scrollTop < lastScrollTop || scrollTop <= 50) {
      header.classList.remove('hidden');
    }
  }
  
  lastScrollTop = Math.max(0, scrollTop);
  ticking = false;
}

// Use passive scroll events for better performance
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollElements);
    ticking = true;
  }
}, { passive: true });

// Recalculate dimensions on resize
window.addEventListener('resize', () => {
  documentHeight = document.documentElement.scrollHeight;
  clientHeight = document.documentElement.clientHeight;
}, { passive: true });

// Initialize after DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeScrollElements);
} else {
  initializeScrollElements();
}