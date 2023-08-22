# Contributing to Vision Camera React Native
To make the code easy to read and maintainable, this document provides the style guide for TypeScript, JavaScript and TSX code.

## Rationale
Writing code is communicating with another human being how you are solving a problem at hand, and not merely telling the computer what to do. Just as how we choose English or Chinese or some other language to put our ideas across, we need to define a set of guidelines and vocabulary to make sure that we can effectively communicate within the team about how we solve certain problems.

We do not want the code to get overly fragmented as time passes on, and make everybody's job easier. Just as you would put the chair back and clean up your tray, it is common courtesy to make sure that the next person changing the code does not have to deal with your mess more than he/she has to.

## Other Languages
While the codebase is primarily written in TypeScript (and some JavaScript and JSON), There might be other languages in the codebase. For these languages, follow their respective style guides:

| Language | Guide | Link |
| --- | --- | --- |
| Python | PEP-8 | https://www.python.org/dev/peps/pep-0008/ |
| Swift | Google | https://google.github.io/swift/ |
| Objective-C | Google | https://google.github.io/styleguide/objcguide.html |
| Java | Java Code Conventions | https://www.oracle.com/technetwork/java/codeconventions-150003.pdf |
| Kotlin | Coding Conventions | https://kotlinlang.org/docs/reference/coding-conventions.html |
| Groovy | Apache Groovy Style Guide | https://groovy-lang.org/style-guide.html |
| Ruby | Rubocop | https://rubystyle.guide/ |
| C/C++ | Clang | http://llvm.org/docs/CodingStandards.html |

## Linting
All JavaScript and TypeScript code is linted with [Prettier](https://prettier.io/).

## Interfaces and Types
Always prefer interfaces over types.

React components should expose an interface. Because whenever you have to use a type to express something, you should be spliting it up into multiple components.

## Indent
Use **2 space indenting** to ensure code depth for TypeScript, JavaScript, JSON and YAML files. Note that the space should only consist of ASCII spaces (`0x20`), and not tabs (`0x90`), full-width spaces (`U+3000`), non-breaking spaces (`U+00A0`), en spaces (`U+2000`, `U+2002`), em spaces (`U+2001`, `U+2003`) or any other spaces in the Unicode 2000+ range.

For Python files, follow the PEP-8 standard and use 4-space indents.

## Column Width
Enfore **80 characters per line**, unless it's absolutely not able to be broken down into smaller chunks. The rationale is to discourage deeply nested code (_which means, yes, don't go into callback heaven_), to maintain code flow when looking at diffs during maintenance, and to allow developers to open two code documents side-by-side in a modern editor. (_Also to preserve the legacy of the 80-character long punch cards._)

Example of acceptable instances include URLs and string constants. For example:

```typescript
//                                                       80 character limit -> |
const url = "http://llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch.co.uk/"
```

However, should a really long string contains line breaks in the middle, break it out into multiple lines. For example:

```typescript
//                                                       80 character limit -> |
const myString = (
  "This is a really long string that will definitely wrap but there will\n" +
  "be a line break in the middle of the string so that it looks nice when\n" +
  "printed on console"
);

const myOtherString = (
  "This is a really long string that for some reason doesn't wrap and " +
  "prints to a single line in console. However, you should still break " +
  "this string into multiple lines at natural word boundaries as it is " +
  "easier to read this way."
);
```

If the content has some ingerent hierarchy (such as included HTML string) , you can even break it up to reflect such hierarchy. For example:

