import ranges from './ranges.js'
import encontrarBitcoins from './bitcoin-find.js'
import readline from 'readline'
import chalk from 'chalk'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let shouldStop = false;



let key = 0;
let min, max = 0;

console.clear();




console.log("\x1b[38;2;250;128;114m" + "╔════════════════════════════════════════════════════════╗\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "   ____ _____ ____   _____ ___ _   _ ____  _____ ____   " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "  | __ )_   _/ ___| |  ___|_ _| \\ | |  _ \\| ____|  _ \\  " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "  |  _ \\ | || |     | |_   | ||  \\| | | | |  _| | |_) | " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "  | |_) || || |___  |  _|  | || |\\  | |_| | |___|  _ <  " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "  |____/ |_| \\____| |_|   |___|_| \\_|____/|_____|_| \\_\\ " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "                                                        " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "╚══════════════════════\x1b[32m" + "Investidor Internacional - v0.4" + "\x1b[0m\x1b[38;2;250;128;114m═══╝" + "\x1b[0m");

rl.question(`Escolha uma carteira puzzle( ${chalk.cyan(1)} - ${chalk.cyan(160)}): `, (answer) => {

    if (parseInt(answer) < 1 || parseInt(answer) > 160) {
        console.log(chalk.bgRed('Erro: voce precisa escolher um numero entre 1 e 160'))
    }

    min = ranges[answer - 1].min
    max = ranges[answer - 1].max
    console.log('Carteira escolhida: ', chalk.cyan(answer), ' Min: ', chalk.yellow(min), ' Max: ', chalk.yellow(max))
    console.log('Numero possivel de chaves:', chalk.yellow(parseInt(BigInt(max) - BigInt(min)).toLocaleString('pt-BR')))
    key = BigInt(min)

    start(min, max)
    rl.close();

});

async function generateRandomInteger(minHex, maxHex) {
    // Converter os valores hexadecimais para inteiros
    const min = parseInt(minHex, 16);
    const max = parseInt(maxHex, 16);

    // Garantir que min seja menor que max
    if (min > max) {
        throw new Error("O valor mínimo deve ser menor que o valor máximo.");
    }

    // Gerar um número inteiro aleatório no intervalo [min, max]
    const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomInt;
}

let h = []

function displayMemoryUsage() {
    const memoryUsage = process.memoryUsage();

    console.log('Memory Usage:');
    console.log(`RSS: ${formatMemory(memoryUsage.rss)}`);
    console.log(`Heap Total: ${formatMemory(memoryUsage.heapTotal)}`);
    console.log(`Heap Used: ${formatMemory(memoryUsage.heapUsed)}`);
    console.log(`External: ${formatMemory(memoryUsage.external)}`);
    console.log(`Array Buffers: ${formatMemory(memoryUsage.arrayBuffers)}`);
}

function formatMemory(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// Exemplo de uso:



const start = async (min, max) => {

    setInterval(() => {
        console.clear()
        console.log(h.length)
        displayMemoryUsage();

    }, 1000);

    while (true) {


        let numero = await generateRandomInteger(min, max)

        numero = BigInt(numero)
        if (!h.includes(numero)) {
            h.push(numero)
            //console.log(numero)


            await new Promise(async (resolve, reject) => {
                //console.clear()
                await encontrarBitcoins(numero, min, max, () => shouldStop, numero)
                    .then(() => {
                        //console.log(`encontrarBitcoins com peso ${numero} concluído.`);
                        resolve(); // Resolve a Promise após o retorno de encontrarBitcoins
                    })
                    .catch((error) => {
                        reject(error); // Rejeita a Promise em caso de erro
                    });

            });
            // Após o retorno de encontrarBitcoins e resolução da Promise, o loop avança para a próxima iteração.
        }

    }




    console.log("Todas as iterações concluídas.");
}




/*

console.log("\x1b[38;2;250;128;114m" + "╔════════════════════════════════════════════════════════╗\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "   ____ _____ ____   _____ ___ _   _ ____  _____ ____   " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "  | __ )_   _/ ___| |  ___|_ _| \\ | |  _ \\| ____|  _ \\  " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "  |  _ \\ | || |     | |_   | ||  \\| | | | |  _| | |_) | " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "  | |_) || || |___  |  _|  | || |\\  | |_| | |___|  _ <  " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "  |____/ |_| \\____| |_|   |___|_| \\_|____/|_____|_| \\_\\ " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "║" + "\x1b[0m" + "\x1b[36m" + "                                                        " + "\x1b[0m" + "\x1b[38;2;250;128;114m" + "║\n" +
    "╚══════════════════════\x1b[32m" + "Investidor Internacional - v0.4" + "\x1b[0m\x1b[38;2;250;128;114m═══╝" + "\x1b[0m");

rl.question(`Escolha uma carteira puzzle( ${chalk.cyan(1)} - ${chalk.cyan(160)}): `, (answer) => {

    if (parseInt(answer) < 1 || parseInt(answer) > 160) {
        console.log(chalk.bgRed('Erro: voce precisa escolher um numero entre 1 e 160'))
    }

    min = ranges[answer - 1].min
    max = ranges[answer - 1].max
    console.log('Carteira escolhida: ', chalk.cyan(answer), ' Min: ', chalk.yellow(min), ' Max: ', chalk.yellow(max))
    console.log('Numero possivel de chaves:', chalk.yellow(parseInt(BigInt(max) - BigInt(min)).toLocaleString('pt-BR')))
    key = BigInt(min)

    rl.question(`Escolha uma opcao (${chalk.cyan(1)} - Comecar do inicio, ${chalk.cyan(2)} - Escolher uma porcentagem, ${chalk.cyan(3)} - Escolher minimo): `, (answer2) => {
        if (answer2 == '2') {
            rl.question('Escolha um numero entre 0 e 1: ', (answer3) => {
                if (parseFloat(answer3) > 1 || parseFloat(answer3) < 0) {
                    console.log(chalk.bgRed('Erro: voce precisa escolher um numero entre 0 e 1'))
                    throw 'Numero invalido'
                }


                const range = BigInt(max) - BigInt(min);
                const percentualRange = range * BigInt(Math.floor(parseFloat(answer3) * 1e18)) / BigInt(1e18);
                min = BigInt(min) + BigInt(percentualRange);
                console.log('Comecando em: ', chalk.yellow('0x' + min.toString(16)));
                key = BigInt(min)
                encontrarBitcoins(key, min, max, () => shouldStop)
                rl.close();
            });
        } else if (answer2 == '3') {
            rl.question('Entre o minimo: ', (answer3) => {
                min = BigInt(answer3)
                key = BigInt(min)
                encontrarBitcoins(key, min, max, () => shouldStop)

                rl.close();
            });
        } else {
            min = BigInt(min)


            rl.question('Entre com o agregador : ', (answer4) => {
                let agregador = BigInt(answer4)

                encontrarBitcoins(key, min, max, () => shouldStop, agregador)
                rl.close();
            });

        }
    })
});

*/

rl.on('SIGINT', () => {
    shouldStop = true;
    rl.close();
    process.exit();
});

process.on('SIGINT', () => {
    shouldStop = true;
    rl.close();
    process.exit();
});


