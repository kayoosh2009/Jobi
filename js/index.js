import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
    
// Конфиг Firebase (используем тот же, что в регистрации бизнеса)
const firebaseConfig = {
    apiKey: "AIzaSyDA9KfdcE2acdeSgkfRVS_KiX1eBBrR1Ao",
    authDomain: "jobi-il.firebaseapp.com",
    projectId: "jobi-il",
    appId: "1:1049483275681:web:ef9bb3c9343aa0939d6fe0"
};
    
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
    
// --- ФУНКЦИЯ ЗАГРУЗКИ КАРТОЧЕК ---
async function loadJobs() {
    const jobsList = document.getElementById('jobs-list');
            
    try {
        // Получаем все документы из коллекции "businesses"
        const querySnapshot = await getDocs(collection(db, "businesses"));
                
        if (querySnapshot.empty) {
            jobsList.innerHTML = "<p class='col-span-full text-center py-10 text-gray-400 font-bold'>כרגע אין משרות זמינות. בדוק שוב מאוחר יותר!</p>";
            return;
        }
    
        jobsList.innerHTML = ""; // Очищаем текст "טוען..."
    
        querySnapshot.forEach((doc) => {
            const data = doc.data();
                    
            // Создаем HTML карточки на основе данных из Firestore
            const card = `
                <div class="job-card shadow-lg hover:shadow-xl transition-all cursor-pointer group" onclick="location.href='app/job-page.html?id=${doc.id}'">
                    <div class="h-32 bg-gray-100 relative overflow-hidden">
                        <img src="img/banner.png" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                        <div class="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-lg font-bold">
                            ${data.address || 'כתובת לא צוינה'}
                        </div>
                    </div>
                    <div class="p-4 text-right">
                        <div class="flex justify-between items-start mb-2">
                            <span class="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md italic">חדש!</span>
                            <h3 class="text-xl font-black text-gray-900">${data.bizName}</h3>
                        </div>
                        <p class="text-gray-500 text-xs mb-4 line-clamp-2 font-medium">${data.description || 'אין תיאור זמין'}</p>
                                
                        <div class="flex items-center justify-between border-t border-gray-100 pt-3">
                            <div class="flex flex-col items-start">
                                <span class="text-[10px] text-gray-400 font-bold leading-none">שכר לשעה</span>
                                <span class="text-[#feb900] font-black text-lg">₪${data.salaryMax || '??'}</span>
                            </div>
                            <div class="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                <span class="text-sm font-black">${data.age || '16'}+</span>
                                <span class="text-[10px] text-gray-500 font-bold">גיל</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            jobsList.innerHTML += card;
        });
    } catch (error) {
        console.error("Error loading jobs:", error);
        jobsList.innerHTML = "<p class='col-span-full text-center text-red-500'>שגיאה בטעינת הנתונים</p>";
    }
}
    
// --- ОСТАЛЬНАЯ ЛОГИКА МЕНЮ ---
window.toggleMenu = (open) => {
    document.getElementById('side-menu').classList.toggle('active', open);
    document.getElementById('overlay').style.display = open ? 'block' : 'none';
};
    
window.logout = () => {
    localStorage.clear();
    location.reload();
};
    
function renderNav() {
    const user = JSON.parse(localStorage.getItem('jobi_user'));
    const nav = document.getElementById('nav-content');
    const userCard = document.getElementById('user-card-menu');
            
    if (user) {
        userCard.classList.remove('hidden');
        document.getElementById('menu-username').textContent = user.firstName + " " + (user.lastName || "");
        if(user.avatar) {
            document.getElementById('menu-avatar').src = user.avatar;
            document.getElementById('nav-avatar').src = user.avatar;
        }    
            nav.innerHTML = `
            <a href="app/profile.html" class="hover:text-[#feb900] transition-colors">👤 הפרופיל שלי</a>
            <a href="app/my-jobs.html" class="hover:text-[#feb900] transition-colors">💼 המשרות שלי</a>
            <a href="app/chat.html" class="hover:text-[#feb900] transition-colors">💬 הודעות</a>
            <a href="app/settings.html" class="hover:text-[#feb900] transition-colors text-sm text-gray-400 mt-4">⚙️ הגדרות חשבון</a>
            <button onclick="logout()" class="text-red-500 mt-6 text-right font-black italic">יציאה מהחשבון</button>
        `;
    } else {
        userCard.classList.add('hidden');
        nav.innerHTML = `
            <p class="text-sm text-gray-500 mb-2 font-normal italic">היי, אורח!</p>
            <a href="account/login.html" class="bg-[#feb900] text-center p-3 rounded-2xl text-black shadow-md font-bold">התחברות</a>
            <a href="account/register.html" class="border-2 border-[#feb900] text-center p-3 rounded-2xl text-black font-bold">הרשמה ל-Jobi</a>
        `;
    }
}
    
window.openAdModal = (url) => {
    document.getElementById('ad-link').href = url;
    document.getElementById('ad-modal').classList.remove('hidden');
};
window.closeAdModal = () => document.getElementById('ad-modal').classList.add('hidden');
    
// Запускаем всё
renderNav();
loadJobs();
