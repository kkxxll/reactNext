import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page', () => {
  render(<App />);
  const heading = screen.getByText(/后台管理登录/i);
  expect(heading).toBeInTheDocument();
});
