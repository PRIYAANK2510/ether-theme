/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  ignoreFiles: ["site/**", "apps/website/public/**", "node_modules/**"],
  rules: {
    "at-rule-empty-line-before": null,
    "declaration-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "media-feature-range-notation": null,
    "color-function-notation": null,
    "color-function-alias-notation": null,
    "alpha-value-notation": null,
    "value-keyword-case": null,
    "property-no-vendor-prefix": null,
    "declaration-block-no-shorthand-property-overrides": null,
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "scss/at-mixin-pattern": null,
    "scss/dollar-variable-pattern": null,
    "no-descending-specificity": null,
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes"],
      },
    ],
  },
};
