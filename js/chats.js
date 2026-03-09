<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>Jobi — צ'אטים</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Heebo', sans-serif; background-color: #f0f0f0; }
        .list-card { background: white; border-right: 4px solid black; height: 100vh; }
        .chat-item { 
            border-bottom: 2px solid black; 
            transition: 0.2s; 
            cursor: pointer;
        }
        .chat-item:hover { background-color: #f9f9f9; }
        .chat-item.active { background-color: #FFD700; } /* Только активный чат подсвечен */
    </style>
</head>
<body class="flex overflow-hidden">

    <aside class="w-full md:w-[400px] list-card flex flex-col">
        <div class="p-4 border-b-4 border-black bg-white sticky top-0">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-2xl font-black italic">הודעות</h1>
                <a href="index.html" class="border-2 border-black p-1 rounded-lg">🏠</a>
            </div>
            <input type="text" id="user-search" placeholder="חפש חברים..." 
                   class="w-full p-3 border-4 border-black rounded-xl font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        </div>

        <div id="chats-list" class="flex-1 overflow-y-auto">
            <div class="chat-item p-4 flex items-center gap-4 active" onclick="loadMessenger('user123')">
                <img src="img/profile.png" class="w-14 h-14 rounded-2xl border-2 border-black object-cover">
                <div class="flex-1 overflow-hidden">
                    <div class="flex justify-between items-center">
                        <span class="font-black text-lg truncate">סוויטוסלב</span>
                        <span class="text-xs font-bold opacity-60">12:45</span>
                    </div>
                    <p class="text-sm font-bold text-gray-600 truncate italic">היי, ראית את המשרה החדשה?</p>
                </div>
            </div>
        </div>
    </aside>

    <main class="hidden md:block flex-1 bg-gray-200">
        <iframe id="messenger-frame" src="about:blank" class="w-full h-full border-none"></iframe>
    </main>

    <script>
        function loadMessenger(userId) {
            // Загружаем файл мессенджера в iframe
            const frame = document.getElementById('messenger-frame');
            frame.src = `messenger.html?id=${userId}`;
            
            // На мобилках можно сделать переход на отдельную страницу
            if(window.innerWidth < 768) {
                window.location.href = `messenger.html?id=${userId}`;
            }
        }
    </script>
</body>
</html>