```typescript
//                                                       80 character limit -> |
const creatingYourProfile = (
  "<p>" +
    "<b>" + 
      "Creating Your Profile" +
    "</b>" +
  "</p>" +
  "<p>" + 
    "From the main page, tap Profile " +
    "<img src='profile.png' style='width:1em;height:1em;'> " +
    "." +
  "</p>" +
  "<p>" +
    "On the next page, tap the Plus icon " +
    "<img src='plus.png' style='width:1em;height:1em;'> " +
    "located at the top right corner of your screen." +
  "</p>" +
  "<p>" +
    "2 options are provided to fill in the passport details:" +
    "<ul>" +
      "<li>" +
        "<img src='scan.png' style='width:1em;height:1em;'> " +
        "Scan the passport data page by using your in-built camera" +
      "</li>" +
      "<li>" +
        "<img src='manual.png' style='width:1em;height:1em;'> " +
        "Manual entry" +
      "</li>" +
    "</ul>" +
  "</p>" +
  "<p>" +
    "The Particulars page will be shown. " +
    "Please complete the list of questions on this page." +
  "</p>" +
  "<p>" +
    "When you are done, tap the Save icon " +
    "<img src='save.png' style='width:1em;height:1em;'> " +
    "located at the top right corner of your screen." +
  "</p>" +
  "<p>" +
    "You can repeat this step for as many times " +
    "as you wish for your family/companions." +
  "</p>" +
);
```

## Commenting
Comment your code as you write to explain what's going on.

Comments should be constructive and not merely describe what the code is doing. Unnecessary comments should be avoided. Then again, if you write a line of code that's so complex that it takes a long chunk of comments to actually describe the intended behaviour, then that line of code should be avoided as it's not apparent what's going on. The following is an example of a good comment:

```typescript
try {
  // The API will throw an error should the user is not authorised
  const gateStatus = await checkGateStatus(gateId);
} catch {
  ...
}
```

These are bad places to put comments and should be avoided:
```typescript
// DON'T DO THIS
/** animation speed */ // comment provide no additional detail
const ANIMATION_SPEED = 2000;

// DON'T DO THIS
if (gate.isOpen) {
  // gate is open
  doSomethingElse();
}

// DON'T DO THIS

// q here can be undefined. If q is defined, we return true
// however, if q is not, we check if r has a property called "counter"
// If that is truthy, we return true iff r.counter is strictly
// greater than 2. False is returned under all other circumstances.
const p: boolean = !!q && !!(r.counter || r.counter > 2);
```

Try to as much as possible avoid multiline `/* ... */` comments. **Use JSDoc comments only for documenting exposed entities**. Otherwise, use a line comment `//` instead.

```typescript
// DO THIS:

/**
 * The speed at which to fade out.
 *
 * Should `Spring` animation be used, this value shall also be used as the
 * spring constant.
 *
 * Units is in points/millisecond.
 */
const ANIMATION_SPEED = 2000;

function fadeIn() {
  const value = new Animated.Value(0);
  // we want to immediately start the animation before giving a chance for the
  // event listener to intercept this animation.
  value.spring(ANIMATION_SPEED).start();
  return value;
}
```

```typescript
// DON'T DO THIS:

/// The speed at which to fade out.
///
/// Should `Spring` animation be used, this value shall also be used as the
/// spring constant.
///
/// Units is in points/millisecond.
const ANIMATION_SPEED = 2000;
function fadeIn() {
  /* we keep it to return it */
  const value = new Animated.Value(0);
  /**
   * we want to immediately start the animation before giving a chance for the
   * event listener to intercept this animation.
   */
  value.spring(ANIMATION_SPEED).start();
  return value;
}
```

## JSDoc
Use JSDoc comments for non-obvious constants, types parameters, functions, classes and interfaces. A well-formed JSDoc comment should have:

1. A one-line summary about what this thing is doing
2. (optionally) an in-depth discussion about the code
3. JSDoc tags.

### Formatting JSDoc Tags
When line-breaking JSDoc tags, it is expected that the content to be always toward the right of the tag (and parameter if the tag requires it). In this cae, you can omit the newline to separate this tag from the next.

Example:
```typescript
/**
 * @param rejectAfter  the number of milliseconds to wait before rejecting the
 *                     lock attempt.
 * @param dependencies a list of dependent locks to prevent some deadlocks.
 */
```

In cases where the tag along with parameter is too long, and the documentation is more verbose that it becomes prosaic, you can simply flow the content to the next line without aligning to after the tag. However, when you do this, **leave a newline before the next tag** to separate it from the next tag.

