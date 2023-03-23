import { render } from '@testing-library/react';

import JourneyList from './journey-list';

describe('JourneyList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<JourneyList />);
    expect(baseElement).toBeTruthy();
  });
});
