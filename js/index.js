import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Твой конфиг Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDA9KfdcE2acdeSgkfRVS_KiX1eBBrR1Ao",
    authDomain: "jobi-il.firebaseapp.com",
    projectId: "jobi-il",
    appId: "1:1049483275681:web:ef9bb3c9343aa0939d6fe0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- ЛОГИКА МЕНЮ (БУРГЕР) ---
const toggleMenu = (open) => {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');
    if (open) {
        menu.classList.add('active');
        overlay.style.display = 'block';
    } else {
        menu.classList.remove('active');
        overlay.style.display = 'none';
    }
};

// Функция выхода
const logout = () => {
    localStorage.clear();
    location.reload();
};

// --- Отрисовка навигации ---
function renderNav() {
    const user = JSON.parse(localStorage.getItem('jobi_user'));
    const nav = document.getElementById('nav-content');
    const userCard = document.getElementById('user-card-menu');
    
    if (user) {
        // Показываем карточку юзера в меню
        userCard.classList.remove('hidden');
        document.getElementById('menu-username').textContent = user.firstName + " " + user.lastName;
        
        if(user.avatar) {
            document.getElementById('menu-avatar').src = user.avatar;
            document.getElementById('nav-avatar').src = user.avatar;
        }

        nav.innerHTML = `
            <a href="html/app/profile.html" class="hover:text-[#feb900] transition">👤 הפרופיל שלי</a>
            <a href="html/app/my-jobs.html" class="hover:text-[#feb900] transition">💼 המשרות שלי</a>
            <a href="html/app/chat.html" class="hover:text-[#feb900] transition">💬 הודעות</a>
            <a href="html/app/settings.html" class="text-gray-400 mt-4 text-sm">⚙️ הגדרות חשבון</a>
            <button id="logout-btn" class="text-red-500 mt-6 text-right font-black italic">יציאה מהחשבון</button>
        `;

        // Слушатель для кнопки выхода (так как она создана динамически)
        document.getElementById('logout-btn').addEventListener('click', logout);

    } else {
        // Если гость
        userCard.classList.add('hidden');
        nav.innerHTML = `
            <p class="text-sm text-gray-500 mb-2 font-normal italic">היי, אורח!</p>
            <a href="html/account/login.html" class="bg-[#feb900] text-center p-3 rounded-2xl text-black font-bold shadow-sm">התחברות</a>
            <a href="html/account/register.html" class="border-2 border-[#feb900] text-center p-3 rounded-2xl text-black font-bold">הרשמה</a>
        `;
    }
}

// --- ЗАГРУЗКА КАРТОЧЕК ИЗ FIREBASE ---
async function loadJobs() {
    const jobsList = document.getElementById('jobs-list');
    try {
        const querySnapshot = await getDocs(collection(db, "businesses"));
        
        if (querySnapshot.empty) {
            jobsList.innerHTML = "<p class='col-span-full text-center py-10 text-gray-400 font-bold'>אין משרות זמינות כרגע</p>";
            return;
        }

        jobsList.innerHTML = ""; // Очищаем скелетоны
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = `
                <div class="job-card shadow-lg cursor-pointer group" onclick="location.href='html/app/job-page.html?id=${doc.id}'">
                    <div class="h-32 bg-gray-100 relative overflow-hidden">
                        <img src="img/banner.png" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                        <div class="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-lg font-bold">
                            ${data.address || 'כתובת לא צוינה'}
                        </div>
                    </div>
                    <div class="p-4 text-right">
                        <div class="flex justify-between items-start mb-2">
                            <span class="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md italic">חדש!</span>
                            <h3 class="text-xl font-black text-gray-900 leading-tight">${data.bizName}</h3>
                        </div>
                        <p class="text-gray-500 text-xs mb-4 line-clamp-2">${data.description || ''}</p>
                        <div class="flex items-center justify-between border-t border-gray-100 pt-3">
                            <div class="flex flex-col items-start text-left">
                                <span class="text-[10px] text-gray-400 font-bold leading-none italic uppercase">Salary</span>
                                <span class="text-[#feb900] font-black text-lg leading-none">₪${data.salaryMax || '??'}</span>
                            </div>
                            <div class="bg-gray-50 px-3 py-1 rounded-full border border-gray-100 font-black text-sm">
                                ${data.age || '14'}+
                            </div>
                        </div>
                    </div>
                </div>`;
            jobsList.innerHTML += card;
        });
    } catch (e) { 
        console.error("Firebase Error:", e);
        jobsList.innerHTML = "<p class='col-span-full text-center text-red-500'>שגיאה בטעינת נתונים</p>";
    }
}

// --- ПРИВЯЗКА СОБЫТИЙ (ГЛАВНЫЙ ИНИЦИАТОР) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Загружаем контент
    renderNav();
    loadJobs();

    // 2. Бургер-меню (открытие/закрытие)
    // Используем ?. на случай, если ID в HTML изменится или будет опечатка
    document.getElementById('open-menu-btn')?.addEventListener('click', () => toggleMenu(true));
    document.getElementById('close-menu-btn')?.addEventListener('click', () => toggleMenu(false));
    document.getElementById('overlay')?.addEventListener('click', () => toggleMenu(false));

    // 3. Баннер и модалка рекламы
    document.getElementById('banner-trigger')?.addEventListener('click', () => {
        const adModal = document.getElementById('ad-modal');
        const adLink = document.getElementById('ad-link');
        
        if (adModal && adLink) {
            adLink.href = 'https://t.me/jobi_israel';
            adModal.classList.remove('hidden');
        }
    });
});