import {
  Alert, Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ownerApi } from "../../component/Partner/partnerApi";
import { getErrorMessage } from "../../component/config/api";
import PayoutDialog from "../../TeamComponent/Payouts/PayoutDialog";
import StatusChip from "../../TeamComponent/common/StatusChip";
import { formatDate, formatMoney } from "../../TeamComponent/common/format";

/** Restaurant owner's earnings and payout history. */
export default function OwnerPayouts() {
  const restaurantId = useSelector(store => store.restaurant.usersRestaurant?.id);
  const [earnings, setEarnings] = useState(null);
  const [payouts, setPayouts] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;
    Promise.all([ownerApi.earnings(restaurantId), ownerApi.payouts(restaurantId)])
      .then(([e, p]) => { setEarnings(e); setPayouts(p); })
      .catch((err) => setError(getErrorMessage(err, "Could not load payouts")));
  }, [restaurantId]);

  const open = (row) => {
    ownerApi.payout(restaurantId, row.id).then(setSelected)
      .catch((err) => setError(getErrorMessage(err, "Could not load the payout")));
  };

  if (error) return <div className="p-5"><Alert severity="error">{error}</Alert></div>;
  if (!earnings || !payouts) return <div className="p-10 flex justify-center"><CircularProgress /></div>;

  const cur = earnings.currency;

  return (
    <div className="lg:px-20 px-5 pb-10">
      <h1 className="text-2xl lg:text-4xl font-bold py-6">Earnings & payouts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Stat title="Awaiting next payout" value={formatMoney(earnings.unsettledNet, cur)}
          detail={`${earnings.unsettledPayments} payments · ${formatMoney(earnings.unsettledGross, cur)} sales − ${formatMoney(earnings.unsettledCommission, cur)} commission`} />
        <Stat title="Payouts in progress" value={formatMoney(earnings.pendingPayouts, cur)} detail="generated, transfer pending" />
        <Stat title="Paid out to date" value={formatMoney(earnings.paidOut, cur)} detail="transferred to your account" />
        <Stat title="Platform commission" value={`${earnings.commissionPercentage}%`} detail="applied to each paid order" />
      </div>

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Period</TableCell>
                <TableCell align="right">Payments</TableCell>
                <TableCell align="right">Sales</TableCell>
                <TableCell align="right">Refunded</TableCell>
                <TableCell align="right">Commission</TableCell>
                <TableCell align="right">Net</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Paid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payouts.map((p) => (
                <TableRow key={p.id} hover sx={{ cursor: "pointer" }} onClick={() => open(p)}>
                  <TableCell>{formatDate(p.periodStart)} – {formatDate(p.periodEnd)}</TableCell>
                  <TableCell align="right">{p.paymentCount}</TableCell>
                  <TableCell align="right">{formatMoney(p.grossAmount, p.currency)}</TableCell>
                  <TableCell align="right">{formatMoney(p.refundedAmount, p.currency)}</TableCell>
                  <TableCell align="right">{formatMoney(p.commissionAmount, p.currency)}</TableCell>
                  <TableCell align="right"><strong>{formatMoney(p.netAmount, p.currency)}</strong></TableCell>
                  <TableCell><StatusChip value={p.status} /></TableCell>
                  <TableCell>{p.paidAt ? `${formatDate(p.paidAt)} · ${p.referenceNumber}` : "—"}</TableCell>
                </TableRow>
              ))}
              {payouts.length === 0 && (
                <TableRow><TableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    No payouts yet. Earnings from paid orders are settled by the platform team by bank transfer.
                  </Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <PayoutDialog payout={selected} canManage={false} onClose={() => setSelected(null)} onChanged={() => {}} onError={setError} />
    </div>
  );
}

function Stat({ title, value, detail }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">{title}</Typography>
        <Typography variant="h5" fontWeight={600}>{value}</Typography>
        <Typography variant="caption" color="text.secondary">{detail}</Typography>
      </CardContent>
    </Card>
  );
}
