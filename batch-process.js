var instructions = require('./processInstructions.js');
var { execSync } = require('child_process');
var fs = require('fs');
var path = require('path');

var commands = {
    copy: copyCommand,
    revise: reviseCommand,
    update: updateCommand,
    delete: deleteCommand,
    execute: executeCommand,
    make: makeCommand,
    touch: touchCommand
};

function copyCommand({ from, to, depth}) {
    var src = path.join(__dirname, ...from.split('/'));
    var dst = path.join(__dirname, ...to.split('/'));
    fs.mkdirSync(dst);
    duplicateFiles(src, dst, depth.toLowerCase());
}

function reviseCommand({subject, revisions}) {
    var subjFilename = path.join(__dirname, ...subject.split('/'));
    var fileContent = fs.readFileSync(subjFilename, 'utf8');
	fs.writeFileSync(subjFilename,
        revisions.reduce((textCont, rev) => textCont.replace(rev.pattern, rev.replacement), fileContent), 'utf8');
}

function updateCommand({subject, functions}) {
    var subjFilename = path.join(__dirname, ...subject.split('/'));
    var fileContent = fs.readFileSync(subjFilename, 'utf8');
    try {
        var objContent = JSON.parse(fileContent);
        fs.writeFileSync(subjFilename, JSON.stringify(
            functions.reduce((objCont, fn) => fn(objCont), objContent), null, '\t'), 'utf8');
    }
    catch(err) {
        console.error(`Error: Unable to JSON parse the ${subject} file content.`);
    }
}

function deleteCommand(filename) {
    var fileSource = path.join(__dirname, ...filename.split('/'));
    try {
        var fileStat = fs.statSync(fileSource);
    }
    catch (err) {
        console.error(`Error: Unable to locate file|folder ${fileSource}`);
    }
    finally {
        if (fileStat) {
            if (fileStat.isFile()) {
                try {
                    fs.unlinkSync(fileSource);
                }
                catch(err) {
                    console.warn(`Failed to remove file '${fileSource}'`);
                }
            }
            if (fileStat.isDirectory()) {
                try {
                    fs.rmdirSync(fileSource, {recursive: true});
                }
                catch(err) {
                    console.warn(`Failed to remove folder '${fileSource}'`);
                }
            }
        }
    }
}

function executeCommand(command) {
    try {
        execSync(command);
    }
    catch(err) {
        console.error(`Error: Unable to execute the command '${command}'.`);
	}
}

function makeCommand(folders) {
    folders.forEach( folder => {
        var tgt = path.join(__dirname, ...folder.split('/'));
        fs.mkdirSync(tgt);
    });
}

function touchCommand(files) {
    files.forEach( file => {
        var tgt = path.join(__dirname, ...file.target.split('/'), file.filename);
        fs.writeFileSync(tgt, '', 'utf8');
    });
}

function duplicateFiles(srcFolder, tgtFolder, depth) {
    if (!/(files|all)/.test(depth)) return;

	var dir = fs.readdirSync(srcFolder, { withFileTypes: true });
	dir.forEach(file => {
		var fileSource = path.join(srcFolder, file.name);
		var fileStat = fs.statSync(fileSource);
		if (fileStat) {
            var fileTarget = path.join(tgtFolder, file.name);
            if (fileStat.isFile()) {
                fs.copyFileSync(fileSource, fileTarget);
            }
            if (fileStat.isDirectory() && (depth == 'all')) {
                fs.mkdirSync(path.join(tgtFolder, file.name));
                duplicateFiles(fileSource, fileTarget, depth);
            }
        }
    });
}

(function process() {
    if (!instructions || !Array.isArray(instructions)) {
        console.error(`Error: The provided set of 'instructions' is not an array.`);
        return;
    }
    instructions.forEach((inst, line) => {
        var command = Object.keys(inst);
        if (!command.length || !commands.hasOwnProperty(command[0])) {
            console.error(`Error: Unrecognised instruction '${command[0]}' at line ${line + 1}.`);
            return;
        }
        else {
            commands[command](inst[command]);
        }
    });
})();
