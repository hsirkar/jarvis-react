const badwords = ['fuck', 'fucking', 'motherfucker', 'shit', 'bitch', 'cunt', 'asshole', 'cock', 'faggot', 'nigger', 'nigga', 'pussy', 'blowjob', 'porn', 'whore'];

const uncensor = input => {
    let words = input.split(' ');

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if(word.includes('*')) {
            for(let badword of badwords) {
                if(word.length === badword.length && word.toLowerCase().charAt(0) === badword.charAt(0)) {
                    words[i] = badword;
                }
            }
        }
    }

    return words.join(' ');
}

module.exports = { uncensor };