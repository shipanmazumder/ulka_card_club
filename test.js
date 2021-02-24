const Player = require('./models/Player')

async function test(){
    try {
    let player=await Player.find();
    console.log(player)
    console.log("ss")
    } catch (error) {
        
    }
    
}
test();