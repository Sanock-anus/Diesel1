const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Путь к файлу, где будут храниться данные об играх
const gamesFilePath = path.join(__dirname, 'games.json');

// Функция для загрузки игр из файла
function loadGames() {
  try {
    const data = fs.readFileSync(gamesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Если файла нет или произошла ошибка при чтении, возвращаем пустой массив
    return [];
  }
}

// Функция для сохранения игр в файл
function saveGames(games) {
    fs.writeFileSync(gamesFilePath, JSON.stringify(games, null, 2));
}

// Endpoint для загрузки игр
app.post('/upload', (req, res) => {
    const game = req.body;
    const games = loadGames();
    games.push(game);
    saveGames(games);
    res.json({ message: 'Игра загружена успешно!' });
});


// Endpoint для получения публичных игр
app.get('/games', (req, res) => {
    const games = loadGames();
    const publicGames = games.filter(game => !game.private);
    res.json(publicGames);
});

// Endpoint для удаления игры (новое)
app.post('/deleteGame', (req, res) => {
    const gameIndex = req.body.index;
      let games = loadGames();
        if (gameIndex >= 0 && gameIndex < games.length) {
            games.splice(gameIndex, 1);
              saveGames(games);
              res.json({ message: 'Игра удалена успешно!' });
         } else {
        res.status(400).json({ message: 'Неверный индекс игры' });
    }
});


app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
