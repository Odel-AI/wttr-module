# @odel/wttr-module

> Weather forecast module for Odel using wttr.in

Get beautiful ASCII art weather forecasts for any location using the free wttr.in API.

## Features

- ASCII art weather displays with detailed forecasts
- Support for multiple locations (cities, airport codes, coordinates)
- Multiple output formats (default, plain text, one-line, custom)
- Temperature units (metric/Fahrenheit)
- Multi-language support
- No API key required

## Installation

Install the module SDK and create your own weather module:

```bash
npm install @odel/module-sdk zod
```

## Usage

This module provides one tool:

### `get_weather`

Get weather forecast for a location using wttr.in.

**Parameters:**

- `location` (optional): Location to get weather for (city name, airport code, or coordinates). Leave empty for current location based on IP.
- `format` (optional): Output format
  - `default` - Colored ASCII art (default)
  - `plain` - ASCII art without colors
  - `one-line` - Compact one-line format
  - `custom` - Use custom format string
- `format_string` (optional): Custom format string when `format=custom`. Use tokens like:
  - `%l` - location name
  - `%c` - weather condition
  - `%t` - temperature
  - `%h` - humidity
  - `%w` - wind speed
  - Example: `"%l: %c %t"`
- `units` (optional): Temperature units
  - `metric` - Celsius (default)
  - `uscs` - Fahrenheit
  - `metric-ms` - Celsius with m/s wind speed
- `lang` (optional): Language code (e.g., `en`, `de`, `fr`, `es`, `ru`)

**Returns:**

```typescript
{
  success: true,
  weather: string,  // ASCII art weather display
  url: string       // Direct URL to view the forecast
}
```

**Example:**

```typescript
// Get weather for London in metric units
{
  location: "London",
  format: "default",
  units: "metric"
}

// Get current location weather in one-line format
{
  format: "one-line"
}

// Custom format with specific information
{
  location: "Tokyo",
  format: "custom",
  format_string: "%l: %c %t, Humidity: %h"
}
```

## About wttr.in

This module uses the free [wttr.in](https://github.com/chubin/wttr.in) weather service, which provides:

- Console-oriented weather forecasts
- Beautiful ASCII art displays
- No API key or registration required
- Support for thousands of locations worldwide
- Multiple languages and formats

## License

MIT

## Links

- [GitHub Repository](https://github.com/odel-ai/wttr-module)
- [Odel Platform](https://odel.app)
- [wttr.in Documentation](https://github.com/chubin/wttr.in)
