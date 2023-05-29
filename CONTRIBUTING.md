# Labdoc SDK

Labdoc SDK is a collection of tools for interacting with the Labdoc API. It provides a Query client for making API requests and a PDF parser for parsing PDF documents client side. It also provides a NextJS HOC for setting up the React Query client and the PDF parser in your NextJS app.

## Setting up with NextJS

To provide the trpc methods into your Nextjs app you need to wrap your app with the `withTRPC` HOC. This HOC provides the `trpc` object to your app. The `trpc` object contains the `ReactQueryClient` and `TRPCClient` instances. The `ReactQueryClient` instance is used to cache the results of the API requests and the `TRPCClient` instance is used to make the API requests. The `trpc` object also contains the `useQuery` and `useMutation` hooks from `react-query` which you can use to make API requests.

```tsx
import { trpc } from '@tecmie/labdoc-sdk';

const MyNextApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
```

# The Inference Client

This client composes React Query with trpc to provide a simple interface for interacting with the Labdoc API. To initialize this client, you must provide a API secret key in `x-secret` headers. This SDK already provides a helper for that, so that the `TRPCClient` instance is used to make requests to the Labdoc API, and the `ReactQueryClient` instance is used to cache the results of those requests.

# The PDF Parser

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

## Call the Inference Method

You need to first parse your page text before calling the inference method, the API method accepts a diagnosis `string argument and you can simply do something like this:

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

  // Call the inference method
  const diagnosis = await callInference.mutateAsync({ diagnosis: text });
  console.log({ document, blobUrl, text, diagnosis });
};
```

Under the hood, the inference method relies on `react-query` and you also have access to the `isLoading`, `isError`, `isSuccess` and `data` properties of the `callInference` object. You can use these properties to render a loading indicator, an error message or the result of the inference method.

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

### Linking

Often times you want to `link` the package you're developing to another project locally to test it out to circumvent the need to publish it to NPM.

For this we use [yalc](https://github.com/wclr/yalc) which is a tool for local package development and simulating the publishing and installation of packages.

In a project where you want to consume your package simply run:

```console
npx yalc link my-react-package
# or
yarn yalc add my-react-package
```

Learn more about `yalc` [here](https://github.com/wclr/yalc).

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

#### Auto publish after Github Release

❗Important note: in order to publish package to NPM you must add your token as a Github Action secret. Learn more on how to configure your repository and publish packages through Github Actions [here](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages).

## PostCSS

[tsup](https://github.com/egoist/tsup) supports PostCSS out of the box. Simply run `yarn add postcss -D` add a `postcss.config.js` file to the root of your project, then add any plugins you need. Learn more how to configure PostCSS [here](https://tsup.egoist.dev/#css-support).

Additionally consider using the [tsup](https://github.com/egoist/tsup) configuration option `injectStyle` to inject the CSS directly into your Javascript bundle instead of outputting a separate CSS file.

## Built something using this starter-kit?

That's awesome! Feel free to add it to the list.

- [next-auth-mui](https://github.com/TimMikeladze/next-auth-mui) - Sign-in dialog for NextAuth built with MUI and React. Detects configured OAuth and Email providers and renders buttons or input fields for each respectively. Fully themeable, extensible and customizable to support custom credential flows.
