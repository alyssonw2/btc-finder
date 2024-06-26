import CoinKey from 'coinkey';
import walletsArray from './wallets.js';
import chalk from 'chalk'

import fs from 'fs';
const walletsSet = new Set(walletsArray);
const startTime = Date.now()
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
let Velocidade = 0




async function encontrarBitcoins(key, min, max, shouldStop, peso) {

    //console.log([min, max])

    let segundos = 0;
    let pkey = 0;
    const um = BigInt(1);
    let zeroes = new Array(65).fill('');
    for (let i = 1; i < 64; i++) {
        zeroes[i] = '0'.repeat(64 - i);
    }

    //console.log('Buscando Bitcoins...')




    // Definindo os limites
    //const min = parseInt("0x20000000000000000", 16);
    //const max = parseInt("0xfffffffffffffffff", 16);
    //console.log(key)



    pkey = BigInt(key).toString(16)
    pkey = `${zeroes[pkey.length]}${pkey}`;

    if (isNaN(pkey)) {
        //  console.log('ERRO')
        return
    }

    //console.log(pkey)





    /*if (Date.now() - startTime > segundos) {
        segundos += 1000
        console.log(segundos / 1000);
        if (segundos % 10000 == 0) {
            const tempo = (Date.now() - startTime) / 1000;
            console.clear();
            console.log('Resumo: Peso = ' + peso)
            console.log('Velocidade:', Velocidade, ' chaves por segundo')
            console.log('Chaves buscadas: ', (BigInt(key) - BigInt(min)).toLocaleString('pt-BR'));
            console.log('Ultima chave tentada: ', pkey)
            const filePath = 'Ultima_chave.txt';  // File path to write to
            const content = `Ultima chave tentada: ${pkey}`
            Velocidade = 0
            try {
                fs.writeFileSync(filePath, content, 'utf8');
            } catch (err) {
                console.error('Error writing to file:', err);
            }
        }
    }*/

    let publicKey = await generatePublic(pkey)

    if (walletsSet.has(publicKey)) { //if (publicKey === "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so") {
        const tempo = (Date.now() - startTime) / 1000
        console.log('Velocidade:', (Number(key) - Number(min)) / tempo, ' chaves por segundo')
        console.log('Tempo:', tempo, ' segundos');
        console.log('Private key:', chalk.green(pkey))
        console.log('WIF:', chalk.green(await generateWIF(pkey)))

        const filePath = 'keys.txt';
        const lineToAppend = `Private key: ${pkey}, WIF: ${await generateWIF(pkey)}\n`;

        try {
            fs.appendFileSync(filePath, lineToAppend);
            console.log('Chave escrita no arquivo com sucesso.');
        } catch (err) {
            console.error('Erro ao escrever chave em arquivo:', err);
        }

        throw 'ACHEI!!!! 🎉🎉🎉🎉🎉'
    }


    await new Promise(resolve => setImmediate(resolve));


    return false
}

async function generatePublic(privateKey) {
    let _key = new CoinKey(new Buffer(privateKey, 'hex'))
    _key.compressed = true
    return _key.publicAddress
}

async function generateWIF(privateKey) {
    let _key = new CoinKey(new Buffer(privateKey, 'hex'))
    return _key.privateWif
}



export default encontrarBitcoins;