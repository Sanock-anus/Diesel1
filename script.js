document.addEventListener('DOMContentLoaded', function() {
    // Личный кабинет - имитация загрузки игры
    const uploadGameBtn = document.getElementById('uploadGameBtn');
    const uploadForm = document.getElementById('uploadForm');
    if (uploadGameBtn && uploadForm) {
        uploadGameBtn.addEventListener('click', function(){
            uploadForm.style.display = uploadForm.style.display === 'none' ? 'block' : 'none';
        });
    }
    // Личный кабинет - имитация отправки формы
    const uploadFormReal = document.getElementById('uploadFormReal');
    if (uploadFormReal) {
        uploadFormReal.addEventListener('submit', async function(event){
            event.preventDefault();
            const gameName = document.getElementById('gameName').value;
            const gameFile = document.getElementById('gameFile').files[0];
            const isPrivate = document.getElementById('isPrivate').checked;
            if (gameName && gameFile) {
                const user = JSON.parse(localStorage.getItem('user'));
                const game = { name: gameName, file: gameFile.name, uploader: user.username ? user.username : user.email, private: isPrivate };
                try {
                    const response = await fetch('http://localhost:3000/upload', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(game),
                    });
                    if (response.ok) {
                        alert(`Имитация загрузки игры "${gameName}"`);
                    } else {
                        alert('Ошибка загрузки игры');
                    }
                }
                catch (error){
                    console.error('Ошибка при загрузке игры:', error);
                    alert('Произошла ошибка!');
                }
            }
            else {
                alert("Пожалуйста, заполните все поля.");
            }
        });
    }
    // Личный кабинет - имитация кошелька
    const balance = document.getElementById('balance');
    const transactBtn = document.getElementById('getTransact');
    const transactionList = document.getElementById('transactionList');
    if (transactBtn) {
        transactBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const transactions = [
                { id:1, type: 'credit', amount: 5, date: '2024-05-28'},
                { id:2, type: 'debit', amount: -1, date: '2024-05-29'}
            ]
            transactionList.innerHTML = ""; // clear the table
            transactions.forEach(transaction => {
                const transactionItem = document.createElement('div');
                transactionItem.classList.add('transaction-item');
                transactionItem.innerHTML = `<p>ID: ${transaction.id} type:${transaction.type} amount: ${transaction.amount} date:${transaction.date}</p>`;
                transactionList.appendChild(transactionItem);
            });
        });
    }
    //  Имитация выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event){
            event.preventDefault();
            localStorage.removeItem('user');
            alert('Имитация выхода')
            window.location.href="/index.html"
        });
    }
    // Регистрация - Имитация отправки формы и входа
     const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
             event.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
             const password = document.getElementById('password').value;
            if (username && email && password) {
                alert(`Регистрация пользователя: ${username} ${email} прошла успешно`);
                // Сохраняем данные в localStorage
                 localStorage.setItem('user', JSON.stringify({ username, email, registrationDate: new Date().toISOString() }));
                window.location.href = 'dashboard.html'; // Перенаправляем в личный кабинет
            }
            else{
                alert("Пожалуйста, заполните все поля.");
            }
        });
    }
    // Логин - имитация входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
             event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if(email && password) {
                alert(`Имитация входа пользователя: ${email}`);
                // Сохраняем данные в localStorage (можно заменить на реальную аутентификацию)
                 localStorage.setItem('user', JSON.stringify({ email, registrationDate: new Date().toISOString() }));
                window.location.href = 'dashboard.html'; // Перенаправляем в личный кабинет
            }
            else {
                alert('Пожалуйста, введите email и пароль');
            }
        });
    }
    // Проверяем авторизацию при загрузке `account.html`
    if (window.location.pathname.includes('account.html')) {
        const user = localStorage.getItem('user');
        if (!user) {
            window.location.href = 'login.html';
        }
        else{
            const userData = JSON.parse(user);
            // Получаем данные пользователя из localStorage
            const usernameDisplay = document.getElementById('usernameDisplay');
            const profileIcon = document.getElementById('profile-icon');
            const daysRegisteredSpan = document.getElementById('days-registered');
            usernameDisplay.textContent = userData.username ? userData.username : userData.email
            // Загружаем иконку из localstorage, если есть
            const storedIcon = localStorage.getItem('profileIcon');
            if (storedIcon) {
                profileIcon.src = storedIcon
            }
            // Вычисляем дни с момента регистрации
            const registrationDate = new Date(userData.registrationDate);
            const today = new Date();
            const diffInTime = today.getTime() - registrationDate.getTime();
            const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
            daysRegisteredSpan.textContent = diffInDays;
        }
    }
    // Функция для отрисовки списка игр на index.html.
    async function displayGames(gameList) {
         gameList.innerHTML = '';
        try {
            const response = await fetch('http://localhost:3000/games');
            if (response.ok) {
                const games = await response.json();
                if (games.length === 0) {
                    gameList.innerHTML = '<p class="empty-list-message">Список игр пуст, загрузите игру!</p>';
                }
                 else {
                    const user = JSON.parse(localStorage.getItem('user'));
                    games.forEach((game, index) => {
                        const gameItem = document.createElement('div');
                        gameItem.classList.add('game-item');
                        const authorIcon = localStorage.getItem('profileIcon');
                        let deleteButton = '';
                        if (user && (game.uploader === user.username || game.uploader === user.email) ) {
                            deleteButton = `<button class="delete-game-btn button" data-index="${index}">Удалить</button>`;
                        }
                        const installButton = `<button class="install-game-btn button" data-name="${game.name}" data-file="${game.file}">Установить</button>`;
                        gameItem.innerHTML = `
                            <div class="game-header">
                                <img src="${authorIcon || 'default-icon.png'}" alt="Аватар" class="author-avatar">
                               <h3>${game.name}</h3>
                           </div>
                            <p>Загрузил: ${game.uploader}</p><p>File: ${game.file}</p>${deleteButton}${installButton}`;
                        gameList.appendChild(gameItem);
                    });
                }
            }
            else {
                alert('Ошибка при загрузке списка игр');
            }
        } catch (error) {
            console.error('Ошибка при загрузке списка игр:', error);
            alert('Произошла ошибка!');
        }
    }

    // Загрузка игр на index.html
    if (window.location.pathname.includes('index.html')) {
        const gameList = document.getElementById('gameList');
          // Загружаем игры только после полной загрузки DOM
        displayGames(gameList).then(() => {
         // Проверка на авторизованность и добавление кнопки "Мои карточки"
           const user = localStorage.getItem('user');
        const myGamesBtn = document.getElementById('myGamesBtn');
        if (user && myGamesBtn){
            myGamesBtn.style.display = 'block';
        }
        else if(myGamesBtn){
            myGamesBtn.style.display = 'none';
        }
    })

    }
    // Загрузка "Моих карточек"
  if (window.location.pathname.includes('my-games.html')) {
    const myGameList = document.getElementById('myGameList');
      async function displayMyGames() {
        myGameList.innerHTML = '';
         try {
             const response = await fetch('http://localhost:3000/games');
              if (response.ok) {
                const games = await response.json();
                  const user = JSON.parse(localStorage.getItem('user'));
                 const myGames = games.filter(game => game.uploader === user.username || game.uploader === user.email);

            if (myGames.length === 0) {
                myGameList.innerHTML = '<p class="empty-list-message">Вы еще не загрузили игры.</p>';
             }
              else{
                myGames.forEach((game, index) => {
                   const gameItem = document.createElement('div');
                   gameItem.classList.add('game-item');
                   const authorIcon = localStorage.getItem('profileIcon');
                    let deleteButton = '';
                    if (user && (game.uploader === user.username || game.uploader === user.email)) {
                        deleteButton = `<button class="delete-game-btn button" data-index="${index}">Удалить</button>`;
                     }
                     const installButton = `<button class="install-game-btn button" data-name="${game.name}" data-file="${game.file}">Установить</button>`;
                    gameItem.innerHTML = `
                       <div class="game-header">
                         <img src="${authorIcon || 'default-icon.png'}" alt="Аватар" class="author-avatar">
                         <h3>${game.name}</h3>
                     </div>
                     <p>Загрузил: ${game.uploader}</p><p>File: ${game.file}</p>${deleteButton}${installButton}`;
                    myGameList.appendChild(gameItem);
                });
             }
            } else {
              alert('Ошибка при загрузке списка игр');
            }
        } catch (error) {
            console.error('Ошибка при загрузке списка игр:', error);
            alert('Произошла ошибка!');
        }
   }
  displayMyGames();
        myGameList.addEventListener('click', function(event) {
            if (event.target.classList.contains('delete-game-btn')) {
                const index = event.target.getAttribute('data-index');
                deleteGame(index);
            }
             if(event.target.classList.contains('install-game-btn')){
                const name = event.target.getAttribute('data-name');
                const file = event.target.getAttribute('data-file');
                installGame(name, file);
            }
        });
    }
    // Функция удаления игры
  async function deleteGame(index) {
     try {
         const response = await fetch('http://localhost:3000/games');
          if (response.ok) {
             const games = await response.json();
                 const gameIndex =  parseInt(index, 10)
               const responseDelete =  await fetch('http://localhost:3000/deleteGame', {
                    method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({index: gameIndex}),
                });
               if (responseDelete.ok) {
                    const gameList = document.getElementById('gameList');
                     if (gameList) {
                         displayGames(gameList);
                    }
                    const myGameList = document.getElementById('myGameList');
                     if(myGameList){
                        displayMyGames();
                    }

               } else {
                  alert('Ошибка загрузки игры');
                }
           } else {
              alert('Ошибка при загрузке списка игр');
           }
     } catch (error) {
          console.error('Ошибка при загрузке списка игр:', error);
           alert('Произошла ошибка!');
    }
 }

    function installGame(name, file) {
        // Создаем имитацию файла для скачивания (на самом деле это фиктивный URL)
        const blob = new Blob(['This is a simulated game file!'], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = url;
        link.download = file;
        // Добавляем ссылку на страницу и кликаем на неё
        document.body.appendChild(link);
        link.click();
        // Удаляем ссылку со страницы
        document.body.removeChild(link);
        //  Освобождаем URL
        window.URL.revokeObjectURL(url);
    }
});
