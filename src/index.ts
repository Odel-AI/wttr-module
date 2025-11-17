import { createModule, SuccessResponseSchema } from '@odel/module-sdk';
import { z } from 'zod';

export default createModule()
  .tool({
    name: 'get_weather',
    description: 'Get weather forecast for a location using wttr.in. Returns ASCII art weather display with detailed forecast information.',
    inputSchema: z.object({
      location: z.string().describe('Location to get weather for (city name, airport code, or coordinates). Leave empty for current location based on IP.').optional(),
      format: z.enum(['default', 'plain', 'one-line', 'custom']).describe('Output format: default (colored ASCII), plain (no colors), one-line (compact), custom (use format_string)').default('default'),
      format_string: z.string().describe('Custom format string when format=custom. Use tokens like %l (location), %c (condition), %t (temp), %h (humidity), %w (wind). Example: "%l: %c %t"').optional(),
      units: z.enum(['metric', 'uscs', 'metric-ms']).describe('Temperature units: metric (Celsius), uscs (Fahrenheit), metric-ms (Celsius with m/s wind)').default('metric'),
      lang: z.string().describe('Language code for the forecast (e.g., en, de, fr, es, ru)').optional()
    }),
    outputSchema: SuccessResponseSchema(
      z.object({
        weather: z.string().describe('Weather forecast data (ASCII art or formatted text)'),
        url: z.string().describe('Direct URL to view the forecast')
      })
    ),
    handler: async (input, _context) => {
      try {
        // Build the URL
        let url = 'https://wttr.in';

        // Add location if provided
        if (input.location) {
          url += `/${encodeURIComponent(input.location)}`;
        }

        // Build query parameters
        const params = new URLSearchParams();

        // Add units
        if (input.units === 'uscs') {
          params.append('u', '');
        } else if (input.units === 'metric-ms') {
          params.append('M', '');
        } else {
          params.append('m', '');
        }

        // Add format
        if (input.format === 'plain') {
          params.append('T', ''); // Remove colors
        } else if (input.format === 'one-line') {
          params.append('format', '3'); // One-line format
        } else if (input.format === 'custom' && input.format_string) {
          params.append('format', input.format_string);
        }

        // Add language if provided
        if (input.lang) {
          params.append('lang', input.lang);
        }

        const queryString = params.toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        // Fetch weather data
        const response = await fetch(fullUrl, {
          headers: {
            'User-Agent': 'curl/7.64.1' // Mimic curl to get ASCII output
          }
        });

        if (!response.ok) {
          return {
            success: false as const,
            error: `Failed to fetch weather data: ${response.statusText}`
          };
        }

        const weatherData = await response.text();

        return {
          success: true as const,
          weather: weatherData,
          url: fullUrl
        };
      } catch (error) {
        return {
          success: false as const,
          error: `Error fetching weather: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
  })
  .build();
