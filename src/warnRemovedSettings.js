/**
 * @typedef {(
 *   | "require-jsdoc"
 *   | "require-returns"
 *   | "valid-types"
 *   | "require-example"
 *   | "check-examples"
 * )} RulesWithMovedSettings
 */

/** @type {WeakMap<object, Set<string>>} */
const warnedSettings = new WeakMap();

/**
 * Warn only once for each context and setting
 *
 * @param {object} context
 * @param {string} setting
 */
const hasBeenWarned = (context, setting) => {
  return warnedSettings.has(context) && warnedSettings.get(context).has(setting);
};

const markSettingAsWarned = (context, setting) => {
  if (!warnedSettings.has(context)) {
    warnedSettings.set(context, new Set());
  }

  warnedSettings.get(context).add(setting);
};

/**
 * @param {object} obj
 * @param {string} property
 * @returns {boolean}
 */
const has = (obj, property) => {
  return Object.prototype.hasOwnProperty.call(obj, property);
};

/**
 *
 * @param {RulesWithMovedSettings} ruleName
 * @returns {string[]}
 */
const getMovedSettings = (ruleName) => {
  switch (ruleName) {
  case 'require-jsdoc':
    return ['exemptEmptyFunctions'];
  case 'require-returns':
    return ['forceRequireReturn'];
  case 'valid-types':
    return ['allowEmptyNamepaths', 'checkSeesForNamepaths'];
  case 'require-example':
    return ['avoidExampleOnConstructors'];
  case 'check-examples':
    return [
      'captionRequired',
      'exampleCodeRegex',
      'rejectExampleCodeRegex',
      'allowInlineConfig',
      'noDefaultExampleRules',
      'matchingFileName',
      'configFile',
      'eslintrcForExamples',
      'baseConfig',
      'reportUnusedDisableDirectives',
    ];
  }

  /* istanbul ignore next */
  return [];
};

/**
 * @param {object} context
 * @param {RulesWithMovedSettings} ruleName
 */
export default function warnRemovedSettings (context, ruleName) {
  const movedSettings = getMovedSettings(ruleName);

  if (!context.settings || !context.settings.jsdoc) {
    return;
  }

  for (const setting of movedSettings) {
    if (
      has(context.settings.jsdoc, setting) &&
      !hasBeenWarned(context, setting)
    ) {
      context.report({
        loc: {
          start: {
            column: 1,
            line: 1,
          },
        },
        message: `\`settings.jsdoc.${setting}\` has been removed, ` +
          `use options in the rule \`${ruleName}\` instead.`,
      });
      markSettingAsWarned(context, setting);
    }
  }
}
