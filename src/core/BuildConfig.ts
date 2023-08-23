/**
 * BuildConfig.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Helper functions to get Configuration defined in .env files
 * @barrel export all
 */

import _ from 'lodash';
import Config from 'react-native-config';
import { Option } from 'nasi-lemak';

export type Keys =
  | 'ENDPOINT_SERVER_URL'
  | 'ENDPOINT_POLL_INTERVAL_MS'
  | 'RETRY_BACKOFF_INTERVAL_MS'
  | 'RETRY_BACKOFF_MAX_RETRIES';

/**
 * Replaces a template with replacement strings.
 * The expected template here is with the use of the '$' sigil and an index.
 * e.g. template='Hello $0, my name is $1', replacements=[foo, bar]
 *
 * @param template template string
 * @param replacements list of replacement strings
 */
function replace(
  template: string,
  ...replacements: string[]
): Option.Type<string> {
  if (_.isEmpty(replacements)) {
    return template;
  }

  const sigil = '$';
  const pattern = /\$(\$|\d+)/g;

  let buffer = '';
  let startIdx = 0;

  let matches: Option.Type<RegExpExecArray>;

  do {
    matches = Option.truthy(pattern.exec(template));

    if (Option.isNone(matches)) {
      break;
    }

    buffer += template.substring(startIdx, matches.index);

    if (matches[1] === sigil) {
      buffer += sigil;
    } else {
      const item = replacements[parseInt(matches[1], 10)];
      if (Option.isNone(item)) {
        return undefined;
      }
      buffer += item;
    }
    startIdx = matches.index + matches[0].length;
  } while (Option.isSome(matches));

  buffer += template.substring(startIdx);
  return buffer;
}

/**
 * returns the string value of the given key defined
 * @param key Config key defined in the .env files
 * @param defaultValue the optional default value to return
 */
function _getValue(key: Keys, defaultValue?: string): string {
  if (Option.isSome(defaultValue)) {
    return Option.value(Config[key], defaultValue);
  } else {
    return Option.valOf(Config[key]);
  }
}

/**
 * returns the string value of the given key defined
 * @param key Config key defined in the .env files
 * @param defaultValue the optional default value to return
 * @param replacements Array of string to be replaced into the template
 */
export function getValue(
  key: Keys,
  defaultValue?: string,
  ...replacements: string[]
): string {
  const value = _getValue(key, defaultValue);
  return Option.valOf(replace(value, ...replacements));
}

/**
 * returns true iff the given key is defined
 * @param key Config key defined in the .env files
 */
export function has(key: Keys): boolean {
  return Option.isSome(Config[key]);
}

/**
 * returns true iff the given key is defined with the value true
 * @param key Config key defined in the .env files
 * @param defaultValue the optional default value to return
 */
export function getBoolean(key: Keys, defaultValue?: boolean): boolean {
  let strValue: string;
  if (Option.isSome(defaultValue)) {
    strValue = Option.value(Config[key], _.toString(defaultValue));
  } else {
    strValue = Option.valOf(Config[key]);
  }
  return strValue.toLowerCase() === 'true';
}

/**
 * returns the number value of the given key defined
 * if number configured is not valid, TypeError is thrown
 * @param key Config key defined in the .env files
 * @param defaultValue the optional default value to return
 */
export function getNumber(key: Keys, defaultValue?: number): number {
  let strValue: string;
  if (Option.isSome(defaultValue)) {
    strValue = Option.value(Config[key], _.toString(defaultValue));
  } else {
    strValue = Option.valOf(Config[key]);
  }

  const convertedNumber = Number(strValue);

  if (isNaN(convertedNumber)) {
    // if value of Key is not a valid number, Number() will return NaN
    // TypeError is thrown to alert for NaN when stored value is misconfigured
    throw new TypeError('Value is not a valid number!');
  }
  return convertedNumber;
}

/**
 * returns the array of the given key defined
 * if array configured is not valid, TypeError is thrown
 * @param key Config key defined in the .env files
 * @param separator delimitor to split the raw value with.
 *                  (defaults to comma (,))
 */
export function getArray(
  key: Keys,
  defaultValues?: Array<string>,
  separator: string = ',',
): Array<string> {
  let rawValue: string;
  if (Option.isSome(defaultValues)) {
    rawValue = Option.value(Config[key], defaultValues.toString());
  } else {
    rawValue = Option.valOf(Config[key]);
  }

  if (Option.truthy(rawValue)) {
    return _.split(rawValue, separator);
  }

  // Return an empty array if we got an empty or falsy string.
  return [];
}
