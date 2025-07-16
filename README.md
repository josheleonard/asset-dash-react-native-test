# Degen leaderboard list app

## Getting started

Follow the steps outlined in the [Expo documentation](https://docs.expo.dev/get-started/set-up-your-environment/) to setup your development environment

Then install dependencies:

```bash
npm install
```

Then start the Metro bundler

```bash
npm run start
```

Then, from the terminal press one of the following keys to open the app on a simulator or emulator:

- Press a │ open Android
- Press i │ open iOS simulator

## Technical decisions

### Summary

This project was built using React Native with Expo, leveraging TypeScript for type safety and ESLint for ensuring code quality. TanStack Query was chosen for data fetching due to its strong support for handling loading, error, and refetching states. The folder structure follows common conventions, separating concerns between API logic, reusable components, screens, and utilities.

The asset list is rendered using a performant FlatList, supporting pull-to-refresh and linking each asset to its SolScan page. Filtering is implemented using a segmented control and numeric price input, while sorting options are provided via a modal. Filtering is computed using deferred values to prioritize updates to the input field. User-selected filters are persisted with AsyncLocalStorage, while sorting preferences are kept in local state only. Images are loaded using expo-image for smooth transitions, and a utility function handles recalculating asset price change percentages during data updates.

### Tooling

- [React Native](https://reactnative.dev/): For creating mobile app user interfaces from components
- [Expo](https://expo.dev/): Framework for building React Native projects
- [TypeScript](https://www.typescriptlang.org/): For type syntax and early error catching
- [ESLint](https://eslint.org/): For linting code and enforcing code quality standards
- [TanStack Query](https://tanstack.com/query/): For asynchronous state management

### Folder structure and key files

- [assets](/assets): images for the application
- [src/api](src/api/): Contains API query hooks and API types
- [src/components](src/components/): Contains reusable UI components
- [src/screens](src/screens/): Contains application screen components
- [src/utils](src/utils/): Contains helper utilities
- [app.json](app.json): Expo configuration
- [App.tsx](App.tsx): The main App component which renders context providers and the main screen
- [eslint.config.js](eslint.config.js): Linter configuration
- [index.ts](index.ts): Registers the main App component

### Data fetching

- I utilized TanStack Query for data fetching/refreshing, as it offers a simplified developer experience for handling loading/error states, as well as refetch logic
- Implemented custom logic in the queryFn of the useQueryHook to update the asset prices with random values
- If an error occurs during data fetching, an error message is shown with a button to try again

### Assets list

All assets are shown by default, until the user filters the data.

The list item components are rendered within a Flatlist, as it is a performant option for rendering long lists of items. It also provides functionality for configuring pull-to-refresh behavior.

Pressing an asset in the list opens a link to view the token on SolScan in the user's browser. I would have also added logic to detect the token's chain and link to the other appropriate explorers if I had noticed any addresses other than Solana addresses.

Filtering:

- A SegmentedControl is used to display filtering options for "new" assets, "pro" assets, and "all" assets
- A TextInput is provided for the user to enter a "price greater than" amount
  - Values for this field are validated to only accept numeric values
  - The filtering of the list is computed using a deferred input value to prioritize the responsiveness of the input field updates.

Sorting:

- A button is provided, which if pressed will display a Modal containing sorting options (price, token symbol)

### User preference storage

The filters selected by the user are stored in AsyncLocalStorage, as the values do not require encryption. The values are loaded from local storage and transferred to local state when the screen mounts. The storage values are updated when filters are selected. Sorting selections and sort order are not stored in local storage, as only filtered were called out in the requirements document as data to be stored.

### Image loading

expo-image was used to load the asset icons, as it provided options to smoothly transition from a placeholder content to the loaded image when loading completes.

### Utils

- `getUpdatedPercentChange` is used to calculate the updated percentage change for a timeline value of an asset

## Areas that I would like to improve

I noticed that token names are missing from the API data, I would like to add additional API or RPC calls to fetch the token name from token contract/mint address. I also noticed that this list was only retuning Solana assets, I would like to future-proof this application to be able to handle tokens from other chains.

Although styling was explicitly called out as not a priority, I feel like this app lacks a clean why to hide and show the sorting and filter options. I would also like to add an icon for the filter button, as the text button is very plain looking.

# Thank you!

I sincerely appreciate the opportunity to showcase my capabilities as a developer buy building this project.
Thank you so much for taking the time to review my assessment. I'm looking forward to the chance for us to build awesome things together!
