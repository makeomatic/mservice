module.exports = {
  nycCoverage: false,
  coverage: false,
  auto_compose: true,
  node: '12',
  parallel: 3,
  test_framework: 'jest --runInBand --watch --config ../../jest.config.js --runTestsByPath',
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