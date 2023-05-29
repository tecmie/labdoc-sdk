# Labdoc SDK

Labdoc SDK is a collection of tools for interacting with the Labdoc API. It provides a Query client for making API requests and a PDF parser for parsing PDF documents client side. It also provides a NextJS HOC for setting up the React Query client and the PDF parser in your NextJS app.

## The Inference Client

This client leverages the power of trpc and React's Context API to provide a simple and efficient interface for interacting with the Labdoc API. To initialize this client, you must provide an API secret key, which is used to authenticate your requests with the Labdoc API.

### Setting up the Provider

To enable the usage of Labdoc API throughout your application, you first need to set up the `LabProvider` at the root level of your application. You can provide your API secret key and optional custom HTTP link `customHttpLink` as props to this provider, when a custom HTTP link is not provided, the default HTTP link `https://labai.tecmie.africa` is used.

```jsx
import { LabProvider } from '@tecmie/labdoc-sdk';

<LabProvider secretOrKey="my-secret-or-key">
  <App />
</LabProvider>;
```

The `LabProvider` makes use of context to provide the necessary functions and hooks to its descendant components.

### Calling the Inference Method

The `useLabInference` hook provides an easy way to interact with the Labdoc API. Before calling the inference method, ensure that your page text is properly parsed.

```jsx
import { usePDFParser, useLabInference } from '@tecmie/labdoc-sdk';

const canvasRef = useRef < HTMLCanvasElement > null;
const { document, executeUpload, parsePageText } = usePDFParser({ canvasRef });
const { query } = useLabInference();

/** Form submission handler */
const onSubmit = async (data: UploadFormOptions) => {
  // Create a blob URL from the uploaded file
  const blobUrl = URL.createObjectURL(data.document[0]);

  // Execute the upload
  await executeUpload(blobUrl);

  // Parse the text on the first page
  const text = await parsePageText(1);

  // Call the inference method
  const diagnosis = await query({ documents: [text] });
  console.log({ document, blobUrl, text, diagnosis });
};
```

Under the hood, the `useLabInference` hook utilizes the `LabBaseContext` to make requests to the Labdoc API, providing a seamless experience of data fetching with built-in caching and error handling mechanisms.

Please refer to the `useLabInference` hook API documentation for more details.

## `useLabInference` Hook

`useLabInference` is a custom hook provided by the Labdoc SDK. This hook is responsible for making requests to the Labdoc Inference API and returns the results of those requests.

### Usage

Before you can make use of the `useLabInference` hook, make sure your component is a descendant of the `LabProvider` component.

```jsx
import { LabProvider } from '@tecmie/labdoc-sdk';

<LabProvider secretOrKey="my-secret-or-key">
  <App />
</LabProvider>;
```

Once the `LabProvider` is set up, you can use the `useLabInference` hook within your functional components.

```jsx
import { useLabInference } from '@tecmie/labdoc-sdk';

function YourComponent() {
  const { query } = useLabInference();
}
```

### API

The `useLabInference` hook exposes an object with the following methods:

- `query`: This function is used to make requests to the Labdoc API. The function accepts an argument of type `LabQueryRequest` (an object with a `documents` array property) and returns a Promise that resolves with the data from the API.

```jsx
const { query } = useLabInference();

// Use parsed text as a parameter for the Labdoc API
const text = '...'; // your parsed text
const response = await query({ documents: [text] });
```

The response object will be of the `LabQueryResponse` type as detailed in the previous section of this document.

Please ensure that error handling is properly set up as this method may throw an error if the API request fails.

### Example

```jsx
import { usePDFParser, useLabInference } from '@tecmie/labdoc-sdk';

function YourComponent() {
  const canvasRef = useRef < HTMLCanvasElement > null;
  const { document, executeUpload, parsePageText } = usePDFParser({
    canvasRef,
  });
  const { query } = useLabInference();

  const onSubmit = async (data: UploadFormOptions) => {
    const blobUrl = URL.createObjectURL(data.document[0]);
    await executeUpload(blobUrl);
    const text = await parsePageText(1);
    const diagnosis = await query({ documents: [text] });
    console.log({ document, blobUrl, text, diagnosis });
  };
}
```

