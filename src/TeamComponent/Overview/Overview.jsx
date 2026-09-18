import {
  Alert, Card, CardContent, CardHeader, Chip, CircularProgress, Link, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import PageHeader from "../common/PageHeader";
import StatusChip from "../common/StatusChip";
import { formatDate, formatMoney, humanize } from "../common/format";

export default function Overview() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    teamApi.summary()
      .then(setSummary)
      .catch((err) => setError(getErrorMessage(err, "Could not load the dashboard")));
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!summary) return <CircularProgress />;

  const currency = summary.currency || "INR";
  const money = (v) => formatMoney(v, currency);

  return (
    <div>
      <PageHeader title="Overview" subtitle="Platform-wide activity across all restaurants and customers" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Stat
          title="Restaurants"
          value={summary.totalRestaurants}
          detail={`${summary.activeRestaurants} active · ${summary.suspendedRestaurants} suspended · ${summary.openRestaurants} open now`}
          onClick={() => navigate("/team/restaurants")}
        />
        <Stat
          title="Applications"
          value={summary.pendingApplications}
          detail="awaiting review"
          onClick={() => navigate("/team/applications")}
        />
        <Stat
          title="Customers"
          value={summary.totalCustomers}
          detail={`${summary.newCustomersLast7Days} new in 7 days · ${summary.blockedCustomers} blocked`}
          onClick={() => navigate("/team/customers")}
        />
        <Stat
          title="Orders today"
          value={summary.ordersToday}
          detail={`${money(summary.revenueToday)} revenue`}
          onClick={() => navigate("/team/orders")}
        />
        <Stat
          title="Orders, last 7 days"
          value={summary.ordersLast7Days}
          detail={`${money(summary.revenueLast7Days)} revenue · ${summary.totalOrders} all time`}
          onClick={() => navigate("/team/orders")}
        />
        <Stat
          title="Refunds awaiting action"
          value={summary.openRefunds}
          detail="requested or awaiting transfer"
          onClick={() => navigate("/team/refunds")}
        />
        <Stat
          title="Pending payouts"
          value={summary.pendingPayouts}
          detail={`${money(summary.pendingPayoutsAmount)} to transfer`}
          onClick={() => navigate("/team/payouts")}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card variant="outlined">
          <CardHeader title="Orders by status" titleTypographyProps={{ variant: "subtitle1" }} />
          <CardContent>
            <Stack spacing={1}>
              {Object.entries(summary.ordersByStatus || {}).map(([status, count]) => (
                <Stack key={status} direction="row" justifyContent="space-between" alignItems="center">
                  <StatusChip value={status} />
                  <Typography variant="body2">{count}</Typography>
                </Stack>
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
              Platform commission: {summary.commissionPercentage}% · Currency: {currency}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader title="Top restaurants, last 30 days" titleTypographyProps={{ variant: "subtitle1" }} />
          <CardContent sx={{ pt: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Restaurant</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(summary.topRestaurantsLast30Days || []).map((r) => (
                  <TableRow key={r.restaurantId} hover>
                    <TableCell>
                      <Link component="button" underline="hover" onClick={() => navigate(`/team/restaurants/${r.restaurantId}`)}>
                        {r.name}
                      </Link>
                    </TableCell>
                    <TableCell align="right">{r.orderCount}</TableCell>
                    <TableCell align="right">{money(r.revenue)}</TableCell>
                  </TableRow>
                ))}
                {(summary.topRestaurantsLast30Days || []).length === 0 && (
                  <TableRow><TableCell colSpan={3}><Typography variant="body2" color="text.secondary">No orders yet.</Typography></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader title="Newest customers" titleTypographyProps={{ variant: "subtitle1" }} />
          <CardContent sx={{ pt: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(summary.recentCustomers || []).map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Link component="button" underline="hover" onClick={() => navigate(`/team/customers/${c.id}`)}>
                        {c.fullName || c.email}
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(c.createdAt)}</TableCell>
                    <TableCell><StatusChip value={c.status} /></TableCell>
                  </TableRow>
                ))}
                {(summary.recentCustomers || []).length === 0 && (
                  <TableRow><TableCell colSpan={3}><Typography variant="body2" color="text.secondary">No customers yet.</Typography></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 3 }}>
        Revenue excludes {humanize("CANCELLED").toLowerCase()} orders.
      </Typography>
    </div>
  );
}

function Stat({ title, value, detail, onClick }) {
  return (
    <Card variant="outlined" sx={{ cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      <CardContent>
        <Typography variant="overline" color="text.secondary">{title}</Typography>
        <Typography variant="h4" fontWeight={600}>{value}</Typography>
        <Chip label={detail} size="small" variant="outlined" sx={{ mt: 1, maxWidth: "100%" }} />
      </CardContent>
    </Card>
  );
}
