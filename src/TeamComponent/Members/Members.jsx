import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
  InputLabel, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { teamApi } from "../api/teamApi";
import { getErrorMessage } from "../../component/config/api";
import { TEAM_ROLES, roleLabel } from "../../component/config/roles";
import PageHeader from "../common/PageHeader";
import StatusChip from "../common/StatusChip";
import { formatDate } from "../common/format";

const EMPTY_FORM = { fullName: "", email: "", password: "", role: "TEAM_MANAGER" };

/** Team account management. Rendered only for TEAM_ADMIN (see TeamRoute). */
export default function Members() {
  const me = useSelector(store => store.auth.user);
  const [members, setMembers] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    teamApi.members()
      .then(setMembers)
      .catch((err) => setError(getErrorMessage(err, "Could not load team members")));
  }, []);

  useEffect(() => { load(); }, [load]);

  const notifyError = (err, fallback) => setToast({ severity: "error", text: getErrorMessage(err, fallback) });

  const create = async () => {
    setSaving(true);
    try {
      const created = await teamApi.createMember(form);
      setToast({ severity: "success", text: `${created.email} added as ${roleLabel(created.role)}.` });
      setOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      notifyError(err, "Could not create the team member");
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (member, role) => {
    try {
      await teamApi.changeMemberRole(member.id, role);
      setToast({ severity: "success", text: `${member.email} is now ${roleLabel(role)}.` });
      load();
    } catch (err) {
      notifyError(err, "Could not change the role");
    }
  };

  const toggleActive = async (member) => {
    try {
      const updated = member.status === "BLOCKED"
        ? await teamApi.reactivateMember(member.id)
        : await teamApi.deactivateMember(member.id);
      setToast({ severity: "success", text: `${updated.email} ${updated.status === "BLOCKED" ? "deactivated" : "reactivated"}.` });
      load();
    } catch (err) {
      notifyError(err, "Could not update the team member");
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!members) return <CircularProgress />;

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Platform team accounts and their roles"
        actions={
          <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setOpen(true)}>
            Add member
          </Button>
        }
      />

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Added</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((m) => {
                const isMe = me?.email?.toLowerCase() === m.email?.toLowerCase();
                return (
                  <TableRow key={m.id} hover>
                    <TableCell>
                      {m.fullName}
                      {isMe && <Typography component="span" variant="caption" color="text.secondary"> (you)</Typography>}
                    </TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select value={m.role} disabled={isMe} onChange={(e) => changeRole(m, e.target.value)}>
                          {TEAM_ROLES.map((r) => <MenuItem key={r} value={r}>{roleLabel(r)}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{formatDate(m.createdAt)}</TableCell>
                    <TableCell><StatusChip value={m.status === "BLOCKED" ? "BLOCKED" : "ACTIVE"} /></TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        disabled={isMe}
                        color={m.status === "BLOCKED" ? "success" : "error"}
                        onClick={() => toggleActive(m)}
                      >
                        {m.status === "BLOCKED" ? "Reactivate" : "Deactivate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={saving ? undefined : () => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add team member</DialogTitle>
        <DialogContent>
          <TextField
            label="Full name" fullWidth margin="normal" value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <TextField
            label="Email" type="email" fullWidth margin="normal" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Temporary password" type="password" fullWidth margin="normal" value={form.password}
            helperText="At least 6 characters. Share it with the member securely."
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="new-member-role">Role</InputLabel>
            <Select labelId="new-member-role" label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {TEAM_ROLES.map((r) => <MenuItem key={r} value={r}>{roleLabel(r)}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button
            variant="contained"
            onClick={create}
            disabled={saving || !form.fullName || !form.email || form.password.length < 6}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </div>
  );
}