Example:
```typescript
/**
 * @param rejectAfter if truthy (i.e. non-0), will reject the promise after
 * the stated number of milliseconds. In an async function, this will equate
 * to an exception. if truthy and < 0, will reject immediately should lock
 * fail to acquire.
 *
 * @returns a promise that resolves when the lock has been successfully
 * acquired, or rejects if the lock has not been acquired after `rejectAfter`
 * milliseconds.
 *
 * When resolved, this resolves to an object that can call `dispose` to
 * release the lock.
 */
```

Always flow the text after the tag, do not leave a new line after the tag:
```typescript
/**
 * DO THIS:
 * @returns a promise that resolves when the lock has been successfully
 * acquired, or rejects if the lock has not been acquired after `rejectAfter`
 * milliseconds.
 *
 * DON'T DO THIS:
 * @returns
 * a promise that resolves when the lock has been successfully acquired, or
 * rejects if the lock has not been acquired after `rejectAfter` milliseconds.
 */
```

## Function, Native Bridge Specifications and React Native component properties
Every public-facing function that's not an implementation should be at least documented with JSDoc comment with what the code does. React component lifecycle functions such as `render`, `componentDidMount`, and `componentWillUpdate` do not need to be documented. Implementations of documented abstract methods do not need to be documented.

```typescript
/**
 * Returns a value between [0, period) if value is not NaN or Infinity. NaN
 * otherwise.
 * @param value The value to be clamped. Returns NaN if NaN or +/- Infinity
 * @param period A value (not NaN, not Infinity, positive) that represents the
 * period.
 */
export function clampCycle(value: number, period: number): number {
  // ...
}
```

A Native Bridge interface should be well documented to the extent that someone implementing it on the iOS side and Android side will know exactly how the function should behave simply by reading the documentation.

```typescript
export interface ICarrierBridge {
  /**
   * Any native implementation should return true IFF the current device
   * supports installation of an eSIM profile.
   *
   * Refer to the following for device capabilities check:
   *
   * Android:
   * https://source.android.com/devices/tech/connect/esim-overview
   *
   * iOS:
   * https://developer.apple.com/documentation/coretelephony
   *
   */
  deviceSupportsESimInstallation(): Promise<boolean>;

  /**
   * Attempt to install the eSIM profile in into the system, and return the
   * output status. Note that the function should always resolve to unknown
   * if the device does not support eSIM profile installation.
   *
   * The return state follows the specifications set out by
   * CTCellularPlanProvisioning.addPlanWith message on iOS, which will resolve
   * to an enum with "success", "fail" or "unknown". Note that when this
   * resolves to "success", the server should always respond with a "installed"
   * for this particular eSIM profile.
   *
   * @param address The SM-DP+ address
   * @param confirmationCode
   * @param eid Device EID
   * @param iccid SIM Card ICCID (get from Backend)
   * @param matchingId Matching ID (from Backend)
   * @param oid
   */
  installESimProfile(
    address: string,
    confirmationCode: string | null,
    eid: string | null,
    iccid: string,
    matchingId: string,
    oid: string | null,
  ): Promise<ESimInstallationOutcome>;
}
```

React component properties should be documented if it's not immediately obvious what it is referring to. For example:

```typescript
export interface INavigationBarProps {
  /**
   * title required a value from localization file
   * It will automatically select the text based on language
   */
  title?: string;
  /** The style, if present, that will be composited on top of Styles.Nav */
  style?: StyleProp<ViewStyle>;
  ignoreHardwareBackButtonAndroid?: boolean; // reasonably self explanatory
  onBackPressed(): void; // reasonably self explanatory
}
```

## Header Comments
Each file should start with JSDoc-style comment as follows:

```typescript
<file name>
@author <Name> <<Email>>
@file <one-liner description of what the file does>
```

Instructions to preprocessors (such as `@barrel export all` or `@format`) should be a normal comment after the header comment.

## Naming
File names, class names, types and interfaces should be PascalCased. Variables, function names and method names should be camelCased. File-specific constants can be either camelCased or UPPER_CASED, though this applies only to constants, and static readonly properties.

Here are some examples:
```typescript
export const STATIC_CONSTANT = 5;

export const ObjectAsModule = {
  // ...
};

export class ReactClassComponent extends Component {
  // ...
}

export function ReactFunctionComponent() {
  // ...
}

export function myFunction() {
  // ...
}

export interface IState {
  // ...
}

export type TypeDefinition =
  // ...
;

export type EnumeratedStringType =
  | "STRING_ONE"
  | "STRING_TWO"
  | "STRING_THREE"
;
```

