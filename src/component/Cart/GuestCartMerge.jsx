import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isTeamRole } from "../config/roles";
import { mergeGuestCart } from "../State/Cart/Action";
import { hasGuestItems, loadGuestCart } from "./guestCart";

/**
 * Runs once after sign-in when the browser holds a visitor cart. If the account cart is empty the
 * items are carried over silently; otherwise the user chooses how to combine the two.
 */
export default function GuestCartMerge() {
  const dispatch = useDispatch();
  const user = useSelector(store => store.auth.user);
  const cart = useSelector(store => store.cart.cart);

  const [prompt, setPrompt] = useState(null); // { sameRestaurant, serverName, guestName, count }
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done || !user || isTeamRole(user.role)) return;
    if (!hasGuestItems()) { setDone(true); return; }
    // Wait until the account cart has been fetched (the store may still hold the guest view).
    if (!cart || cart.guest || cart.id == null) return;

    const guest = loadGuestCart();
    const guestFood = guest.items[0]?.food;
    if ((cart.items || []).length === 0) {
      setDone(true);
      run("MERGE");
      return;
    }
    setPrompt({
      sameRestaurant: cart.restaurantId === guestFood?.restaurantId,
      serverName: cart.restaurantName,
      guestName: guestFood?.restaurantName,
      count: guest.items.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cart, done]);

  const run = async (strategy) => {
    setBusy(true);
    const result = await dispatch(mergeGuestCart(strategy));
    setBusy(false);
    setPrompt(null);
    setDone(true);
    if (result.success) {
      if (strategy === "KEEP_SERVER") {
        setToast({ severity: "info", text: "Kept your saved cart." });
      } else if (result.skipped.length > 0) {
        const names = result.skipped.map((s) => s.name || `item #${s.foodId}`).join(", ");
        setToast({ severity: "warning", text: `Cart carried over. Not added: ${names}.` });
      } else {
        setToast({ severity: "success", text: "Your cart has been carried over." });
      }
    } else if (result.conflict) {
      // Should not happen through this dialog, but keep the cart consistent if it does.
      setToast({ severity: "error", text: "The carts are from different restaurants. Please choose again." });
      setDone(false);
    } else {
      setToast({ severity: "error", text: result.message });
    }
  };

  return (
    <>
      <Dialog open={Boolean(prompt)} onClose={busy ? undefined : () => run("KEEP_SERVER")} maxWidth="xs" fullWidth>
        <DialogTitle>You already have a cart</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {prompt?.sameRestaurant
              ? `Your saved cart and the ${prompt?.count} item${prompt?.count === 1 ? "" : "s"} you just picked are both from ${prompt?.serverName}. What would you like to do?`
              : `Your saved cart is from ${prompt?.serverName}, but the ${prompt?.count} item${prompt?.count === 1 ? "" : "s"} you just picked are from ${prompt?.guestName}. A cart can hold one restaurant at a time.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ flexWrap: "wrap", gap: 1 }}>
          <Button onClick={() => run("KEEP_SERVER")} disabled={busy}>Keep saved cart</Button>
          <Button onClick={() => run("REPLACE")} disabled={busy} color="warning">Use the new items</Button>
          {prompt?.sameRestaurant && (
            <Button onClick={() => run("MERGE")} disabled={busy} variant="contained">Keep both</Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={5000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
      </Snackbar>
    </>
  );
}
