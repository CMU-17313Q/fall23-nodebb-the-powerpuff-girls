
(function () {
    CodeMirror.xmlHints = [];

    CodeMirror.xmlHint = function (cm, simbol) {
        if (simbol.length > 0) {
            let cursor = cm.getCursor();
            cm.replaceSelection(simbol);
            cursor = { line: cursor.line, ch: cursor.ch + 1 };
            cm.setCursor(cursor);
        }

        CodeMirror.simpleHint(cm, getHint);
    };

    var getHint = function (cm) {
        const cursor = cm.getCursor();

        if (cursor.ch > 0) {
            let text = cm.getRange({ line: 0, ch: 0 }, cursor);
            let typed = '';
            let simbol = '';
            for (var i = text.length - 1; i >= 0; i--) {
                if (text[i] == ' ' || text[i] == '<') {
                    simbol = text[i];
                    break;
                } else {
                    typed = text[i] + typed;
                }
            }

            text = text.slice(0, text.length - typed.length);

            const path = getActiveElement(text) + simbol;
            let hints = CodeMirror.xmlHints[path];

            if (typeof hints === 'undefined') hints = [''];
            else {
                hints = hints.slice(0);
                for (var i = hints.length - 1; i >= 0; i--) {
                    if (hints[i].indexOf(typed) != 0) hints.splice(i, 1);
                }
            }

            return {
                list: hints,
                from: { line: cursor.line, ch: cursor.ch - typed.length },
                to: cursor,
            };
        }
    };

    var getActiveElement = function (text) {
        let element = '';

        if (text.length >= 0) {
            const regex = new RegExp('<([^!?][^\\s/>]*).*?>', 'g');

            const matches = [];
            let match;
            while ((match = regex.exec(text)) != null) {
                matches.push({
                    tag: match[1],
                    selfclose: (match[0].slice(match[0].length - 2) === '/>'),
                });
            }

            for (let i = matches.length - 1, skip = 0; i >= 0; i--) {
                const item = matches[i];

                if (item.tag[0] == '/') {
                    skip++;
                } else if (item.selfclose == false) {
                    if (skip > 0) {
                        skip--;
                    } else {
                        element = `<${item.tag}>${element}`;
                    }
                }
            }

            element += getOpenTag(text);
        }

        return element;
    };

    var getOpenTag = function (text) {
        const open = text.lastIndexOf('<');
        const close = text.lastIndexOf('>');

        if (close < open) {
            text = text.slice(open);

            if (text != '<') {
                let space = text.indexOf(' ');
                if (space < 0) space = text.indexOf('\t');
                if (space < 0) space = text.indexOf('\n');

                if (space < 0) space = text.length;

                return text.slice(0, space);
            }
        }

        return '';
    };
}());
