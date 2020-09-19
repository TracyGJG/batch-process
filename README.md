# batch-process
Node.JS script for processing a set of file-system instructions
---
This utility processes a set of instructions, in the ``processInstructions.js`` file, for manipulating files on the local filesystem.
## Supported Instructions
* Copy - Duplicated a file or folder (with or without content) to a given location
* Delete - Removes a given file or folder (along with any content)
* Revise - Modify the given subject file using the set of Regular Expressions replacement commands
* Update - Modify the JSON object contained within the given file, using the list of functions supplied
* Make - Create an empty foler at the given location
* Touch - Create a new empty file with the given filename
* Execute - Perform the given system command

## Given Example
The edition of the ``processInstructions.js`` file contained in the project replaces the ``dest`` folder with the contant of the src folder and makes further changes. The instructions are as follows:
1. Delete the current ``dest`` folder, along with all its content
1. Duplicate the entire ``src`` folder in the new ``dest`` folder
1. Use a regular expression to change the content of the file.txt file, in the ``dest/fldr1`` directory, to change the text ``RegExp`` to ``string``
1. Use a series of functions to modify the JSON object contained in the ``dest/fldr2/file.json`` file, setting the value of the ``test`` property to uppercase 'update'.
1. Rename the ```dest/obsolete.txt``` file to ```redundant.txt``` using the given shell command.
1. Then delete the ```dest/redundant.txt``` file.
1. Create a new ```dest/fldr3``` directory.
1. Craete a new empty ```dest/fldr3/newFile.txt``` file.
1. Report an error for the uncognised ```UNKNOWN``` instruction.