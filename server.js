const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Подключаем статические файлы из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

