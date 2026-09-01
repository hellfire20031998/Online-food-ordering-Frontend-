import { render, screen } from '@testing-library/react';
import AddressCart from './component/Cart/AddressCart';

// Note: components that use react-router-dom v7 cannot be rendered under
// CRA 5's bundled Jest (it cannot resolve the package's ESM "exports" map),
// so this smoke test uses a router-free component.
test('renders an address card', () => {
  const item = {
    id: 1,
    streetAddress: '221B Baker Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
  };
  render(
    <AddressCart
      item={item}
      showButton={true}
      handleSelectAddress={() => {}}
      handleDeleteAddress={() => {}}
    />
  );
  expect(screen.getByText(/221B Baker Street/i)).toBeInTheDocument();
  expect(screen.getByText(/Select/i)).toBeInTheDocument();
});
