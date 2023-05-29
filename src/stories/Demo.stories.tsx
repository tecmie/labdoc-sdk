import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import Demo from '../example';

export default {
  title: 'Demo',
  component: Demo,
  argTypes: {},
} as Meta<typeof Demo>;

const Template: StoryFn<typeof Demo> = (args) => <Demo {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  text: 'Clicked this many times:',
};

// export default {}
