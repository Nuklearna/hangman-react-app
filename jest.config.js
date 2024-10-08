module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',  // Use Babel to transform JS/JSX files
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)"  // Transform axios module using Babel
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',  // Mock image files
    '\\.(css|scss)$': 'identity-obj-proxy',  // Mock CSS/SCSS imports
  },
};