### Enumerated strings
Follow Redux's online documentation when defining action types, as such, enumerated strings should be in SHOUTY_CASE. The only exception to that rule is when backend endpoint defines it separately (such as status codes).

### Navigation Routes
Aside from enumerated strings, navigation routes using `react-navigation` should follow the following format to ensure upstream consistency:

```typescript
export const Navigator = createStackNavigator({
  PageOne: /* ... */,
  PageTwo: /* ... */,
});

export enum NavigatorRouteDefinition {
  PAGE_ONE = "PageOne",
  PAGE_TWO = "PageTwo",
}
```

That is, route names are PascalCased, and enums for the corresponding route definitions, as per our naming conventions, would be SHOUTY_CASED.

### React Components
For a React Component `MyComponent`:

1. It's props shall be exported as `IMyComponentProps`, and should always be an interface (and not type).
2. It's dispatchable actions should be exported as `MyComponentDispatchAction`.
3. Dispatchable actions should be scoped by a SHOUTY_CASE string `MY_COMPONENT`.
4. It's state is called `IState`, and internal action is called `Action`. These two types should not be exported.
5. For function components, the parameter should always be `props`.

Example:

Class Component
```typescript
/**
 * MyComponent.tsx
 * @author TAN Ah Kow <ahkow.tan@mail.com>
 * @file My awesome component
 */

// @barrel component dispatch

export interface IMyComponentProps
extends IDispatchable<MyComponentDispatchAction> {
  // ...
}

interface IState {
  // ...
}

export type MyComponentDispatchAction =
  | Action.Scoped<"MY_COMPONENT", Action.Type<"SOME_ACTION", string>>
  | //...
;

type Action =
  | MyComponentDispatchAction
  | //...
;

export class MyComponent
extends Component<
  IMyComponentProps,
  IState,
  MyComponentDispatchAction
> {
  //...
}
```

Function Component:
```typescript
/**
 * MyComponent.tsx
 * @author TAN Ah Kow <ahkow.tan@mail.com>
 * @file My awesome component
 */

// @barrel component dispatch

export interface IMyComponentProps
extends IDispatchable<MyComponentDispatchAction> {
  // ...
}

interface IState {
  // ...
}

export type MyComponentDispatchAction =
  | Action.Scoped<"MY_COMPONENT", Action.Type<"SOME_ACTION", string>>
  | //...
;

type Action =
  | MyComponentDispatchAction
  | //...
;

function reducer(state: IState, action: Action) {
  //...
}

export function MyComponent(props: IMyComponentProps) {
  const [ state, dispatch ] = useReducer(reducer, { /* ... */ });
  // ...
}
```

### Hooks
Hooks should always begin with the word `use` as per Rules of Hooks. If you have canonically exported hook, `useMyHook` will be in `MyHook.ts`, with a barrel directive `@barrel hook`, i.e.

```typescript
/**
 * MyHook.ts
 * @author TAN Ah Kow <ahkow.tan@mail.com>
 * @file my awesome hook
 */

// @barrel hook

export function useMyHook() {
  // ...
}
```

### StyleSheets
A React Component `MyComponent` will have a corresponding stylesheet `IMyComponentStyleSheet`. This can be realised in Styles as:

```typescript
/**
 * MyComponent.ts
 * @author TAN Ah Kow <ahkow.tan@mail.com>
 * @file stylesheet for MyComponent
 */

// @barrel stylesheet

export interface IMyComponentStyleSheet {
  myClass: StyleProp<ViewStyle>;
  // ...
}

export const MyComponent = Theme.createTemplate<IMyComponentStyleSheet>>(
  "MyComponent",
  {
    myClass: {
      flex: 1,
    },
    // ...
  },
);
```

