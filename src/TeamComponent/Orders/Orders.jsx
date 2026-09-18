import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { teamApi } from "../api/teamApi";
import OrderDetailDialog from "../common/OrderDetailDialog";
import OrdersTable from "../common/OrdersTable";
import PageHeader from "../common/PageHeader";
import usePagedQuery from "../common/usePagedQuery";

const ORDER_STATUSES = ["PAYMENT_PENDING", "PAYMENT_FAILED", "PENDING", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED", "CANCELLED"];

export default function Orders() {
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState(null);

  const query = usePagedQuery(teamApi.orders, { status, from, to });

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${query.data.totalElements} orders across all restaurants`} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="orders-status-label">Status</InputLabel>
          <Select labelId="orders-status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s}>{s.replace(/_/g, " ")}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          size="small"
          type="date"
          label="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          size="small"
          type="date"
          label="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <OrdersTable query={query} onSelect={setSelected} />
      <OrderDetailDialog order={selected} onClose={() => setSelected(null)} onRefundIssued={() => query.refresh()} />
    </div>
  );
}
