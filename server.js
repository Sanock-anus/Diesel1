const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;
const gamesFile = 'games.json';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Функция для чтения игр из файла
const getGames = () => {
    try {
        const data = fs.readFileSync(gamesFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Если файл не существует или ошибка при чтении, возвращаем пустой массив
    }
};

// Функция для записи игр в файл
const saveGames = (games) => {
    fs.writeFileSync(gamesFile, JSON.stringify(games, null, 2));
};

// Получить все игры
app.get('/games', (req, res) => {
    const games = getGames();
    res.json(games);
});

// Добавить новую игру
app.post('/games', (req, res) => {
    const newGame = req.body;
    const games = getGames();
    newGame.gameId = Date.now();
    games.push(newGame);
    saveGames(games);
    res.json({ message: 'Игра добавлена', game: newGame });
});

// Удалить игру
app.delete('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    let games = getGames();
    games = games.filter(game => game.gameId !== gameId);
    saveGames(games);
     res.json({ message: 'Игра удалена',gameId:gameId });
})


app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
