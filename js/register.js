import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
        import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
        const db = getFirestore(app);

        window.previewImage = (input, imgId, placeholderId) => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.getElementById(imgId);
                    img.src = e.target.result;
                    img.classList.remove('hidden');
                    if (placeholderId) document.getElementById(placeholderId).classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        };

        document.getElementById('register-form').onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const fullName = document.getElementById('fullName').value;
            const nickname = document.getElementById('nickname').value;
            const city = document.getElementById('city').value;
            const birthDate = document.getElementById('birthDate').value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    fullName, nickname, city, birthDate, xp: 0, level: 1,
                    avatar: document.getElementById('avatar-preview').src,
                    banner: document.getElementById('banner-preview').src
                });

                localStorage.setItem('jobi_user', JSON.stringify({
                    firstName: fullName.split(' ')[0],
                    avatar: document.getElementById('avatar-preview').src,
                    age: calculateAge(birthDate)
                }));

                showModal("מעולה!", "נרשמת בהצלחה ל-Jobi", "success");
                setTimeout(() => window.location.href = '../app/profile.html', 1500);
            } catch (error) {
                showModal("אופס!", "ההרשמה נכשלה: " + error.message, "error");
            }
        };

        function calculateAge(date) {
            const diff = Date.now() - new Date(date).getTime();
            return Math.abs(new Date(diff).getUTCFullYear() - 1970);
        }

        window.showModal = (title, text, type) => {
            document.getElementById('alert-title').textContent = title;
            document.getElementById('alert-text').textContent = text;
            document.getElementById('alert-img').src = type === 'error' ? '../../img/error.png' : '../../img/logo.png';
            document.getElementById('custom-alert').classList.remove('hidden');
        };

        window.closeAlert = () => document.getElementById('custom-alert').classList.add('hidden');