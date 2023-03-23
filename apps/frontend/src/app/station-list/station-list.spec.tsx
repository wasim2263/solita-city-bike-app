import { render } from '@testing-library/react';

import StationList from './station-list';

describe('StationList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StationList />);
    expect(baseElement).toBeTruthy();
  });
});
