import assert from 'assert';
import { checkIntrinsicDependencies } from './lib.js';

const mockLogger = () => ({
  info: () => {},
  error: () => {},
});

function describe(description, callback) {
  console.log(description);
  callback();
}

function it(description, testFunction) {
  try {
    testFunction();
    console.log(`✓ ${description}`);
  } catch (error) {
    console.error(`✕ ${description}`);
    console.error(error);
  }
}

describe('checkIntrinsicDependencies', () => {
  it('should pass when all intrinsic dependencies are met', () => {
    const result = checkIntrinsicDependencies({
      filePath: 'fixtures/fixture.pass.package.json',
      log: mockLogger(),
    });
    assert.deepStrictEqual(result, {
      hasExpectedDeps: true,
      missingDeps: []
    });
  });

  it('should fail when intrinsic dependencies are missing', () => {
    const result = checkIntrinsicDependencies({
      filePath: 'fixtures/fixture.fail.package.json',
      log: mockLogger(),
    });

    assert.deepStrictEqual(result, {
      hasExpectedDeps: false,
      missingDeps: ['express']
    });
  });

  it('should pass when all intrinsic dependencies are met with a config file', () => {
    const result = checkIntrinsicDependencies({
      filePath: 'fixtures/fixture.pass.package.json',
      configPath: 'fixtures/fixture.pass.intrinsicDependencies.json',
      log: mockLogger(),
    });
    assert.deepStrictEqual(result, {
      hasExpectedDeps: true,
      missingDeps: []
    });
  });

  it('should fail when intrinsic dependencies are missing with a config file', () => {
    const result = checkIntrinsicDependencies({
      filePath: 'fixtures/fixture.pass.package.json',
      configPath: 'fixtures/fixture.fail.intrinsicDependencies.json',
      log: mockLogger(),
    });

    assert.deepStrictEqual(result, {
      hasExpectedDeps: false,
      missingDeps: ['ts-node']
    });
  });
});
