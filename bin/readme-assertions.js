/**
 * This script is used to inline assertions into the README.md documents.
 */
import _ from 'lodash';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

let getAssertions,
    updateDocuments,
    trimCode;

getAssertions = () => {
    let assertionFiles,
        assertionNames,
        assertionCodes;

    assertionFiles = glob.sync(path.resolve(__dirname, './../tests/rules/assertions/*.js'));

    assertionNames = _.map(assertionFiles, (filePath) => {
        return path.basename(filePath, '.js');
    });

    assertionCodes = _.map(assertionFiles, (filePath) => {
        let codes;

        codes = require(filePath).default;

        return {
            valid: _.map(_.map(codes.valid, 'code'), trimCode),
            invalid: _.map(_.map(codes.invalid, 'code'), trimCode)
        };
    });

    return _.zipObject(assertionNames, assertionCodes);
};

trimCode = (code) => {
    let lines,
        indentSize;

    lines = _.trim(code).split('\n');
    indentSize = lines[lines.length - 1].match(/^\s+/)[0].length;

    lines = _.map(lines, (line, i) => {
        if (i === 0) {
            return line;
        }

        return line.slice(indentSize);
    });

    return lines.join('\n');
};

updateDocuments = (assertions) => {
    let documentBody;

    documentBody = fs.readFileSync(path.join(__dirname, './../README.md'), 'utf8');

    documentBody = documentBody.replace(/<!-- assertions ([a-z]+?) -->/ig, (assertionsBlock) => {
        let assertionName,
            ruleAssertions;

        assertionName = assertionsBlock.match(/assertions ([a-z]+)/i)[1];

        ruleAssertions = assertions[assertionName];

        if (!ruleAssertions) {
            return assertionsBlock;
        }

        return 'The following patterns are considered problems:\n\n```js\n' + ruleAssertions.invalid.join('\n\n') + '\n```\n\nThe following patterns are not considered problems:\n\n```js\n' + ruleAssertions.valid.join('\n\n') + '\n```\n';
    });

    console.log('documentBody', documentBody);

    /*

    documents = glob.sync(path.resolve();

    _.forEach(documents, (filePath) => {
        let ruleAssertions,
            assertionText,
            ruleName,
            documentBody;

        ruleName = _.camelCase(path.basename(filePath, '.md'));
        documentBody = fs.readFileSync(filePath, 'utf8');


        assertionText = '<!-- assertions start --><!-- assertions end -->';

        ruleAssertions = assertions[ruleName];

        if (ruleAssertions) {
            assertionText = ;
        }

        documentBody = documentBody.replace(/<!-- assertions start -->([\s\S]*?)<!-- assertions end -->/, assertionText)

        fs.writeFileSync(filePath, documentBody)
    }); */
};

updateDocuments(getAssertions());
