// import * as React from 'react';
// // import { inference } from './inference/actions'
// import { trpc } from './inference/trpc';

// import { usePDFParser } from './parser/use-pdf-parser';
// import { LabAIClientProvider } from './inference/provider';

// export type DemoProps = {
//   text?: String;
// };

// export function Demo(props: DemoProps) {
//   const [file, setFile] = React.useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//     }
//   };

//   // @ts-ignore
//   const inference = trpc.scanner.read.useMutation();

//   const canvasRef = React.useRef<HTMLCanvasElement>(null);

//   const { executeUpload } = usePDFParser({
//     canvasRef,
//   });

//   const handleSubmit = async () => {
//     if (file) {
//       // Create a blob URL from the uploaded file
//       const blobUrl = URL.createObjectURL(file);

//       // Execute the upload
//       const pdfData = await executeUpload(blobUrl);

//       const result = await inference.mutateAsync(pdfData);
//       // eslint-disable-next-line no-console
//       console.log(result);
//     }
//   };

//   return (
//     <LabAIClientProvider secret="secret">
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleSubmit} type="button">
//         {`${props.text}`}
//       </button>
//     </LabAIClientProvider>
//   );
// }

// export default Demo;
// // export default trpc.withTRPC( Demo);
export default {};