## Abbreviations and Acronyms
**NEVER USE SHORT FORMS UNLESS ABSOLUTELY NECESSARY**. This especially applies to internal acronyms such as `MMBS` and `EMS` since no one will be able to understand the code without extensive orientation with the company. In such cases, we prefer the use of `MultiModalBiometricsSystem` and `ExceptionManagementSystem` respectively. Well-recognised abbreviations, on the other hand, may be used. Examples include `Ref` (introduced by React); `Id` (as an identifier); `Nav` (navigation). (However the use of `RefId` is still discouraged as it implies redundancy.)

Acronyms, on the other hand, should only be used if it's understandable in the broader context. That is, it's not an internal acronym that a new developer will scratch his/her head with. As stated previously, abbreviations such as `MMBS`, `EMS`, `EIM` should be avoided, but abbreviations such as `QR`, `NRIC`, `FIN` are allowed to be used

Acronyms of 3 letters or more should be considered as "1 word". For 2 letter acronyms, the casing should be the same for both letters. Exceptions include short forms of 1 word, such as `id`. For example:

- QR Code -> `qrCode`, `QRCode`, `QR_CODE`
- NRIC -> `nric`, `Nric`, `NRIC`
- Matching ID -> `matchingId`, `MatchingId`, `MATCHING_ID`

Do note, however, that Objective-C style prefixes is allowed to be styled as all-caps only if it's being used to represent the exact object in iOS (e.g. `NSObject`, `WKWebView`)

## Interfaces and Types
### Always prefer interfaces
Always use interfaces over types. This is because interfaces are a clearer means of documentation of what's going on. This will also make TypeScript error messages clearer to read.

Although you can do things like:

```typescript
export type ButtonProps =
  | IStringButtonProps
  | IFontAwesomeButtonProps
  | IDisabledButtonProps
;
```

In such a case, you can always separate out the button into 3 separate components, which will be more aligned to React's means of code reuse anyway.

Advanced types can and will be used to infer types, and map over unions and such. However, these should only be used in cases where interfaces become insufficient.

### Type definitions should be ahead of functions and classes
Type names should be PascalCased and be descriptive of what they mean.

Interface names to start with `I`. If an interface is a property definition for a React component, the interface should be named `IComponentNameProps`. For example:

```typescript
export class MyComponent extends React.Component<IMyComponentProps, IState> {
  ...
}
```

The state interface should not contain the component name, and would just be `IState`

When exporting a default interface in a module that has `@barrel export all`, use the name `Interface` or `Type` to mean the definitive type of the module. This is similar to the `Module.t` semantic commonly present in OCaml. This allows imports of this type in other scripts to be of the form `Module.Type`, which is cleaner than `Module.Module`. However, this type should only happen on export, and internally this type should be equivalent to something else.

**Example**
```typescript
// Option.ts
// @barrel export all

export type Option<T> = T | undefined;

export type Type<T> = Option<T>

export function isSome(opt: Option<T>): opt is T {
 // ...
}

// ... other exported functions
```

## Folder structure
All source files should be placed into `src` directory. The subdirectories are as follows:

- `assets` - asset names should be in snake_case. Its subdirectories include:
  - `localisations` - Locale-specific strings. They will be named `<locale>.json`. Files here ifnore the snake_case naming convention.
  - `images` - Static image assets. Use React Native naming schemes (`image@2x.png`, `image@3x.png`) for React Native to be able to properly select the images based on scaling.
  - `themes` - Additional themes that define colors.
- `components` - Common (and reusable) components.
- `core` - Basic utility functions. This should eventually be able to be published as a standalone npm package.
- `interop` - Declarations for React Native Modules. The implementation of these will be platform dependent.
- `models` - Defines data models used from endpoints.
- `scenes` - Define subfolders if subscenes are to be used. These are collections of views that group together to perform a specific function.
- `services` - API specifications or functions that wrap the API calls.
- `styles` - Stylesheet definition files.
- `viewmodels` - Defines a long-living object that provides data to scenes. This maybe realised as hooks.

### Scene-specific components
Components that are specific to a scene should be placed in the `components` folder in that scene. For example, a scene file `src/scenes/overview/overview.tsx` would use components from `src/scenes/overview/components`.

