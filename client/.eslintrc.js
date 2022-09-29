module.exports = {
  extends: ['@satel/ts-react'],
  rules: {
    'multiline-ternary': 0,
    'react/state-in-constructor': 0,
    'react/require-default-props': 0,
    // Enable one day
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    // Seems bugged for types
    '@typescript-eslint/no-unused-vars': 0,
    // New JSX
    'react/react-in-jsx-scope': 0,
  },
};
