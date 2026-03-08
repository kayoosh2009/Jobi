import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
        import { getAuth, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDA9KfdcE2acdeSgkfRVS_KiX1eBBrR1Ao",
            authDomain: "jobi-il.firebaseapp.com",
            projectId: "jobi-il",
            storageBucket: "jobi-il.firebasestorage.app",
            messagingSenderId: "1049483275681",
            appId: "1:1049483275681:web:ef9bb3c9343aa0939d6fe0"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        // ФУНКЦИЯ ПОКАЗА КРАСИВОГО АЛЕРТА
        window.showAlert = (title, text, type = 'success') => {
            document.getElementById('alert-title').textContent = title;
            document.getElementById('alert-text').textContent = text;
            document.getElementById('alert-img').src = (type === 'error') ? '../../img/error.png' : '../../img/logo.png';
            document.getElementById('custom-alert').classList.remove('hidden');
        };

        window.closeAlert = () => {
            document.getElementById('custom-alert').classList.add('hidden');
        };

        window.toggleModal = (id, show) => {
            document.getElementById(id).classList.toggle('hidden', !show);
        };

        // Вход через Google
        document.getElementById('google-login-btn').onclick = async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                showAlert("ברוכים הבאים!", "התחברת בהצלחה עם Google");
                setTimeout(() => {
                    localStorage.setItem('jobi_user', JSON.stringify({
                        firstName: result.user.displayName.split(' ')[0],
                        lastName: result.user.displayName.split(' ')[1] || "",
                        avatar: result.user.photoURL,
                        age: "16"
                    }));
                    window.location.href = '../app/profile.html';
                }, 1500);
            } catch (error) {
                showAlert("שגיאה", "לא הצלחנו לחבר אותך עם Google", "error");
            }
        };

        // Восстановление пароля
        window.sendResetEmail = async () => {
            const email = document.getElementById('reset-email').value;
            if (!email) {
                showAlert("אופס", "צריך להכניס אימייל קודם", "error");
                return;
            }
            try {
                await sendPasswordResetEmail(auth, email);
                toggleModal('reset-modal', false);
                showAlert("נשלח!", "בדוק את תיבת המייל שלך (גם בספאם)");
            } catch (error) {
                showAlert("שגיאה", "המייל לא קיים במערכת", "error");
            }
        };

        // Обычный вход (форма)
        document.getElementById('login-form').onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                await signInWithEmailAndPassword(auth, email, password);
                showAlert("מעולה!", "נכנסת למערכת בהצלחה");
                setTimeout(() => window.location.href = '../app/profile.html', 1500);
            } catch (error) {
                showAlert("כניסה נכשלה", "אימייל או סיסמה לא נכונים", "error");
            }
        };