### Tests and snapshots
To facilitate unit testing, a test file for each `.ts(x)` file written is expected. These files will reside in the specific `__tests__` folder, with the extension `.test.ts(x)`. For example, `src/components/Dropdown.tsx` will have a corresponding test file `src/components/__tests__/Dropdown.test.tsx`. The extension depends solely on whether the jsx syntax extension is required in the test file.

Snapshots are saved by jest automatically by default in `__snapshots__` folder. Besure to update the snapshots using `jest -u` when the UI is updated.

## File and Directory Naming
Files should be PascalCased, directories should be lower cased, and shouldn't include extraneous details not relevant to what it is used for.

```typescript
// Good
src/scenes/overview/components/GateStatus.tsx

// Bad
src/scenes/overview/components/GateStatusComponent.tsx // we already know it's a component
src/scenes/overview/components/OverviewGateStatus.tsx // we already know it's for overview scene
```

## `.ts` vs. `.tsx`
Only name your file `.tsx` if you require the JSX syntax extension. Conversely, do **NOT** name your file `.ts` and abuse `React.createComponent`s.

## Line-wrapping

### Semicolon
If a statement is wrapped without a closing brace (i.e. `)`, `]`, `}`, `>`), the semicolon (`;`) should be on a new line in the same indentation level as the statement. Otherwise, the semicolon should be on the same line as the closing brace with no space in between.

**Examples**
```typescript
const param =
  (a + b) / c;

type Transition = Action.Type <
  "transition",
  number
>;

const timerId = setTimeout(
  doTimeoutFunction,
  2000,
);

const myArray = [
  "veryLongElementOne",
  "veryLongElementTwo",
];

const myObject = {
  key1: "value1",
  key2: "value2",
};
```

## Hanging braces
A comma separated list should either be entirely horizontal or entirely vertical. If it needs to be wrapped, only generics (`<`) should have a space before. In case that the open `{` in function and class definitions, if the preceding block is not at the same indentation level as the beginning of the definition, bring it to a new line. This is to prevent the block preceding `{` and the block after looking like it's one unified block of code.

**Examples:**
```typescript
function sendAction(action: string, path: string) {
  ...
}

// wraps to
function sendAction(
  action: string,
  path: string,
) {
  ...
}

```

```typescript
type APIEndPoint<TParam, TRequest extends TParam, TAPIResponse, TResponse> = ...;

// wraps to
type APIEndPoint <
  TParam,
  TRequest extends TParam,
  TAPIResponse,
  TResponse
> =
  ...
;
```

## Union types
Wrap line after `=`, each member type should be on their own line starting with the `|` character.

**Examples:**

***Not wrapped***
```typescript
type Action<T> = Toggle | SelectElement<T> | UpdateAnimationFlag | SetCurrentY;
```

***Wrapped***
```typescript
type Action<T> =
  | Action.Only<"toggle">
  | Action.Type<"setCurrentY", number>
  | Action.Type<"selectElement", [T, number]>
  | Action.Type<"updateAnimationFlag", boolean>
;
```

***Wrapped with multiline actions***
```typescript
type Action<T> =
  | Action.Only<"toggle">
  | Action.Type<"setCurrentY", number>
  | Action.Type <
      "reallyLongTypeParameterThatForcesLineWrapping",
      Action.Type <
        "someNestedTypeParameters",
        [number, boolean, T, string]
      >
    >
  | Action.Type<"updateAnimationFlag", boolean>
;
```

**Non (Bad) Examples:**

***Partially expanded***
```typescript
// DON'T DO THIS
type Action<T> = SelectElement<T> | Toggle
  | Action.Type<"setCurrentY", number>
  | Action.Type<"updateAnimationFlag", boolean>
;
```

***ML-style***
```typescript
// DON'T DO THIS
type Action<T> = Action.Only<"toggle">
               | Action.Type<"setCurrentY", number>
               | Action.Type<"selectElement", [T, number]>
               | Action.Type<"updateAnimationFlag", boolean>
;
```

## Conditional Expressions
Sometimes, a conditional expression is preferred over an if statement should there not be side effects. To do that, treat the conditional expression as a `IF...THEN...ELSE` block, i.e.

```typescript
<expression> ?(THEN) <expression> :(ELSE) <expression>
```

