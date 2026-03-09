const firebaseConfig = {
    apiKey: "AIzaSyDA9KfdcE2acdeSgkfRVS_KiX1eBBrR1Ao",
    authDomain: "jobi-il.firebaseapp.com",
    databaseURL: "https://jobi-il-default-rtdb.firebaseio.com",
    projectId: "jobi-il",
    storageBucket: "jobi-il.firebasestorage.app",
    messagingSenderId: "1049483275681",
    appId: "1:1049483275681:web:ef9bb3c9343aa0939d6fe0"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Меню и авторизация
const userMenuBtn = document.getElementById('userMenuBtn');
const sideMenu = document.getElementById('sideMenu');
const menuContent = document.getElementById('menuContent');

function toggleMenu() {
    sideMenu.classList.toggle('hidden');
    const user = localStorage.getItem('user_id'); // Проверка входа

    if (!user) {
        menuContent.innerHTML = `
            <a href="login.html" class="hover:text-[#FFD700]">כניסה</a>
        `;
    } else {
        menuContent.innerHTML = `
            <a href="profile.html" class="hover:text-[#FFD700]">פרופיל אישי</a>
            <a href="chats.html" class="hover:text-[#FFD700]">הצ'אטים שלי</a>
            <a href="settings.html" class="hover:text-[#FFD700]">הגדרות</a>
            <hr class="border-2 border-black">
            <a href="#" onclick="logout()" class="text-red-500">התנתק</a>
        `;
    }
}

userMenuBtn.onclick = toggleMenu;

function logout() {
    localStorage.clear();
    location.reload();
}

// Поиск
function handleSearch() {
    const val = document.getElementById('searchInput').value;
    if(val) window.location.href = `search.html?q=${encodeURIComponent(val)}`;
}

// Загрузка карточек из Firebase
function loadJobs() {
    const list = document.getElementById('jobs-list');
    database.ref('jobs').on('value', (snapshot) => {
        list.innerHTML = '';
        snapshot.forEach((child) => {
            const job = child.val();
            list.innerHTML += `
                <div class="job-card bg-white rounded-3xl overflow-hidden shadow-sm relative group">
                    <div class="h-48 overflow-hidden relative">
                        <img src="${job.image || 'img/default.png'}" class="w-full h-full object-cover">
                        <div class="absolute top-4 right-4 bg-[#FFD700] text-black font-black px-3 py-1 rounded-full border-2 border-black text-sm">
                            ${job.age || '14'}+
                        </div>
                    </div>
                    <div class="p-6 border-x-4 border-b-4 border-black rounded-b-3xl">
                        <h3 class="text-2xl font-black mb-2 italic">${job.name || job.title}</h3>
                        <p class="text-gray-600 font-bold text-sm mb-4 line-clamp-2">${job.description}</p>
                        <div class="flex items-center justify-between mt-auto">
                            <span class="flex items-center gap-1 font-black text-sm">
                                <span class="text-xl">📍</span> ${job.location}
                            </span>
                            <button class="bg-black text-white font-black px-4 py-2 rounded-xl hover:bg-[#FFD700] hover:text-black transition-colors border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,215,0,1)]">
                                פרטים
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    });
}

loadJobs();