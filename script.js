// OPCIONES CON PINTEREST Y FORMATO CORREGIDO
const optionsData = {
    casa: {
        comida: ["Pizza de la Esperanza", "Tacos del Gordo", "Buscar hamburguesas", "Preparar hamburguesas", "Ramen", "Poke Bowl (Ale's version)"],
        postre: ["Leche Nesquik con pastel y/o flan", "Preparar fresas con crema", "Buscar fresas con crema", "Preparar pretzels con chocolate","Helados Myka", "Preparar fresas con chocolate", "Esquites", "Preparar chocolate caliente con leche"],
        plan: ["Pinterest", "Ver clases de baile en youtube y practicar", "Ver y escuchar Astro en YouTube", "Noche de películas", "Jugar Resident Evil", "Noche de mascarillas", "Concierto privado", "Noche de juegos de mesa", "Noche de descanso"]
    },
    salir: {
        comida: ["Nonsolo", "Parritacos", "Tacos Jalisco", "Tacos el Naranjito", "Tacos Atarantados", "Buscar un restaurante nuevo", "Lugar rockero"],
        postre: ["Helado Myka", "Buscar fresas con crema", "Esquites","Pastel y/o Flan"],
        plan: ["Caminar en Parque Lincoln", "Caminar en Reforma", "Plaza Ventura", "Xtrike las Américas", "Xtrike la Cúspide", "Clases de baile", "Noche de astronomía (Fuera)", "Caminar en Chapultepec", "Caminar en Condesa", "Boliche"]
    }
};

// Mapeo de respaldos Web para imágenes de fondo en caso de no estar en la carpeta aún
const fallbackBackgrounds = {
    'Background/1.jpg': 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1920&q=80',
    'Background/2.jpg': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80',
    'Background/3.jpg': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    'Background/4.jpg': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    'Background/5.jpg': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    'Background/6.jpg': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    'Background/7.jpg': 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1920&q=80'
};

let currentMode = '';
let currentCategory = '';
let categoriesList = ['comida', 'postre', 'plan'];
let currentCatIndex = 0;
let tournamentList = [];
let winningChoices = {};
let userPhotoURL = '';
let isSelecting = false;

// CAMBIO DINÁMICO DE FASES Y FONDOS GARANTIZADO
function goToPhase(nextPhaseId, bgImagePath, locationTagText) {
    if(bgImagePath) {
        const bgLayer = document.getElementById('bgLayer');
        const fallback = fallbackBackgrounds[bgImagePath] || '';
        
        // Asignación de imagen local + respaldo Web si la carpeta está vacía
        bgLayer.style.backgroundImage = `url('${bgImagePath}'), url('${fallback}')`;
        
        if(locationTagText) {
            document.getElementById('locName').innerText = locationTagText;
        }
    }

    document.querySelectorAll('.phase-card').forEach(el => el.classList.remove('active'));
    document.getElementById('phase' + nextPhaseId).classList.add('active');
}

function rejectAction(btnId) {
    const btn = document.getElementById(btnId);
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 400);
}

function previewFile(input, targetId) {
    if (input.files && input.files[0]) {
        document.getElementById(targetId).innerText = "✓ " + input.files[0].name;
        if(input.id === 'userPhoto') {
            const reader = new FileReader();
            reader.onload = e => userPhotoURL = e.target.result;
            reader.readAsDataURL(input.files[0]);
        }
    }
}

function validateEmailFormat(email) {
    const re = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateForm() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const errorMsg = document.getElementById('emailError');

    if(!name || !email || !validateEmailFormat(email)) {
        errorMsg.classList.add('active');
        document.getElementById('userEmail').focus();
        return;
    }

    errorMsg.classList.remove('active');
    goToPhase(4, 'Background/4.jpg', 'FASE 4: CONFIRMACIÓN REQUERIDA');
}

function selectMode(mode) {
    currentMode = mode;
    currentCatIndex = 0;
    startCategoryTournament();
}

function startCategoryTournament() {
    if(currentCatIndex >= categoriesList.length) {
        renderFinalBadge();
        goToPhase(7, 'Background/7.jpg', 'FASE 7: VERIFICACIÓN FINAL');
        return;
    }
    currentCategory = categoriesList[currentCatIndex];
    document.getElementById('categoryTitle').innerText = "CATEGORÍA: " + currentCategory.toUpperCase();
    tournamentList = [...optionsData[currentMode][currentCategory]];
    goToPhase('6_tournament', 'Background/6.jpg', 'FASE 6: SELECCIÓN DE ' + currentCategory.toUpperCase());
    updateCards();
}

