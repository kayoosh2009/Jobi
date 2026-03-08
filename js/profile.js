// Загрузка данных
        document.addEventListener('DOMContentLoaded', () => {
            const user = JSON.parse(localStorage.getItem('jobi_user'));
            if (!user) {
                window.location.href = '../account/login.html';
                return;
            }

            // Заполнение полей
            document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`;
            document.getElementById('user-age').textContent = `גיל: ${user.age || '--'}`;
            if(user.avatar) document.getElementById('user-avatar').src = user.avatar;

            // Логика XP
            const xp = parseInt(localStorage.getItem('jobi_xp')) || 0;
            const level = Math.floor(xp / 100) + 1;
            const currentXP = xp % 100;

            document.getElementById('level-tag').textContent = `LVL ${level}`;
            document.getElementById('xp-current').textContent = currentXP;
            document.getElementById('xp-fill').style.width = `${currentXP}%`;

            renderNav(user);
        });

        function toggleMenu(open) {
            document.getElementById('side-menu').classList.toggle('active', open);
            document.getElementById('overlay').style.display = open ? 'block' : 'none';
        }

        function renderNav(user) {
            const nav = document.getElementById('nav-content');
            nav.innerHTML = `
                <a href="../../index.html">🏠 דף הבית</a>
                <a href="my-jobs.html">💼 המשרות שלי</a>
                <a href="chat.html">💬 הודעות</a>
                <a href="settings.html">⚙️ הגדרות חשבון</a>
                <hr class="border-gray-100">
                <button onclick="logout()" class="text-red-500 text-right font-black">יציאה מהחשבון</button>
            `;
        }

        function logout() {
            localStorage.clear();
            window.location.href = '../account/login.html';
        }