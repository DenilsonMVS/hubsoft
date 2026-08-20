// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        rules: {
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "quotes": ["error", "double", { "avoidEscape": true }],
            "semi": ["error", "always"],

            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "selector": "default",
                    "format": ["camelCase"],
                    "leadingUnderscore": "allow"
                },
                {
                    "selector": "variable",
                    "modifiers": ["const"],
                    "format": ["camelCase", "UPPER_CASE"]
                },
                {
                    "selector": "typeLike",
                    "format": ["PascalCase"]
                },
                {
                    "selector": "enumMember",
                    "format": ["PascalCase", "UPPER_CASE"]
                },
                {
                    "selector": "property",
                    "modifiers": ["requiresQuotes"],
                    "format": null
                }
            ],

            "@angular-eslint/directive-selector": [
                "error",
                {
                    "type": "attribute",
                    "prefix": "app",
                    "style": "camelCase"
                }
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    "type": "element",
                    "prefix": "app",
                    "style": "kebab-case"
                }
            ]
        }
    },
    {
        files: ["**/*.html"],
        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility
        ],
        rules: {}
    }
]);