In this example, the text from a PDF is parsed and used as an argument for the `query` function provided by the `useLabInference` hook. The result of this query is logged to the console.

## `usePDFParser` PDF Parser Hook

> This hook is still experimental and might have a few bugs in it

This sdk comes with a react hook to assist with handling uploads for your pdf document, the client is able to parse this document client side and return the parsed data to you. This is useful for when you want to preview the document before uploading it to the server. The hook is called `usePDFParser` and it takes in a file object and returns a `UsePDFParserReturn` object. The `UsePDFParserReturn` object has the following properties:

```ts
export interface UsePDFParserReturn {
  documentURL: string;
  pdfPage: PDFPageProxy;
  document: PDFDocumentProxy;
  parsePageText: (pageNumber: number) => Promise<string>;
  executeUpload: (uploadedFile: string) => void;
}
```

Example usage
The code block uses the usePDFParser hook from the `@tecmie/labdoc-sdk` package.

```tsx
import { usePDFParser } from '@tecmie/labdoc-sdk';

const [file, setFile] = React.useState<File | null>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const { document, executeUpload } = usePDFParser({
  canvasRef: canvasRef,
});

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    setFile(event.target.files[0]);
  }
};

/** Form submission handler */
const onSubmit = async (data: UploadFormOptions) => {
  // Create a blob URL from the uploaded file tracked by handleFileChange
  const blobUrl = URL.createObjectURL(file);

  // Execute the upload
  await executeUpload(blobUrl);
  console.log({ document, blobUrl });
};
```

The code above initializes a canvasRef using the useRef hook and passes it to the `usePDFParser` hook as an argument. The `usePDFParser` hook returns an object that contains a document property and an `executeUpload` function.

The `onSubmit` function is an asynchronous function that takes in an object of type UploadFormOptions as its argument. It creates a blob URL from the uploaded file and passes it to the executeUpload function. Finally, it logs the document object and the blobUrl to the console.

## Parsing Page Text

The `parsePageText` method is a helper function from the PDF Parser that takes in a page number and returns the text on that page. It is useful for when you want to preview the text on a page before uploading the document to the server. The code block below shows how to use the `parsePageText` method.

```tsx
import { usePDFParser } from '@tecmie/labdoc-sdk';

const canvasRef = useRef<HTMLCanvasElement>(null);
const { document, executeUpload, parsePageText } = usePDFParser({
  canvasRef: canvasRef,
});

/** Form submission handler */
const onSubmit = async (data: UploadFormOptions) => {
  // Create a blob URL from the uploaded file
  const blobUrl = URL.createObjectURL(data.document[0]);

  // Execute the upload
  await executeUpload(blobUrl);

  // Parse the text on the first page
  const text = await parsePageText(1);
  console.log({ document, blobUrl, text });
};
```

## Contributing

Watch and rebuild code with `tsup` and runs Storybook to preview your UI during development.

```console
yarn dev
```

Run tests with `jest` when changes are detected.

```console
yarn test:watch
```

### Building

Build package with `tsup` for production.

```console
yarn build
```

### Testing

To run all tests once without watching for changes.

```console
yarn test
```

To watch for changes and run tests.

```
yarn test:watch
```

### Committing

When you are ready to commit simply run the following command to get a well formatted commit message. All staged files will automatically be linted and fixed as well.

```console
yarn commit
```

### Releasing, tagging & publishing to NPM

Create a semantic version tag and publish to Github Releases. When a new release is detected a Github Action will automatically build the package and publish it to NPM. Additionally, a Storybook will be published to Github pages.

Learn more about how to use the `release-it` command [here](https://github.com/release-it/release-it).

```console
yarn release
```

When you are ready to publish to NPM simply run the following command:

```console
yarn publish
```
