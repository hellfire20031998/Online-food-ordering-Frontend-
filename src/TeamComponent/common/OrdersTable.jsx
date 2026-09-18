import {
  Alert, Box, CircularProgress, Link, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Typography
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import StatusChip from "./StatusChip";
import { formatDateTime, formatMoney, humanize } from "./format";

/**
 * Paged, read-only order table shared by the Orders page and the detail pages.
 * `query` is the object returned by usePagedQuery.
 */
export default function OrdersTable({ query, showRestaurant = true, showCustomer = true, onSelect }) {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage, size, setSize } = query;

  return (
    <Paper variant="outlined">
      {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Placed</TableCell>
              {showRestaurant && <TableCell>Restaurant</TableCell>}
              {showCustomer && <TableCell>Customer</TableCell>}
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.content.map((o) => (
              <TableRow
                key={o.id}
                hover
                sx={{ cursor: onSelect ? "pointer" : "default" }}
                onClick={() => onSelect && onSelect(o)}
              >
                <TableCell>#{o.id}</TableCell>
                <TableCell>{formatDateTime(o.createdAt)}</TableCell>
                {showRestaurant && (
                  <TableCell>
                    {o.restaurantId ? (
                      <Link
                        component="button"
                        underline="hover"
                        onClick={(e) => { e.stopPropagation(); navigate(`/team/restaurants/${o.restaurantId}`); }}
                      >
                        {o.restaurantName || `#${o.restaurantId}`}
                      </Link>
                    ) : "—"}
                  </TableCell>
                )}
                {showCustomer && (
                  <TableCell>
                    {o.customerId ? (
                      <Link
                        component="button"
                        underline="hover"
                        onClick={(e) => { e.stopPropagation(); navigate(`/team/customers/${o.customerId}`); }}
                      >
                        {o.customerName || o.customerEmail || `#${o.customerId}`}
                      </Link>
                    ) : "—"}
                  </TableCell>
                )}
                <TableCell align="right">{o.totalItems ?? o.items?.length ?? 0}</TableCell>
                <TableCell align="right">{formatMoney(o.totalAmount)}</TableCell>
                <TableCell>
                  {humanize(o.paymentMethod)}
                  {o.payment && <div><StatusChip value={o.payment.status} /></div>}
                </TableCell>
                <TableCell><StatusChip value={o.orderStatus} /></TableCell>
              </TableRow>
            ))}
            {!loading && data.content.length === 0 && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    No orders match these filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <TablePagination
        component="div"
        count={data.totalElements}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={size}
        onRowsPerPageChange={(e) => setSize(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Paper>
  );
}
