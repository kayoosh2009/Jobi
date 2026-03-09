        // Импортируем Firebase (убедись, что настройки те же)
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
        import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDA9KfdcE2acdeSgkfRVS_KiX1eBBrR1Ao",
            authDomain: "jobi-il.firebaseapp.com",
            projectId: "jobi-il",
            appId: "1:1049483275681:web:ef9bb3c9343aa0939d6fe0"
        };

        const app = initializeApp(firebaseConfig);
        const authInstance = getAuth(app);

        window.auth = async (providerName) => {
            let provider;
            if (providerName === 'google') provider = new GoogleAuthProvider();
            if (providerName === 'github') provider = new GithubAuthProvider();
            if (providerName === 'microsoft') provider = new OAuthProvider('microsoft.com');

            try {
                const result = await signInWithPopup(authInstance, provider);
                // Сохраняем данные в Local Storage для главной страницы
                localStorage.setItem('user_id', result.user.uid);
                localStorage.setItem('user_data', JSON.stringify({
                    name: result.user.displayName,
                    photo: result.user.photoURL
                }));
                window.location.href = '../index.html';
            } catch (error) {
                console.error("Ошибка входа:", error);
                alert("משהו השתבש... נסה שוב");
            }
        };