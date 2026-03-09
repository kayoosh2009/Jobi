
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

    const firebaseConfig = {
        apiKey: "AIzaSyDA9KfdcE2acdeSgkfRVS_KiX1eBBrR1Ao",
        authDomain: "jobi-il.firebaseapp.com",
        databaseURL: "https://jobi-il-default-rtdb.firebaseio.com",
        projectId: "jobi-il",
        appId: "1:1049483275681:web:ef9bb3c9343aa0939d6fe0"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const userId = localStorage.getItem('user_id');

    if (!userId) {
        window.location.href = 'login.html';
    }

    // Слушаем изменения в базе в реальном времени
    const userRef = ref(db, 'users/' + userId);
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // 1. Основное
            document.getElementById('user-name').innerText = data.fullName || "ללא שם";
            document.getElementById('full-name').innerText = data.fullName || "-";
            document.getElementById('user-nickname').innerText = "@" + (data.fullName ? data.fullName.toLowerCase().replace(/\s/g, '_') : 'user');
            
            // 2. Инфо
            document.getElementById('user-age').innerText = data.dob || "-";
            document.getElementById('user-location').innerText = (data.city || "") + (data.district ? ", " + data.district : "");
            
            // 3. Контакты
            document.getElementById('contact-tg').innerText = data.tg || "-";
            document.getElementById('contact-phone').innerText = data.phone || "-";
            
            // 4. График
            document.getElementById('schedule-info').innerText = data.schedule || "לא צוין לו\"ז";
            
            // 5. Навыки (разбиваем строку через запятую на теги)
            const skillsContainer = document.getElementById('skills-list');
            skillsContainer.innerHTML = '';
            if (data.skills) {
                data.skills.split(',').forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'tag';
                    span.innerText = skill.trim();
                    skillsContainer.appendChild(span);
                });
            }

            // 6. Разрешение родителей
            const parentAuth = document.getElementById('parent-auth');
            if (data.parentAuth) {
                parentAuth.innerText = "✓ מאושר";
                parentAuth.className = "text-green-600 font-black italic";
            } else {
                parentAuth.innerText = "✗ אין אישור";
                parentAuth.className = "text-red-600 font-black italic";
            }
        }
    });

// Получаем данные, которые сохранились при входе
const localData = JSON.parse(localStorage.getItem('user_data'));

if (localData && localData.photo) {
    const userPhoto = localData.photo;
    
    // Подставляем фото в аватарку
    const profileImg = document.getElementById('profile-pic');
    if (profileImg) profileImg.src = userPhoto;

    // Подставляем то же фото в баннер
    const bannerImg = document.getElementById('banner-bg');
    if (bannerImg) bannerImg.src = userPhoto;
}

