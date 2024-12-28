document.addEventListener('DOMContentLoaded', function () {
    // Переключение вкладок
    const navLinks = document.querySelectorAll('nav a');
    const pageSections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('data-target');
            pageSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
        });
    });
     document.getElementById('store').classList.add('active');

    //Аккаунт
      let currentUsername = localStorage.getItem('dieselUsername') || null;
      const loginButton = document.getElementById('loginButton');
      const registerButton = document.getElementById('registerButton');
      const logoutButton = document.getElementById('logoutButton');
      const usernameDisplay = document.getElementById('usernameDisplay');
       const addGameButton = document.getElementById('addGameButton');
      updateAuthButtons();

   function updateAuthButtons(){
    if(currentUsername){
        usernameDisplay.textContent = currentUsername;
        loginButton.style.display = "none";
        registerButton.style.display = "none";
        logoutButton.style.display = "inline";
         addGameButton.style.display = 'inline'

      }
        else {
            usernameDisplay.textContent = "";
            loginButton.style.display = "inline";
             registerButton.style.display = "inline";
            logoutButton.style.display = "none";
            addGameButton.style.display = 'none';
        }
   }

     logoutButton.onclick = function(){
        currentUsername = null;
        localStorage.removeItem('dieselUsername');
        updateAuthButtons();
    }

      const loginModal = document.getElementById('loginModal');
      const closeLoginModal = loginModal.querySelector('.close');
      const loginForm = document.getElementById('loginForm');

      loginButton.onclick = function() {
        loginModal.style.display = "block";
      };
      closeLoginModal.onclick = function() {
        loginModal.style.display = "none";
      };

      loginForm.onsubmit = function(event){
        event.preventDefault();
         const loginEmail = document.getElementById('loginEmail').value;
        const loginPassword = document.getElementById('loginPassword').value;
          if (localStorage.getItem(`user_${loginEmail}`) && localStorage.getItem(`user_${loginEmail}`) === loginPassword){
            currentUsername = loginEmail
            localStorage.setItem('dieselUsername',currentUsername);
            updateAuthButtons();
             updateBalance()
             loginModal.style.display = "none";
          } else{
              alert('Неверный email или пароль')
          }
      }

       const registerModal = document.getElementById('registerModal');
       const closeRegisterModal = registerModal.querySelector('.close');
        const registerForm = document.getElementById('registerForm');
      registerButton.onclick = function() {
          registerModal.style.display = "block";
      };
        closeRegisterModal.onclick = function() {
          registerModal.style.display = "none";
      };

        registerForm.onsubmit = function(event){
            event.preventDefault();
           const registerEmail = document.getElementById('registerEmail').value;
            const registerPassword = document.getElementById('registerPassword').value;
            const registerPasswordConfirm = document.getElementById('registerPasswordConfirm').value;
            if(registerPassword === registerPasswordConfirm){
                localStorage.setItem(`user_${registerEmail}`, registerPassword);
                 currentUsername = registerEmail;
                localStorage.setItem('dieselUsername',currentUsername);
                updateAuthButtons();
                updateBalance()
               registerModal.style.display = "none";
            }
            else {
               alert('Пароли не совпадают')
            }
        }


    // Кошелёк
      let userBalance = parseFloat(localStorage.getItem('dieselBalance')) || 100;
    const userBalanceElement = document.getElementById('userBalance');
    updateBalance();

   function updateBalance(){
       userBalanceElement.textContent = userBalance.toFixed(2)
       localStorage.setItem('dieselBalance', userBalance)
   }

    // Добавление игры

   const addGameModal = document.getElementById('addGameModal');
   const closeAddGameModal = addGameModal.querySelector('.close');
   const addGameForm = document.getElementById('addGameForm');
   const gameList = document.getElementById('game-list');
    const libraryList = document.getElementById('library-list');
     let games = JSON.parse(localStorage.getItem('dieselGames')) || [];
     let library = JSON.parse(localStorage.getItem('dieselLibrary')) || [];


    updateGames();
    updateLibrary();


    addGameButton.onclick = function() {
      addGameModal.style.display = "block";
    }

    closeAddGameModal.onclick = function() {
      addGameModal.style.display = "none";
    }

     addGameForm.onsubmit = function(event) {
        event.preventDefault();
        const name = document.getElementById('gameName').value;
        const description = document.getElementById('gameDescription').value;
        const imageUrl = document.getElementById('gameImage').value;
         const gamePrice = parseFloat(document.getElementById('gamePrice').value);
        const gameFile = document.getElementById('gameFile').value;
        const gameId = Date.now();

           const newGame = {
                gameId: gameId,
                name: name,
               description: description,
                 imageUrl: imageUrl,
                 gameFile:gameFile,
                gamePrice: gamePrice,
             gameAuthor: currentUsername
            };
            games.push(newGame);
         localStorage.setItem('dieselGames', JSON.stringify(games));
           updateGames();

         const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
          gameCard.dataset.gameId = gameId;
        gameCard.dataset.gameFile = gameFile;
           gameCard.dataset.gamePrice = gamePrice;
            gameCard.dataset.gameAuthor = currentUsername;


         gameCard.innerHTML = `
              <img src="${imageUrl}" alt="${name}">
              <div class="card-content">
                 <h3>${name}</h3>
                 <p>${description}</p>
                  <button class="donate-button">Пожертвовать</button>
                   <button class="play-button">Играть</button>
                    ${currentUsername ? '<button class="delete-button">Удалить</button>' : ''}
            </div>
        `;

            gameCard.querySelector('.donate-button').addEventListener('click', function(){
                const donateModal = document.getElementById('donateModal');
                const confirmDonateButton = document.getElementById('confirmDonateButton')
                 const donateGameName = document.getElementById('donateGameName');
                 const donateGamePrice = document.getElementById('donateGamePrice')
                 donateGameName.textContent = name;
                 donateGamePrice.textContent = gamePrice;
                 donateModal.style.display = "block";
                confirmDonateButton.onclick = function(){
                  if(userBalance >= gamePrice){
                      donateModal.style.display = "none";
                      addToLibrary(gameId, name, description, imageUrl,gameFile);
                      userBalance -= gamePrice;
                        updateBalance()
                       } else{
                          alert('Недостаточно средств на счету');
                        }
                };
                  donateModal.querySelector('.close').addEventListener('click', function (){
                    donateModal.style.display = "none"
                  })
            });
           gameCard.querySelector('.play-button').addEventListener('click',function (){
             showGamePage(name,description,imageUrl,gameFile);
            })


            if (currentUsername) {
                gameCard.querySelector('.delete-button')?.addEventListener('click', function (){
                   deleteGame(gameId);
               });
           }


        gameList.appendChild(gameCard);
        addGameModal.style.display = 'none';
        addGameForm.reset();
      };




    window.onclick = function(event){
       if (event.target === addGameModal) {
          addGameModal.style.display = "none";
        }
         if (event.target === document.getElementById('donateModal')) {
            document.getElementById('donateModal').style.display = "none";
       }
        if (event.target === loginModal) {
            loginModal.style.display = "none";
      }
           if (event.target === registerModal) {
             registerModal.style.display = "none";
       }
    }


    function deleteGame(gameId) {
          games = games.filter(game => game.gameId !== gameId);
         localStorage.setItem('dieselGames', JSON.stringify(games));
           updateGames();
      }


     function addToLibrary(gameId, name, description, imageUrl,gameFile){
        library.push({gameId, name, description, imageUrl,gameFile});
        localStorage.setItem('dieselLibrary', JSON.stringify(library))
         updateLibrary();
      }


    function updateGames() {
        gameList.innerHTML = "";
         games.forEach(game => {
         const gameCard = document.createElement('div');
         gameCard.classList.add('game-card');
          gameCard.dataset.gameId = game.gameId;
          gameCard.dataset.gameFile = game.gameFile;
         gameCard.dataset.gamePrice = game.gamePrice;
           gameCard.dataset.gameAuthor = game.gameAuthor;


         gameCard.innerHTML = `
              <img src="${game.imageUrl}" alt="${game.name}">
              <div class="card-content">
                 <h3>${game.name}</h3>
                  <p>${game.description}</p>
                   <button class="donate-button">Пожертвовать</button>
                   <button class="play-button">Играть</button>
                     ${currentUsername === game.gameAuthor ? '<button class="delete-button">Удалить</button>' : ''}
            </div>
        `;

         gameCard.querySelector('.donate-button').addEventListener('click', function(){
            const donateModal = document.getElementById('donateModal');
            const confirmDonateButton = document.getElementById('confirmDonateButton')
             const donateGameName = document.getElementById('donateGameName');
             const donateGamePrice = document.getElementById('donateGamePrice')
              donateGameName.textContent = game.name;
             donateGamePrice.textContent = game.gamePrice;
             donateModal.style.display = "block";
           confirmDonateButton.onclick = function(){
               if(userBalance >= game.gamePrice){
                    donateModal.style.display = "none";
                    addToLibrary(game.gameId, game.name, game.description, game.imageUrl,game.gameFile);
                   userBalance -= game.gamePrice;
                     updateBalance()
                    } else{
                       alert('Недостаточно средств на счету');
                    }
           };
          donateModal.querySelector('.close').addEventListener('click', function (){
                 donateModal.style.display = "none"
           })
        });

          gameCard.querySelector('.play-button').addEventListener('click',function (){
             showGamePage(game.name, game.description,game.imageUrl,game.gameFile);
         })

           if (currentUsername === game.gameAuthor) {
                gameCard.querySelector('.delete-button')?.addEventListener('click', function (){
                      deleteGame(game.gameId);
                });
           }

          gameList.appendChild(gameCard);
        });
     }

    function showGamePage(name, description, imageUrl, gameFile) {
        const gameContent = document.getElementById('game-content');
        gameContent.innerHTML = `
            <h2>${name}</h2>
            <img src="${imageUrl}" alt="${name}" style="max-width: 300px; height:auto;">
            <p>${description}</p>
            <a href="${gameFile}">Скачать</a>
        `;
        document.getElementById('game').classList.add('active');
        pageSections.forEach(section => {
            if (section.id !== 'game') {
                section.classList.remove('active');
             }
          });
   }


     function updateLibrary(){
       libraryList.innerHTML = "";
         library.forEach(game=>{
            const gameCard = document.createElement('div');
           gameCard.classList.add('game-card');
           gameCard.dataset.gameId = game.gameId;
             gameCard.dataset.gameFile = game.gameFile;

           gameCard.innerHTML = `
               <img src="${game.imageUrl}" alt="${game.name}">
                 <div class="card-content">
                   <h3>${game.name}</h3>
                    <p>${game.description}</p>
                  <button class="play-button">Играть</button>
               </div>
           `;
           gameCard.querySelector('.play-button').addEventListener('click',function (){
                 showGamePage(game.name,game.description,game.imageUrl,game.gameFile);
        })

           libraryList.appendChild(gameCard)
        });
    }
});
