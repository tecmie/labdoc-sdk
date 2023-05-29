export interface ScannerInput {
  diagnosis: string[];
}

export type LabQueryRequest = {
  documents: string[];
};

export type LabQueryResponse = {
  result: {
    data: {
      json: [
        null,
        {
          '1. Summary': string;
          '2. Report lines with definitions': string[];
          '3. Preventive strategies': string;
          '4. Treatment plan': string;
          '5. Encouragement': string;
          '6. Recommended health practitioner': string;
        }
      ];
    };
  };
};
