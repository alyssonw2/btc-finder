// bitcoinSearchWorker.js
import CoinKey from 'coinkey';
import { parentPort } from 'worker_threads';

async function generatePublic(privateKey) {
    let _key = new CoinKey(Buffer.from(privateKey, 'hex'));
    _key.compressed = true;
    return _key.publicAddress;
}

async function generateWIF(privateKey) {
    let _key = new CoinKey(Buffer.from(privateKey, 'hex'));
    return _key.privateWif;
}

parentPort.on('message', async (msg) => {
    const { key, min, max, zeroes, walletsSet, startTime, peso } = msg;

    let segundos = 0;
    let currentKey = BigInt(key);
    let pkey = currentKey.toString(16);
    pkey = `${zeroes[pkey.length]}${pkey}`;

    const executeLoop = async () => {
        while (true) {
            currentKey += BigInt(peso || 1); // Incremento para próxima chave
            pkey = currentKey.toString(16);
            pkey = `${zeroes[pkey.length]}${pkey}`;

            if (BigInt(max) < currentKey) {
                parentPort.postMessage({ found: false });
                console.log('Erro peso ' + peso)
                break;
            }

            if (Date.now() - startTime > segundos) {
                segundos += 1000;
                if (segundos % 10000 == 0) {
                    const tempo = (Date.now() - startTime) / 1000;
                    parentPort.postMessage({
                        summary: true,
                        tempo,
                        pkey,
                        key: Number(currentKey) - Number(min),
                    });
                }
            }

            let publicKey = await generatePublic(pkey);
            if (walletsSet.has(publicKey)) {
                const tempo = (Date.now() - startTime) / 1000;
                parentPort.postMessage({
                    found: true,
                    tempo,
                    pkey,
                    wif: await generateWIF(pkey),
                });
                break;
            }
        }
    };

    executeLoop();
});
