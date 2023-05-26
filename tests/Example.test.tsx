import React from 'react';
import renderer from 'react-test-renderer';
import { Demo } from '../src';

it('renders correctly', () => {
  const tree = renderer
    .create(<Demo text="Clicked this many times" />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
