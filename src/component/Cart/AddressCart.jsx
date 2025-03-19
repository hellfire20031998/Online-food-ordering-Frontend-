import { Button, Card } from '@mui/material'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';

const AddressCart = ({ item, showButton, handleSelectAddress }) => {
  return (
    <Card className="flex flex-col gap-3 w-64 max-w-xs p-5">
      <HomeIcon />
      <div className="space-y-3 text-gray-500">
        <h1 className="font-semibold text-lg text-white">Home</h1>
        <p className="break-words whitespace-normal">
          Mumbai, New Shivam Building, Gokuldham Market, 530068, Maharashtra, India
        </p>
        {showButton && (
          <Button variant="outlined" fullWidth onClick={() => handleSelectAddress(item)}>
            Select
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AddressCart;
