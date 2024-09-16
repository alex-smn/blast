module.exports = [
    {
        rules: {
            "semi": "error",
            "prefer-const": "error",
            "padding-line-between-statements": ["error",
                { "blankLine": "always", "prev": "*", "next": ["return", "block-like"] },
                { "blankLine": "always", "prev": "block-like", "next": "*" }
            ],
            
        },
        "languageOptions": {
            "ecmaVersion": "latest"
        } 
    }
];
