module.exports = [    // (the new) CRUD operations + exec, make (folder) and touch (file).
    {
        "delete": 'dest'
    },
    {
        "copy": {
            "from": './src',
            "to": './dest',
            "depth": 'all'
        }
    },
    {
        "revise": { // regexp
            "subject": 'dest/fldr1/file.txt',
            "revisions": [
                { pattern: /regexp/i, replacement: 'string'}
            ]
        }
    },
    {
        "update": { // json
            "subject": 'dest/fldr2/file.json',
            "functions": [
                function updateJson(sourceObject) {
                    const destObject = {...sourceObject};
                    destObject.test = 'updated';
                    return destObject;
                },
                function toUpperCase(sourceObject) {
                    const destObject = {...sourceObject};
                    destObject.test = destObject.test.toUpperCase();
                    return destObject;
                }
            ]
        }
    },
    {
        "execute": 'ren .\\dest\\obsolete.txt redundant.txt'
    },
    {
        "delete": 'dest/redundant.txt'
    },
    {
        "make": ['dest/fldr3']
    },
    {
        "touch": [
            { "target": 'dest/fldr3', filename: 'newFile.txt' }
        ]
    },
    {
        "UNKNOWN": ""
    }
];
