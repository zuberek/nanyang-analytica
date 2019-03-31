/* eslint no-console: 0 */ 
function predictGender(data, tf){
    return new Promise(function (resolve, reject) {
        tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/codes/models/gender3/model.json")
            .then(model => {
                console.log('loaded!'); 
                var allPredictions = []   
                for (const user in data) {
                    console.log('predicting ' + user);
                    const prediction = model.predict(data[user]);
                    // console.log(await prediction.array());
                
                    prediction.array()
                        .then(result => {
                            const predictions =  result.map(array => array[0]);
                            var sum = 0;
                            predictions.forEach(p => sum = sum+p);
                            allPredictions.push({
                                user,
                                average: sum/predictions.length,
                                gender: (sum/predictions.length<0.5) ? 'male' : 'female',
                                predictions
                            });
                            // console.log(allPredictions);
                            resolve(allPredictions)
                        })
                        .catch(err => {
                            console.log('Failed exporting the predictions to an array');
                            reject(err);
                        })
                }
                        })
            .catch(err => {
                console.log('Failed loading the model');
                reject(err);
            })
    })
}


    // SUCCESSS
    // const model = await tf.loadLayersModel("https://storage.googleapis.com/tfjs-examples/mnist-acgan/dist/generator/model.json")
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/simple/model.json")
    
    
    // FAIL
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/gender2/model.json")
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/master/client/backend/ai/models/gender_classification/model.json")
    // const model = await tf.loadLayersModel("https://raw.githubusercontent.com/zuberek/nanyang-analytica/gh-pages/serve/gender_classification/model.json")

    // console.log(prediction);

export { predictGender };