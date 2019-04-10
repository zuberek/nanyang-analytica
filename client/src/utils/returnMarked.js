export default function getMarkedTextObject(matchData, dataObject){
    const meta = matchData.metadata;
    var positions = {};

    for (const word in meta) {
        for (const type in meta[word]) {
            positions[type] = [];
            meta[word][type].position.forEach(p => {
                positions[type].push(p)
            })
        }
    }

    for (const type in positions) {
        var shift = 0;
        positions[type]
        .sort((a,b) => a[0]-b[0])
        .forEach(pos => {
            var text = dataObject[type];
            if(text){
                dataObject[type] = 
                    text.slice(0, pos[0]+shift) + "<mark>" + 
                    text.slice(pos[0]+shift, pos[0]+pos[1]+shift) + "</mark>" 
                    + text.slice(pos[0]+pos[1]+shift);
        
                shift = shift + 13;
            }
            })
        }
        
        return dataObject;
}