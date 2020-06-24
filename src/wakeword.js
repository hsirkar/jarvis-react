const speechCommands = require('@tensorflow-models/speech-commands');

const wakeword = {
    init: async function() {
        this.recognizer = speechCommands.create(
            'BROWSER_FFT',
            undefined,
            'http://localhost:3006/model.json',
            'http://localhost:3006/metadata.json'
        );
    
        await this.recognizer.ensureModelLoaded();
    
        const labels = this.recognizer.wordLabels();
        console.log(labels);
    },
    listen: function(callback) {
        let { recognizer } = this;

        if(!recognizer) {
            console.error('No recognizer');
            return;
        }

        recognizer.listen(result => {
            const labels = recognizer.wordLabels();
            let scores = result.scores;
            let highScore = Math.max(...scores);
            let index = scores.indexOf(highScore);
            console.log(`${labels[index]} (${highScore})`)
            if (labels[index] === 'jarvis' && highScore >= 0.9) {
                callback(recognizer);
                recognizer.stopListening();
            }
        }, {
            includeSpectrogram: true,
            probabilityThreshold: 0.9
        });
    }
}

export default wakeword;