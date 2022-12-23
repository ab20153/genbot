module.exports = {

    rand(){
        return Math.random();
    },
    randNum(min,max){
        return Math.random() * (max-min) + min;
    },
    randInt(min,max){
        min = Math.ceil(min);
        max = Math.floor(max) + 1; // + 1 is making sure the max value is inclusive
        return Math.floor(Math.random() * (max-min) + min);
    }

};