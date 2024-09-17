module.exports = {
    clearMocks: true,
    collectCoverageFrom: ['<rootDir>/test/**/*.js'],
    roots: ['<rootDir>/test/'],
    setupFiles: ['jest-canvas-mock', '<rootDir>/test/cocos2d-js-for-preview.js'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: ['cocos2d-js-for-preview.js']
};
