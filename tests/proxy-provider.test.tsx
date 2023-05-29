import * as React from 'react';
import { render } from '@testing-library/react';
import { LabProvider } from '../src/inference/proxy-provider';

require('isomorphic-fetch'); // Adjust the path as necessary

test('LabProvider matches snapshot', () => {
  const { asFragment } = render(
    <LabProvider secretOrKey="test-key">
      <div>Test child</div>
    </LabProvider>
  );

  expect(asFragment()).toMatchSnapshot();
});
