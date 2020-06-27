const badwords = ['fuck', 'shit', 'bitch', 'cunt', 'asshole', 'cock', 'faggot', 'nigger', 'nigga', 'pussy', 'blowjob', 'porn', 'whore'];

const uncensor = input => {
    let words = input.toLowerCase().split(' ');

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if(word.includes('*')) {
            for(let badword of badwords) {
                if(word.length === badword.length && word.charAt(0) === badword.charAt(0)) {
                    words[i] = badword;
                }
            }
        }
    }

    return words.join(' ');
}

module.exports = { uncensor };