To indent, the `THEN` is located at the same line as the condition, and the true expression should be indented 1 level on the next line, followed by the `:` character on it's own in the same indentation level as the condition, followed by the false expression on the next line with the same indentation level as the true expression. This, the indent would look like:

```typescript
<conditional-expr> ?
  <expr-if-true>
:
  <expr-if-false>
```

If a series of conditional checks enfore the `IF ... ELSE IF ... ELSE IF ... ELSE ...` pattern, the wrapped code should liike like the following:

```typescript
<expr-1> ?
  <expr-1-true>
: <expr-2> ?
  <expr-2-true>
:
  <else-expr>
```

Same behaviour is expected for conditional type definitions.

**Examples**

***Single***
```typescript
const update =
  lhs.update ?
    _.merge(lhs.update, rhs.update)
  :
  rhs.update
;
```

***Nested***
```typescript
const effect =
  lhs.effect ?
    rhs.effect ?
      _.concat(lhs.effect, rhs.effect)
    :
      lhs.effect
  :
    lhs.effect
;
```

**Non (Bad) Examples:**

***Same line**
```typescript
// DON'T DO THIS
const update = lhs.update ?
  _.merge(lhs.update, rhs.update)
:
  rhs.update;
```

***False expression on the same line as `:`
```typescript
// DON'T DO THIS
const update =
  lhs.update ?
    _.merge(lhs.update, rhs.update)
  : rhs.update;
```

## Class Definitions
When it's necessary to break a class definition into multiple lines, break at `extends` and `implements` with no additional indents. Follow the handing brace rules to place the open brace accordingly.

```typescript
export class ReallyLong
extends ReallyLongBaseClass
implements
  IBaseInterface,
  IAnotherInterface,
  IThirdInterface
{
  // implementation
}
```

## Curried Functions
When defining curried arrow functions, the entire definition (up to the innermost function) is treated as a function definition, and indented as one would for such a function

```typescript
export const curried =
  (param1: ReallyRandomType) =>
  (param2: ReallyRandomType2, param3: SomeOtherType) =>
  (param4: TotallyAnotherType) =>
{
  // ...
}
```

## Boolean operators
Boolean operators should be braced and listed with one literal on each line and the operator at the end.

**Example:**
```typescript
if (
  literal1 ||
  !literal2 ||
  (
    subLiteral1 &&
    reallyReallyReallyLongLiteral2
  )
) {
  // ...
}
```

## Best Practices
### `NaNNaNNaNNaN NaNNaNNaNNaN badNaN`
JavaScript is weird. Sometimes, things will not turn out as you'd expect. TypeScript aims to be a superset of JavaScript, and so TypeScript will allow the weird semantics that JavaScript already has. Always be careful of what you're doing when writing code. Even a simple `(a < b)` can cause huge problems in the future. Here are some rough guidelines to avoid doing weird hidden bugs.

- **Don't fight the linter or `tsc`**. If the linter (or TypeScript compiler) says something, it's probably for good reason. Go read the documentation on why such a complaint is made, before making the decision to disable it. Most of the time, it's not the problem with the linter or compiler, but with the implementation in question.

- **Never cast anything to `any`** unless you're **absolutely certain** that your typings are correct, chances are, having to cast to any and back means TypeScript has found something you have not. In the cases that you really think you're smarter than the compiler, document down why you've casted it to any so that your fellow contributors are also aware of such limitations.

