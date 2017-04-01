"use strict";

/*
* So apparently there is this undocumented methods for working with streams on screen (stdout and in)
* It was documented previously, but has since moved to 'readline' docs, and it's gone...
* seems to be still working though...
* Here is how i found out:
*   http://stackoverflow.com/questions/11600890/how-to-erase-characters-printed-in-console
*
* Below i made some test and it seems to be working alright - i need to test it with more modern node versions too.
* */

function rewrite_output(content) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(content);
}

let counter = 0;

rewrite_output("Testing");

setInterval(() => {
    counter = ++counter % 4;
    let dots = '';
    for (let i = 0; i < counter; i++) {
        dots = dots + '.';
    }
    rewrite_output("Testing" + dots);
}, 1000);