function updateCards() {
    if(tournamentList.length === 1) {
        winningChoices[currentCategory] = tournamentList[0];
        currentCatIndex++;
        
        if(currentCatIndex < categoriesList.length) {
            showCategoryTransitionBanner(categoriesList[currentCatIndex].toUpperCase(), () => {
                startCategoryTournament();
            });
        } else {
            startCategoryTournament();
        }
        return;
    }
    const cardA = document.getElementById('optA');
    const cardB = document.getElementById('optB');

    cardA.className = 'option-card';
    cardB.className = 'option-card';

    document.getElementById('optAText').innerText = tournamentList[0];
    document.getElementById('optBText').innerText = tournamentList[1];
    isSelecting = false;
}

function showCategoryTransitionBanner(nextCatName, callback) {
    const banner = document.getElementById('categoryTransitionBanner');
    document.getElementById('catBannerText').innerText = "✦ ¡CATEGORÍA COMPLETADA! ✦";
    banner.classList.add('active');

    setTimeout(() => {
        banner.classList.remove('active');
        if(callback) callback();
    }, 1800);
}

function pickOption(choice) {
    if(isSelecting) return;
    isSelecting = true;

    const chosenCard = (choice === 'A') ? document.getElementById('optA') : document.getElementById('optB');
    const discardedCard = (choice === 'A') ? document.getElementById('optB') : document.getElementById('optA');

    chosenCard.classList.add('opt-selected-blink');
    discardedCard.classList.add('opt-fade-out');

    setTimeout(() => {
        if(choice === 'A') {
            tournamentList.splice(1, 1);
        } else {
            tournamentList.splice(0, 1);
        }
        updateCards();
    }, 700);
}

function renderFinalBadge() {
    const name = document.getElementById('userName').value || "Sharon Gissela Rivas González";
    document.getElementById('badgeName').innerText = name;
    
    if(userPhotoURL) {
        document.getElementById('badgeImg').src = userPhotoURL;
    }

    const list = document.getElementById('finalItinerary');
    list.innerHTML = `
        <li><b>Comida:</b> ${winningChoices.comida}</li>
        <li><b>Postre:</b> ${winningChoices.postre}</li>
        <li><b>Plan:</b> ${winningChoices.plan}</li>
    `;
}

function openGoogleCalendar() {
    const title = encodeURIComponent("Nuestra Cita Especial - 27 de Noviembre");
    const details = encodeURIComponent(`Cita romántica celebrando 8 meses de novios y 11 meses de nuestro reencuentro.

Itinerario Elegido:
• Comida: ${winningChoices.comida}
• Postre: ${winningChoices.postre}
• Plan: ${winningChoices.plan}

Organizador: diegoanell427@gmail.com`);
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261127/20261128&details=${details}&add=diegoanell427@gmail.com`;
    window.open(url, '_blank');
}

function sendWhatsApp() {
    const text = encodeURIComponent(`✨ ¡Misión Espacial Confirmada! ✨

📅 Fecha: 27 de Noviembre de 2026 (Todo el día)
👤 Sharon Gissela Rivas González

🍽 Comida: ${winningChoices.comida}
🍧 Postre: ${winningChoices.postre}
🚀 Plan: ${winningChoices.plan}

¡Ansioso por vivir nuestra cita! ❤️`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

// CANVAS DE ESTRELLAS
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for(let i = 0; i < 180; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            alpha: Math.random()
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.alpha += (Math.random() - 0.5) * 0.02;
        if(s.alpha < 0.1) s.alpha = 0.1;
        if(s.alpha > 1) s.alpha = 1;
    });
    requestAnimationFrame(drawStars);
}

window.addEventListener('resize', initStars);
initStars();
drawStars();

// AUDIO
const musicBtn = document.getElementById('musicToggle');
const audio = document.getElementById('bgMusic');
let playing = false;

musicBtn.addEventListener('click', () => {
    if(playing) {
        audio.pause();
        document.getElementById('musicIcon').innerText = "🔇";
        document.getElementById('musicText').innerText = "MÚSICA: OFF";
    } else {
        audio.play();
        document.getElementById('musicIcon').innerText = "🔊";
        document.getElementById('musicText').innerText = "MÚSICA: ON";
    }
    playing = !playing;
});
