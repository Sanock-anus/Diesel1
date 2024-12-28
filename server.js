const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Для разрешения запросов с разных доменов

const app = express();
const port = 3000;

app.use(cors()); // разрешаем запросы с разных доменов
app.use(bodyParser.json()); // используем bodyParser

let games = []; // храним данные об играх в массиве (вместо БД)

// endpoint для загрузки игр
app.post('/upload', (req, res) => {
    const game = req.body;
    games.push(game);
    res.json({ message: 'Игра загружена успешно!' });
});

// endpoint для получения публичных игр
app.get('/games', (req, res) => {
  const publicGames = games.filter(game => !game.private);
  res.json(publicGames);
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
