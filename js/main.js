import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDA9KfdcE2acdeSgkfRVS_KiX1eBBrR1Ao",
    authDomain: "jobi-il.firebaseapp.com",
    projectId: "jobi-il",
    appId: "1:1049483275681:web:ef9bb3c9343aa0939d6fe0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Глобальные функции
window.toggleMenu = () => {
    const sideMenu = document.getElementById('sideMenu');
    const menuContent = document.getElementById('menuContent');
    sideMenu.classList.toggle('hidden');
    
    const user = localStorage.getItem('user_id');
    if (!user) {
        menuContent.innerHTML = `<a href="login.html" class="hover:text-[#FFD700] transition">כניסה</a>`;
    } else {
        menuContent.innerHTML = `
            <a href="profile.html" class="hover:text-[#FFD700] transition">פרופיל אישי</a>
            <a href="chats.html" class="hover:text-[#FFD700] transition">הצ'אטים שלי</a>
            <hr class="border-2 border-black my-2">
            <a href="#" id="logout-btn" class="text-red-500 font-black italic">התנתק</a>
        `;
        // Ожидаем отрисовки и вешаем логаут
        setTimeout(() => {
            const btn = document.getElementById('logout-btn');
            if(btn) btn.onclick = () => { localStorage.clear(); location.reload(); };
        }, 100);
    }
};

window.handleSearch = () => {
    const val = document.getElementById('searchInput').value || document.getElementById('searchInputMobile').value;
    if(val) window.location.href = `search.html?q=${encodeURIComponent(val)}`;
};

// Загрузка вакансий
document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('jobs-list');
    const cityFilter = document.getElementById('filter-city');
    const ageFilter = document.getElementById('filter-age');

    const loadJobs = () => {
        let q = collection(db, "businesses");

        if (cityFilter && cityFilter.value) {
            q = query(q, where("location", "==", cityFilter.value));
        }

        onSnapshot(q, (snapshot) => {
            if (!list) return;
            list.innerHTML = '';
            
            if (snapshot.empty) {
                list.innerHTML = '<p class="col-span-full text-center font-bold opacity-50 py-10 text-xl text-black">לא נמצאו משרות... 😕</p>';
                return;
            }

            snapshot.forEach((doc) => {
                const job = doc.data();
                const jobId = doc.id;
                const displayPhoto = job.logo || 'https://via.placeholder.com/400x200?text=Jobi+Business';

                list.innerHTML += `
                    <div onclick="window.location.href='business_view.html?id=${jobId}'" class="job-card bg-white rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-all border-4 border-black cursor-pointer active:scale-95">
                        <div class="h-48 overflow-hidden relative border-b-4 border-black bg-gray-100">
                            <img src="${displayPhoto}" class="w-full h-full object-cover">
                            <div class="absolute top-4 right-4 bg-[#FFD700] text-black font-black px-3 py-1 rounded-full border-2 border-black text-sm">
                                ${job.defaultAge || '14'}+
                            </div>
                        </div>
                        <div class="p-6 flex flex-col flex-1">
                            <h3 class="text-2xl font-black mb-1 italic leading-tight text-right text-black">${job.name || 'עסק'}</h3>
                            <p class="text-gray-500 font-bold text-sm mb-3 text-right">📍 ${job.location || 'כל הארץ'}</p>
                            <p class="text-gray-600 font-bold text-sm mb-4 line-clamp-2 text-right">${job.description || ''}</p>
                            
                            <div class="flex items-center justify-between mt-auto pt-4 border-t-2 border-black/10">
                                <span class="text-2xl font-black italic text-black">₪${job.defaultSalary || '40'}</span>
                                <button class="bg-black text-[#FFD700] font-black px-6 py-2 rounded-xl border-2 border-black">
                                    פרטים
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
    };

    if (cityFilter) cityFilter.addEventListener('change', loadJobs);
    if (ageFilter) ageFilter.addEventListener('change', loadJobs);
    loadJobs();
});