import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
        import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

        // Твой конфиг
        const firebaseConfig = {
            apiKey: "AIzaSyDA9KfdcE2acdeSgkfRVS_KiX1eBBrR1Ao",
            authDomain: "jobi-il.firebaseapp.com",
            projectId: "jobi-il",
            appId: "1:1049483275681:web:ef9bb3c9343aa0939d6fe0"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

        // Показать/Скрыть пароль через lock.png
        const passInput = document.getElementById('password');
        document.getElementById('toggle-pass').onclick = () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            // Можно добавить легкую анимацию нажатия
        };

        document.getElementById('login-form').onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = passInput.value;
            const errorDiv = document.getElementById('error-msg');

            errorDiv.classList.add('hidden');

            if (!email.endsWith('@jobi.israel')) {
                errorDiv.innerText = "גישה נדחתה. רק חשבונות @jobi.israel מורשים.";
                errorDiv.classList.remove('hidden');
                return;
            }

            try {
                const userCred = await signInWithEmailAndPassword(auth, email, password);
                
                // Проверка в БД
                const q = query(collection(db, "businesses"), where("email", "==", email));
                const snap = await getDocs(q);

                if (!snap.empty) {
                    localStorage.setItem('biz_id', userCred.user.uid);
                    window.location.href = 'dashboard.html';
                } else {
                    errorDiv.innerText = "שגיאה: חשבון זה אינו רשום כעסק.";
                    errorDiv.classList.remove('hidden');
                }
            } catch (err) {
                errorDiv.innerText = "פרטי התחברות שגויים. נסה שוב.";
                errorDiv.classList.remove('hidden');
            }
        };