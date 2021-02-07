module.exports = {
  nycCoverage: false,
  coverage: false,
  auto_compose: true,
  node: '14',
  parallel: 1,
  test_framework: 'jest --config ../../jest.config.js --runTestsByPath',
  tests: '__tests__/**/*.spec.ts',
  services: [
    'rabbitmq',
  ],
  extras: {
    tester: {
      working_dir: '/src/packages/plugin-router',
      volumes: [
        '${PWD}/../../:/src:cached',
      ],
    },
  },
}
