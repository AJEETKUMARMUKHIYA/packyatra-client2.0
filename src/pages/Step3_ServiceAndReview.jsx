import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  AccessTime,
  Elevator,
  DirectionsCar,
  CheckCircle,
  CurrencyRupee
} from "@mui/icons-material";
import AxiosClient from "../AxiosClient";
import { set } from "date-fns/set";

/**
 * ✅ Merged Service Options + Review Booking
 * Professional single‑page layout
 */

const Step_ServiceAndReview = ({
  bookingData,
  onUpdate,
  onNext,
  onBack,
  distance,
  shiftingDate,
  timeSlots = [],
  priceCalculateCitywise = "within",
  userId,
  addressId
}) => {
  const [priceLoading, setPriceLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [totalCFT, setTotalCFT] = useState(0);

  const {
    serviceLift,
    selectedFloor,
    vanAccessible,
    roadDistance,
    roadDetails,
    selectedTimeSlot,
    selectedItems
  } = bookingData;

  //  setTotalCFT(selectedItems.reduce(
  //   (sum, item) => sum + item.quantity * (item.sizeCFT || 0),
  //   0
  // ));
useEffect(() => {
  if (!selectedItems || selectedItems.length === 0) {
    setTotalCFT(0);
    onUpdate({ totalCFT: 0 });
    return;
  }

  const calculatedCFT = selectedItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.sizeCFT || 0),
    0
  );

  setTotalCFT(calculatedCFT);

  // ✅ update bookingData in parent
  onUpdate({ totalCFT: calculatedCFT });

}, [selectedItems]);

  useEffect(() => {
    calculatePrice();
  }, [distance, totalCFT, serviceLift, selectedFloor, vanAccessible, roadDistance]);

  const calculatePrice = async () => {
    if (!distance || totalCFT === 0) return;

    try {
      setPriceLoading(true);

      const response = await AxiosClient.get(
        `/Price/GetPrice?distance=${distance}&cftTotal=${totalCFT}&activeTab=${priceCalculateCitywise}`
      );

      let base = response.data.price || 0;
      let floorCharge = serviceLift === "no" ? (selectedFloor || 0) * 200 : 0;
      let roadCharge = vanAccessible === "no" ? 500 : 0;

      const total = base + floorCharge + roadCharge;
      setCalculatedPrice(total);

      onUpdate({ price: total, totalCFT });
    } finally {
      setPriceLoading(false);
    }
  };

  const toggleStyle = {
    py: 1.4,
    borderRadius: 1,
    textTransform: "none",
    fontWeight: 500
  };

  return (
    <Grid container spacing={3}>
      {/* LEFT SECTION */}
      <Grid item xs={12} lg={8}>
        <Stack spacing={3}>
          {/* TIME SLOT */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <AccessTime /> Pickup Time Slot
            </Typography>

            <Grid container spacing={2}>
              {timeSlots.map((slot) => (
                <Grid item xs={6} md={4} key={slot.timeSlotID}>
                  <ToggleButton
                    fullWidth
                    value={slot.timeSlotID}
                    selected={selectedTimeSlot === slot.timeSlotID}
                    onChange={() => onUpdate({ selectedTimeSlot: slot.timeSlotID })}
                    sx={toggleStyle}
                  >
                    {slot.timeSlotName}
                  </ToggleButton>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* SERVICE OPTIONS */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              <Elevator /> Service Options
            </Typography>

            <Stack spacing={3}>
              {/* Lift */}
              <Box>
                <Typography fontWeight={600}>Service lift available?</Typography>
                <ToggleButtonGroup
                  value={serviceLift}
                  exclusive
                  onChange={(e, v) => v && onUpdate({ serviceLift: v })}
                  fullWidth
                >
                  <ToggleButton value="yes" sx={toggleStyle}>Yes</ToggleButton>
                  <ToggleButton value="no" sx={toggleStyle}>No</ToggleButton>
                </ToggleButtonGroup>

                {serviceLift === "no" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography fontWeight={600}>Select Floor</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {[1,2,3,4,5,6,7,8,9,10].map(f => (
                        <ToggleButton
                          key={f}
                          value={f}
                          selected={selectedFloor === f}
                          onChange={() => onUpdate({ selectedFloor: f })}
                          size="small"
                        >
                          {f}
                        </ToggleButton>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>

              {/* Van */}
              <Box>
                <Typography fontWeight={600}>Van accessible to door?</Typography>
                <ToggleButtonGroup
                  value={vanAccessible}
                  exclusive
                  onChange={(e, v) => v && onUpdate({ vanAccessible: v })}
                  fullWidth
                >
                  <ToggleButton value="yes" sx={toggleStyle}>Yes</ToggleButton>
                  <ToggleButton value="no" sx={toggleStyle}>No</ToggleButton>
                </ToggleButtonGroup>

                {vanAccessible === "no" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography fontWeight={600}>Distance from road</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {["0-50m","0-100m","0-150m","0-200m"].map(d => (
                        <ToggleButton
                          key={d}
                          value={d}
                          selected={roadDistance === d}
                          onChange={() => onUpdate({ roadDistance: d })}
                          size="small"
                        >
                          {d}
                        </ToggleButton>
                      ))}
                    </Stack>

                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ mt: 2 }}
                      placeholder="Additional notes"
                      value={roadDetails}
                      onChange={(e) => onUpdate({ roadDetails: e.target.value })}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Grid>

      {/* RIGHT SUMMARY */}
      <Grid item xs={12} lg={4}>
        <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <CurrencyRupee /> Booking Summary
          </Typography>

          {priceLoading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Stack spacing={1.5}>
                <Typography>Distance: {distance} km</Typography>
                <Typography>Total CFT: {totalCFT}</Typography>
                <Divider />

                <Box sx={{ bgcolor: "primary.50", p: 2, borderRadius: 1 }}>
                  <Typography fontWeight={600}>Total Amount</Typography>
                  <Typography variant="h5" color="primary">
                    ₹{calculatedPrice.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Stack>

              <Alert sx={{ mt: 2 }} severity="info">
                Pay 10% now. Balance at pickup.
              </Alert>

              <Stack spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircle />}
                  disabled={!selectedTimeSlot || calculatedPrice === 0}
                  onClick={onNext}
                >
                  Confirm & Proceed
                </Button>

                <Button variant="outlined" onClick={onBack}>
                  Back
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Step_ServiceAndReview;
