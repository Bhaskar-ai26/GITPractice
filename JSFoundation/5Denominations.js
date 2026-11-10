"use strict"
let amount = 1234;
let denominations = [500, 100, 50, 20, 10, 5, 1];
for(let i = 0; i < denominations.length; i++){
    let count = Math.floor(amount / denominations[i]);
    if(count > 0){
        console.log(denominations[i] + " : " + count);
    }
    amount %= denominations[i];
}