module.exports = {

    // Helper function - shorthand for Math.random().
    rand(){
        return Math.random();
    },

    // Generate random number between min and max.
    randNum(min,max){
        return Math.random() * (max-min) + min;
    },

    // Generate random integer between min and max.
    randInt(min,max){
        min = Math.ceil(min);
        max = Math.floor(max) + 1; // + 1 is making sure the max value is inclusive
        return Math.floor(Math.random() * (max-min) + min);
    }

};