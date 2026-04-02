# Company Search & Filter App

A React Native (Expo) app for searching, filtering, and sorting a dataset of 25 companies across 9 industries and 11 countries.

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (bundled with Node.js)
- Expo CLI — install globally or use `npx`:
  ```bash
  npm install -g expo-cli
  # or just use npx (no install needed)
  ```

### Install & Run

```bash
# 1. Clone or download the project, then enter the app directory
cd company-search-filter-app

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npx expo start
```

### Opening the App

Once the dev server is running, press the corresponding key in the terminal:

| Platform         | Key          | Requirement                                                |
| ---------------- | ------------ | ---------------------------------------------------------- |
| iOS Simulator    | `i`          | macOS + Xcode installed                                    |
| Android Emulator | `a`          | Android Studio + emulator running                          |
| Physical device  | Scan QR code | [Expo Go](https://expo.dev/client) app installed on device |

### Running Tests

```bash
npx jest --runInBand
```

### Linting

```bash
npm run lint        # check all files for violations
npm run lint:fix    # auto-fix what ESLint can fix
```

---

## Architecture

### Component Hierarchy

```
App
└── AppProvider (React Context + useReducer)
    ├── SearchBar
    ├── SortControl
    ├── FilterToggleButton
    ├── FilterPanel
    └── ResultList
        └── CompanyCard (one per result)
```

`App` wraps everything in `AppProvider`, which owns all shared state. `AppContent` (inside `App`) manages only the local `filterVisible` toggle — everything else lives in the context.

### State Management

State is managed with a single `useReducer` + React Context (`AppContext`). There is one `AppState` object and no prop drilling — any component that needs state or dispatch calls `useContext(AppContext)`.

All mutations go through typed `AppAction` dispatches:

| Action          | Effect                                   |
| --------------- | ---------------------------------------- |
| `SET_SEARCH`    | Updates the search query string          |
| `SET_FILTER`    | Merges a partial `FilterState` update    |
| `CLEAR_FILTERS` | Resets all filters to defaults           |
| `SET_SORT`      | Sets the active sort field and direction |

### Search → Filter → Sort Pipeline

Every action that changes query, filters, or sort triggers `computeResults`, which composes the three pure engine functions in order:

```
raw query string
  → QueryParser   → ParsedQuery
  → SearchEngine  → matched companies
  → FilterEngine  → filtered companies
  → SortEngine    → final sorted results
```

The result is stored directly in `AppState.results` — no derived state, no selectors.

### Module Roles

**QueryParser** (`src/logic/queryParser.ts`)
Tokenizes the raw search string into a structured `ParsedQuery` with three buckets:

- `freeText` — plain tokens matched against all fields
- `fieldFilters` — `field:value` tokens for exact field matching
- `numericComparisons` — `field>value` / `field<value` / `field>=value` / `field<=value` / `field=value` tokens

**SearchEngine** (`src/logic/searchEngine.ts`)
Pure function. Iterates every company and checks all three query buckets. Free-text tokens are matched with `String.includes()` across all searchable fields. Field filters use case-insensitive equality. Numeric comparisons use the appropriate operator against the resolved field value. Short-circuits to return all companies when the query is effectively empty (combined free-text length < 3 and no structured filters).

**FilterEngine** (`src/logic/filterEngine.ts`)
Pure function. Applies an AND conjunction of all active filter predicates: industry, company type, size, revenue range, and founded-year range. Invalid ranges (min > max) are silently ignored.

**SortEngine** (`src/logic/sortEngine.ts`)
Pure function. Sorts a copy of the input array using field-type-aware comparators. Returns the original array reference unchanged when `sortField` is `null`.

**useDebounce** (`src/hooks/useDebounce.ts`)
Custom hook that delays propagating a value until 300ms after the last change. Used in `SearchBar` so the pipeline only runs after the user pauses typing.

---

## Data Model

Each `Company` record contains:

| Field           | Type             | Description                                                     |
| --------------- | ---------------- | --------------------------------------------------------------- |
| `id`            | `string`         | Unique identifier                                               |
| `name`          | `string`         | Company name                                                    |
| `country`       | `string`         | Country of origin                                               |
| `industry`      | `string`         | Industry sector                                                 |
| `founded_year`  | `number`         | Year founded                                                    |
| `financials`    | `FinancialData`  | `year`, `revenue`, `net_income`                                 |
| `details`       | `CompanyDetails` | `company_type`, `size`, `ceo_name`, `headquarters`              |
| `board_members` | `BoardMember[]`  | Array of `{ name, role }`                                       |
| `offices`       | `Office[]`       | Array of `{ city, country, type: 'HQ' \| 'Regional' \| 'R&D' }` |

Board members and offices are displayed in an expandable section on each `CompanyCard` (tap "Show board & offices"). They are also fully searchable — typing a board member's name or an office city in the search bar will match the relevant company.

---

## Algorithmic Choices

**Multi-field scan in SearchEngine**
Rather than a single `.filter()` with `.includes()` on a concatenated string, `searchEngine` resolves each field individually via `getFieldValue` and `getSearchableStrings`. This keeps field-type semantics intact (numeric fields are not coerced to strings for comparison purposes) and makes it straightforward to add new fields without touching matching logic.

**Field-type-aware comparators in SortEngine**

- String fields (`name`, `company_type`, `headquarters`): `localeCompare` for correct locale-aware ordering.
- Numeric fields (`founded_year`, `revenue`, `net_income`): arithmetic subtraction (`a - b`).
- Enum field (`size`): mapped to a fixed index (`Small=0`, `Medium=1`, `Large=2`) so the sort order reflects natural size progression rather than alphabetical order.

**Regex-based tokenizer in QueryParser**
Two regexes handle structured tokens before falling through to free text:

1. `NUMERIC_OPERATORS_RE` — matches `field>=value` patterns (checks `>=`/`<=` before `>`/`<` to avoid partial matches).
2. `FIELD_FILTER_RE` — matches `field:value` patterns.

Only tokens whose field name appears in `KNOWN_FIELDS` are treated as structured; unrecognised `field:value` strings fall through to free text.

**Space-tolerant query syntax**
The parser normalises the raw input before tokenising, collapsing spaces around operators and colons. This means all of the following are equivalent:

```
industry:Retail revenue>50000
industry: Retail revenue > 50000
industry : Retail revenue>=50000
```

**Silent ignore of invalid filter ranges**
When `revenueMin > revenueMax` (or the equivalent for `foundedYear`), `filterEngine` skips that range predicate entirely rather than returning zero results. This prevents a confusing empty state while the user is still typing range values.

---

## Bonus Features

**Advanced search syntax**
The search bar accepts structured tokens alongside plain text:

```
industry:Tech revenue>5000000 size:Large
industry:Finance country:USA founded_year>=2000
```

**Debounced search input**
`useDebounce` delays pipeline execution by 300ms after each keystroke, avoiding unnecessary re-renders while the user is still typing.

**Animated FilterPanel**
The filter panel uses a React Native `Animated.Value` driving a height animation (200ms) so it slides open and closed smoothly rather than snapping.

**LayoutAnimation on result list updates**
`ResultList` calls `LayoutAnimation.configureNext` before each render so items animate into their new positions when the result set changes.

**`formatCurrency` helper in CompanyCard**
Revenue and net income values are formatted with human-readable suffixes:

- `T` — trillions
- `B` — billions
- `M` — millions
- `K` — thousands

**25 realistic company records**
The dataset (`src/data/dataset.ts`) contains 25 companies spanning 9 industries (Technology, Finance, Healthcare, Energy, Retail, Manufacturing, Telecommunications, Automotive, Aerospace) and 11 countries, with varied sizes, revenue figures, and founding years.

---

## Code Quality

**ESLint** is configured with the following rule sets:

- `@typescript-eslint/recommended` — TypeScript-specific rules (unused vars, no-explicit-any, etc.)
- `eslint-plugin-react/recommended` — React best practices
- `eslint-plugin-react-hooks/recommended` — enforces Rules of Hooks (`rules-of-hooks` as error, `exhaustive-deps` as warning)
- `eslint-plugin-react-native` — warns on inline styles and unused StyleSheet entries
- `prefer-const` enforced as error, `no-console` as warning

Config file: `eslint.config.js` (ESLint v9 flat config format).
