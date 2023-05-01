const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = `6177339384:AAF14pFKroi7NYuhlbkamMKrgnURFIwBtFM`;

const bot = new TelegramApi(token, {polling: true});


const startGame = async(chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю чилсло от 0 до 9.`);
    const secretNumber = Math.floor(Math.random() * 10);
    storage[chatId] = secretNumber;

    return await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
}

const storage = {};

(() => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if( text === '/start' ) {
            return await bot.sendMessage(chatId, `Здравствуй`);
        }

        if( text === '/game' ) {
            return startGame(chatId);
        }

        if( text === '/info' ) {
            return await bot.sendMessage(chatId, `Твое имя - ${msg.from.first_name}`);
        }

        return await bot.sendMessage(chatId, `Я не понимаю тебя`);
    });

    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id;
        const data = msg.data;
        
        if(data == '/again') {
            return startGame(chatId);
        }

        if(data == storage[chatId]) {
          return await bot.sendMessage(chatId, `Ты угадал число - ${data}`, againOptions);
        } 

        return await bot.sendMessage(chatId, `Ты не угадал. Число - ${data}`, againOptions);
    });

})();