- **It never hurts to be more verbose**. While `!!a` may look more elgant than `a ? true : false`, the former (especially to someone that's not as experienced in JavaScript) is more likely to be misunderstood. Do an explicit check for `undefined` by doing `if (a === undefined)` rather than simply `if (a)`, and be mindful of the truthiness of values in JAvaScript (empty string is falsy, empty array is truthy). We have explicitly defined `Option.isSome` to wrap undefined values. Use that whenever possible.

- **Be careful with comparisons and arithmetic operations**. Operators like `>`, `<`, `>=`, `<=` as well as `+`, `-`, `*`, `%` behave in very interesting ways, When in doubt, use `parseInt` or `${}` to case to the correct type, or use a `typeof` assertion.

- **Be aware of floating point weirdness, as well as JavaScriptCore/V8 optimisations`**. On 32-bit systems the maximum representable signed integer on v8 is 2<sup>30</sup> because the last bit is used for tagging.

## General Programming
### Do not write duplicate code

**Do NOT copy and paste**. If you find yourself doing that, you can probably refactor something out into another function. Fuplicate code causes maintenance headaches in the future, so avoid it at all costs now. Always assume that other people will be re-using the function that you wrote. Even if it's a dangerously internal unsafe private function that does something weird, someone will figure out what it does and make changes to it.

However, test cases should be self contained and easily transplantable. n such cases, there may be many lines of duplicate code and that is acceptable.

### Functions should be short
While no function lengths are strictly enforced, they shouldn't be exceedingly long. Use 20 - 25 lines as a guide. If it is way longer than that, it's time to break it out into different functions.

### Deprecating old implementations
Explicitly mark `@deprecated` on entities that may be removed in the future, and be diligent to not use these deprecated entities.

### Follow the existing implementation
There may be somethings that are not touched on by this document. In such cases, you should consult with the existing codebase, and if such implementation exist, follow what's defined here. That said, however, if you feel that the existing implementation could use some improvement, feel free to voice out.

## Types and Interfaces
### Define interfaces and types before functions and variables
Interfaces and types should both be defined before any function or class definition. There should not be any interfaces or types defined in the middle. This is to aid readability for someone else when he/she comes in to maintain the existing code. Having a random type definition in the middle of the code is a great way for someone to miss such definition and introduce inadvertent bugs into the codebase without knowing.

```typescript
// Do this
type MyType = /* ... */;

function myFunction() {
  // ...
}

function myFunctionTwo(): MyType {
  // ...
}

// DON'T DO THIS
function myFunction() {
  // ...
}

type MyType = /* ... */;

function myFunctionTwo(): MyType {
 // ...
}
```

### Complex types should not be written inline multiple times
We define a **complex type** to be a type that has atleast one of:

- At least 1 of the following:
  - conditional operator (`?:`) e.g. `T extends U ? V : W`
  - intersection operator (`&`)
  - union operator (`|`)
  - arrow type (`=>`) e.g. `(a: number, b: number) => number`
  - object literal type
- Will not fit in one line
- Complex type statements (e.g. nested type parameters) that is not one of:
  - `Pick`
  - `Record`
  - `Partial`
  - `Exclude`
  - `Extract`
  - `ReturnType`
  - `NonNullable`
  - `InstanceType`

We discourage the use of complex types inline in more than one place, especially if it's highly likely that it will be reused in the future.

### Prefer string literal types over enums
In TypeScript, the following code

```typescript
export enum MyEnum {
  CaseOne,
  CaseTwo,
  CaseThree,
}
```

will be generated to

```typescript
export var MyEnum;
(function (MyEnum) {
  MyEnum[MyEnum["CaseOne"] = 0] = "CaseOne";
  MyEnum[MyEnum["CaseTwo"] = 1] = "CaseTwo";
  MyEnum[MyEnum["CaseThree"] = 2] = "CaseThree";
})(MyEnum || (MyEnum = {}));
```

As you can see, the generated code is actually quite complex, and the dynamic semantics is less than ideal for debugging. If you were to set a breakpoint at a comparision, `MyEnum.CaseTwo` actually gets you number `1` rather than the expected enum value. On the other hand, TypeScript now supports union of string literals, which means now you can define something like

```typescript
export type MyType = "case-one" | "case-two" | "case-three";
```

This has similar static semantics in TypeScript, while achieving a dynamic semantics that's easier to debug than that achieved by an Enum, since the value you get at runtime is literally `case-two`.

## React Component
### Treat State as immutable
We strictly enforce that the state of a component is immutable, and we forbid all calls to `setState`. In order to update a state, override the `reducer` method in `Core.Redux.Component` which will return a new state and possible asynchronous side effects. Note that this.state should only be referred to directly by the component if it's part of `render` or `componentShouldUpdate`.

Should there need to be any animations or other long-running asynchronous actions, attach a sideeffect to the reducer which is in the form of `(oldState) => Promise<void>`.
