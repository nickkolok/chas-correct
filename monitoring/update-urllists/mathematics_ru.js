var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
    flushEvery: 10000,
    name: 'mathematics_ru',
});


extractor.extractURLlistFromSiteRecursive({
    pause: 2000,
    root: 'https://mathematics.ru/',
    exclude: [
        '/esolver/', //страницы с решалкой(похоже что уже не функционирующей)
        '/images/', //ресурсы(изображения и т.д.)
        '/cert/', //неизвестные страницы, пустые, скорее всего ресурсы
        '/html/', //пустые страницы, скорее всего ресурсы
        '/grapher/', //ресурсы
    ]
});
