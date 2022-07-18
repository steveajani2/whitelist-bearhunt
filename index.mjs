import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from '../build/index.main.mjs';
import assert from 'assert';
import { ask, yesno } from '@reach-sh/stdlib/ask.mjs';

const stdlib = loadStdlib();
const startingBalance = stdlib.parseCurrency(100);

const creator_name = await ask(`what's your name creator: `)
const num = await ask(`enter guess number for whitelist:`)
const player1_name = await ask(`what's your name player1: `)
const player2_name = await ask(`what's your name player2: `)


const acc_creator = await stdlib.newTestAccount(startingBalance);
const acc_player1 = await stdlib.newTestAccount(startingBalance);
const acc_player2 = await stdlib.newTestAccount(startingBalance);
const theNFT = await stdlib.launchToken(acc_creator, "chel", "CHE", { supply: 1 });
console.log(`The Nft info : ${theNFT}`)
const ctc_creator = acc_creator.contract(backend);

const ctc_player1 = acc_player1.contract(backend, ctc_creator.getInfo())
console.log(`Connecting players to contract......`)
const ctc_player2 = acc_player2.contract(backend, ctc_creator.getInfo())

const tokenbalance = async (acc, name) => {
    const amtNFT = await stdlib.balanceOf(acc, theNFT.id);
    console.log(`${name} has ${amtNFT} tokens`)
}

const creator_balance = await tokenbalance(acc_creator, creator_name)
const player1_balance = await tokenbalance(acc_player1, player1_name)
const player2_balance = await tokenbalance(acc_player2, player2_name)

const player1_address = await acc_player1.getAddress()
const player2_address = await acc_player2.getAddress()

const player1_before = await stdlib.balanceOf(acc_player1, theNFT.id);
const player2_before = await stdlib.balanceOf(acc_player2, theNFT.id);

const p1_guess = await ask(`Please enter your guess to get whitelisted, hint: the number range is 1-5`)
const p2_guess = await ask(`Please enter your guess to get whitelisted, hint: the number range is 1-5`)
await Promise.all([
    ctc_creator.p.Creator({
        get_num: parseInt(num),
        get_token: theNFT.id
    }),
    ctc_player1.p.player1({
        Accepttok: async (tok) => {
            acc_player1.tokenAccept(tok)
            console.log(`${player1_name} accepted the token `)
        },
        guess_num: parseInt(p1_guess)
    }),
    ctc_player2.p.player2({
        Accepttok: async (tok) => {
            acc_player2.tokenAccept(tok)
            console.log(`${player2_name} accepted the token `)
        },
        guess_num: parseInt(p2_guess)
    }),

]);

const player1_after = await stdlib.balanceOf(acc_player1, theNFT.id);
const player2_after = await stdlib.balanceOf(acc_player2, theNFT.id);

if (parseInt(player1_after) != parseInt(player1_before)) {
    console.log(`${player1_name} address ${player1_address} was whitelisted and recieved token `)
} else {
    console.log(`${player1_name} was whitelisted and didn't recieve token `)
}

if (parseInt(player2_after) != parseInt(player2_before)) {
    console.log(`${player2_name} address ${player2_address} was whitelisted and recieved token `)
} else {
    console.log(`${player2_name} was whitelisted and didn't recieve token `)
}
