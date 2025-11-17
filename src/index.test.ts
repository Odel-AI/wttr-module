import { describe, test, expect } from 'vitest';
import { testMCPCompliance, testTool, expectSuccess } from '@odel/module-sdk/testing';
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import worker from './index';

// Test MCP protocol compliance
testMCPCompliance(
  () => ({ worker, env, createExecutionContext, waitOnExecutionContext }),
  ['get_weather']
);

describe('Weather Module', () => {
  test('get_weather returns weather for a specific location', { timeout: 10000 }, async () => {
    const result = await testTool(worker, 'get_weather', {
      location: 'London',
      format: 'plain',
      units: 'metric'
    });

    expectSuccess(result);
    expect(result.weather).toBeTruthy();
    expect(result.weather).toContain('London');
    expect(result.url).toContain('wttr.in');
  });

  test('get_weather works with default parameters (current location)', { timeout: 10000 }, async () => {
    const result = await testTool(worker, 'get_weather', {});

    expectSuccess(result);
    expect(result.weather).toBeTruthy();
    expect(result.url).toBe('https://wttr.in?m=');
  });

  test('get_weather supports one-line format', { timeout: 10000 }, async () => {
    const result = await testTool(worker, 'get_weather', {
      location: 'Paris',
      format: 'one-line'
    });

    expectSuccess(result);
    expect(result.weather).toBeTruthy();
    // One-line format should be much shorter
    expect(result.weather.split('\n').length).toBeLessThan(10);
  });

  test('get_weather supports custom format', { timeout: 10000 }, async () => {
    const result = await testTool(worker, 'get_weather', {
      location: 'Tokyo',
      format: 'custom',
      format_string: '%l: %c %t'
    });

    expectSuccess(result);
    expect(result.weather).toBeTruthy();
    expect(result.weather).toContain('Tokyo');
  });

  test('get_weather supports different units', { timeout: 10000 }, async () => {
    const result = await testTool(worker, 'get_weather', {
      location: 'New York',
      format: 'plain',
      units: 'uscs'
    });

    expectSuccess(result);
    expect(result.weather).toBeTruthy();
    expect(result.url).toContain('?u=');
  });

  test('get_weather handles airport codes', { timeout: 10000 }, async () => {
    const result = await testTool(worker, 'get_weather', {
      location: 'JFK',
      format: 'plain'
    });

    expectSuccess(result);
    expect(result.weather).toBeTruthy();
  });
});
