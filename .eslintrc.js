module.exports = {
  extends: 'airbnb-typescript',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: './src',
    createDefaultProgram: true,
  },
};
