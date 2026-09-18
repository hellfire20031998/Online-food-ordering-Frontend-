import { Stack, Typography } from "@mui/material";
import React from "react";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1} sx={{ mb: 3 }}>
      <div>
        <Typography variant="h5" fontWeight={600}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </div>
      {actions && <div>{actions}</div>}
    </Stack>
  );
}
