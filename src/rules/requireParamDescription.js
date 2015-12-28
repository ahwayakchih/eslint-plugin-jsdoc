import _ from 'lodash';
import jsdocUtils from './../jsdocUtils';
import iterateJsdoc from './../iterateJsdoc';

export default iterateJsdoc((functionNode, jsdocNode, jsdoc, report) => {
    let jsdocParameters;

    jsdocParameters = _.filter(jsdoc.tags, {
        tag: 'param'
    });

    _.forEach(jsdocParameters, (jsdocParameter) => {
        if (!jsdocParameter.description) {
            report('Missing JSDoc @param "' + jsdocParameter.name + '" description.');
        }
    });
});
