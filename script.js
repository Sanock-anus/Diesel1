document.addEventListener('DOMContentLoaded', function() {
  // ... (остальной код) ...

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

    // ... (остальной код) ...

     // Функция для отрисовки списка игр на index.html.
    async function displayGames(gameList) {
        gameList.innerHTML = '';
      try {
            const response = await fetch('http://localhost:3000/games');
           if (response.ok) {
                const games = await response.json();
                if (games.length === 0) {
                    gameList.innerHTML = '<p class="empty-list-message">Список игр пуст, загрузите игру!</p>';
                } else {
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
        displayGames(gameList);
          // Проверка на авторизованность и добавление кнопки "Мои карточки"
      const user = localStorage.getItem('user');
          const myGamesBtn = document.getElementById('myGamesBtn');
          if (user && myGamesBtn){
              myGamesBtn.style.display = 'block';
           }
           else if(myGamesBtn){
             myGamesBtn.style.display = 'none';
           }
     }


  // ... (остальной код) ...

    function deleteGame(index) {
        // ... (код удаления из localStorage) ...
    }
});
