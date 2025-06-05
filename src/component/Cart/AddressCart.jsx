import { Card, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const AddressCart = ({
  item,
  showButton,
  handleSelectAddress,
  handleDeleteAddress,
}) => {
  return (
    <Card className="flex flex-col gap-3 w-64 max-w-xs p-5">
      <HomeIcon />
      <div className="space-y-3 text-gray-500">
        <h1 className="font-semibold text-lg text-white">
          {item?.isDefault ? "Default Address" : "Address"}
        </h1>

        <p className="break-words whitespace-normal">
          {item?.streetAddress}, {item?.city}, {item?.state}, {item?.pincode},{" "}
          {item?.country}
        </p>

        <div className="flex gap-2">
          {showButton && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleSelectAddress(item)}
            >
              Select
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => handleDeleteAddress(item.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AddressCart;
