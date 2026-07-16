import React from "react";
import {
  Grid,
  Typography,
  Button,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Box,
  Stack,
  Paper,
  Fade,
  List,
  ListItemButton,
  ListItemText,
  Divider
} from "@mui/material";
import { Elevator, AccessTime,Add } from "@mui/icons-material";


const Step2_ServiceOptions = ({
  bookingData,
  onUpdate,
  onNext,
  onBack,
  distance,
  timeSlots
}) => {
  const {
    serviceLift,
    selectedFloor,
    serviceLiftdrop,
    floordrop,
    vanAccessible,
    roadDistance,
    roadDetails,
    selectedTimeSlot,
    fromAddress,
    toAddress
  } = bookingData;

  /* ======================
     PRICE CONFIG
  ====================== */
  const FLOOR_PRICE = 200;
  
  const LIFT_NOT_AVAILABLE_PRICE = 500;
  
  /* ======================
     PRICE CALCULATION
  ====================== */
  
  const calculateExtraCharge = (distance) => {
  if (!distance) return 0;
  return (distance / 50) * 200;
};




 const handlePickupLiftChange = (e, value) => {
    if (value !== null) {
      onUpdate({
        serviceLift: value,
      //  selectedFloor: value === "yes" ? null : selectedFloor
      });
    }
  };

  const handleDropLiftChange = (e, value) => {
    if (value !== null) {
      onUpdate({
        serviceLiftdrop: value,
      //  floordrop: value === "yes" ? null : floordrop
      });
    }
  };


  // Calculate total CFT
const totalCFT = bookingData.selectedItems.reduce(
  (sum, item) => sum + (item.quantity * (item.sizeCFT || 0)),
  0
);

// Function to get floor charge when lift NOT available
function getFloorCharge(totalCFT, floor) {

  const priceTable = {
    2: { small: 1500, medium: 2000, large: 3000 },
    3: { small: 2500, medium: 3500, large: 4000 },
    4: { small: 3000, medium: 4000, large: 4500 },
    5: { small: 4000, medium: 5000, large: 5500 }
  };

  let slab;

  if (totalCFT <= 300) slab = "small";
  else if (totalCFT <= 800) slab = "medium";
  else slab = "large";

  if (floor >= 2 && floor <= 5) {
    return priceTable[floor][slab];
  }

  if (floor > 5) {
    const basePrice = priceTable[5][slab];
    const extraFloors = floor - 5;
    return basePrice + (extraFloors * 1000);
  }

  return 0;
}

/* -------------------------
   Pickup Floor Charge
-------------------------- */

  const pickupFloorCharge = serviceLift === "yes"
  ? (selectedFloor ? selectedFloor * FLOOR_PRICE : 0)
  : getFloorCharge(totalCFT, selectedFloor);
 
/* -------------------------
   Drop Floor Charge
-------------------------- */

const dropFloorCharge = serviceLiftdrop === "yes" 
  ? (floordrop ? floordrop * FLOOR_PRICE : 0)
  : getFloorCharge(totalCFT, floordrop);
  
  // const pickupFloorCharge =
  //   selectedFloor ? selectedFloor * FLOOR_PRICE : 0;

  // const dropFloorCharge =
  //   floordrop ? floordrop * FLOOR_PRICE : 0;

  const pickupLiftCharge =
    serviceLift === "no" ? LIFT_NOT_AVAILABLE_PRICE : 0;

  const dropLiftCharge =
    serviceLiftdrop === "no" ? LIFT_NOT_AVAILABLE_PRICE : 0;

  const VanAccessCharge =
  vanAccessible === "no"
    ? calculateExtraCharge(roadDistance): 0;

  const totalExtraCharge =
    pickupFloorCharge +
    dropFloorCharge +
    pickupLiftCharge +
    dropLiftCharge+ 
    VanAccessCharge;


  /* ======================
     HANDLERS (RESTORED LOGIC)
  ====================== */

 
  const handlePickupFloorSelect = (floor) =>
    onUpdate({ selectedFloor: floor });

  const handleDropFloorSelect = (floor) =>
    onUpdate({ floordrop: floor });

  const handleTimeSlotChange = (id) =>
    onUpdate({ selectedTimeSlot: id });

  const handleVanAccessChange = (e, value) => {
    if (value !== null) {
      onUpdate({ vanAccessible: value });
      if (value === "yes") {
        onUpdate({ roadDistance: null, roadDetails: "" });
      }
    }
  };

  const handleRoadDistanceSelect = (dist) =>
    onUpdate({ roadDistance: dist });

  const handleRoadDetailsChange = (e) =>
    onUpdate({ roadDetails: e.target.value });

  const isNextDisabled =
    !selectedTimeSlot || !vanAccessible;

  const toggleStyle = {
    py: 1.2,
    borderRadius: 1,
    textTransform: "none",
    fontWeight: 500,
    "&.Mui-selected": {
      backgroundColor: "#1976d2",
      color: "#fff",
    }
  };
const parseTime = (label) => {
  const [hour, period] = label.split(' ');
  return { hour, period };
};

  /* ======================
     UI
  ====================== */

  return (
   <Grid container spacing={2}>
      {/* LEFT SECTION */}
      <Grid item xs={12} lg={8}>
        <Stack spacing={3}>

          {/* TIME SLOT */}
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
  <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
    <AccessTime /> Select pickup time slot
  </Typography>

    {['AM', 'PM'].map(period => (
    <Box key={period} sx={{ mb: 2 }}>
      <Typography sx={{ fontWeight: 600, mb: 0.8 }}>
        {period === 'AM' ? '☀️ Morning' : '🌤 Afternoon'}
      </Typography>

      <Grid container spacing={1}>
        {timeSlots
          ?.filter(slot => slot.timeSlotName.includes(period))
          .map(slot => {
            const { hour } = parseTime(slot.timeSlotName);
            const isSelected = selectedTimeSlot === slot.timeSlotID;

            return (
              <Grid item xs={3} sm={2} md={1.5} key={slot.timeSlotID}>
                <Paper
                  onClick={() => handleTimeSlotChange(slot.timeSlotID)}
                  elevation={isSelected ? 3 : 0}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isSelected
                      ? '2px solid #1976d2'
                      : '1px solid #e0e0e0',
                    backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: 2,
                    },
                  }}
                >
                  <AccessTime
                    sx={{
                      fontSize: 16,
                      mb: 0,
                      color: isSelected
                        ? '#1976d2'
                        : 'text.secondary',
                    }}
                  />

                  <Typography fontWeight={600} fontSize={13} lineHeight={1}>
                    {hour}
                  </Typography>

                  <Typography
                    variant="caption"
                    fontSize={9}
                    lineHeight={1}
                    color="text.secondary"
                  >
                    {period}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  ))}
</Paper>

          {/* PICKUP */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              <Elevator /> Pickup location
            </Typography>

            <Typography sx={{ mt: 2 }}>
              Service lift available?
            </Typography>

            <ToggleButtonGroup
              exclusive
              fullWidth
              value={serviceLift}
              onChange={handlePickupLiftChange}
              sx={{ mt: 1 }}
            >
              <ToggleButton value="yes" sx={toggleStyle}>
                Yes
              </ToggleButton>
              <ToggleButton value="no" sx={toggleStyle}>
                No
              </ToggleButton>
            </ToggleButtonGroup>

            {(
  <Box sx={{ mt: 2 }}>
  <Typography fontWeight={500} mb={1}>
    Select pickup floor
  </Typography>

  <Box
    sx={{
      maxHeight: 150,
      overflowY: "auto",
      border: "1px solid #ddd",
      borderRadius: 2,
    }}
  >
    <List disablePadding>
      <ListItemButton
        selected={selectedFloor === 0}
        onClick={() => handlePickupFloorSelect(0)}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
               color: "white",
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#bbdefb',
            },
          }}
      >
        <ListItemText primary="Ground Floor" />
      </ListItemButton>

      {[...Array(50)].map((_, i) => (
        <ListItemButton
          key={i}
          selected={selectedFloor === i + 1}
          onClick={() => handlePickupFloorSelect(i + 1)}
            sx={{
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
               color: "white",
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#bbdefb',
            },
          }}
        >
          <ListItemText primary={`Floor ${i + 1}`} />
        </ListItemButton>
      ))}
    </List>
  </Box>
  </Box> )}
          </Paper>
        </Stack>
      </Grid>
        <Grid item xs={12} lg={8}>
                 {/* DROP */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              <Elevator /> Drop location
            </Typography>

            <Typography sx={{ mt: 2 }}>
              Service lift available?
            </Typography>

            <ToggleButtonGroup
              exclusive
              fullWidth
              value={serviceLiftdrop}
              onChange={handleDropLiftChange}
              sx={{ mt: 1 }}
            >
              <ToggleButton value="yes" sx={toggleStyle}>
                Yes
              </ToggleButton>
              <ToggleButton value="no" sx={toggleStyle}>
                No
              </ToggleButton>
            </ToggleButtonGroup>

            {(
     
    <Box sx={{ mt: 2 }}>
        <Typography fontWeight={500} mb={1}>
         Select drop floor
       </Typography>

  <Box
    sx={{
      maxHeight: 150,
      overflowY: "auto",
      border: "1px solid #ddd",
      borderRadius: 2,
  
    }}
  >
    <List disablePadding>
      <ListItemButton
        selected={floordrop === 0}
        onClick={() => handleDropFloorSelect(0)}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
               color: "white",
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#bbdefb',
            },
          }}
      >
        <ListItemText primary="Ground Floor" />
      </ListItemButton>

      {[...Array(50)].map((_, i) => (
        <ListItemButton
          key={i}
          selected={floordrop === i + 1}
          onClick={() => handleDropFloorSelect(i + 1)}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
               color: "white",
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#bbdefb',
            },
          }}
        >
          <ListItemText primary={`Floor ${i + 1}`} />
        </ListItemButton>
      ))}
    </List>
  </Box>
</Box>

            )}
          </Paper>
          {/* VAN ACCESS */}
          <Paper sx={{ p: 3 }}>
            <Typography fontWeight={600}>
              Van accessible to door?
            </Typography>

            <ToggleButtonGroup
              exclusive
              fullWidth
              value={vanAccessible}
              onChange={handleVanAccessChange}
              sx={{ mt: 1 }}
            >
              <ToggleButton value="yes" sx={toggleStyle}>
                Yes
              </ToggleButton>
              <ToggleButton value="no" sx={toggleStyle}>
                No
              </ToggleButton>
            </ToggleButtonGroup>
            {vanAccessible === "no" && (
              <Fade in>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {["0-50m","0-100m","0-150m","0-200m"].map(d => (
                      <Grid item xs={6} key={d}>
                        <ToggleButton
                          value={d}   
                          fullWidth
                          size="small"
                          sx={toggleStyle}
                          selected={roadDistance === d}
                          onChange={() => handleRoadDistanceSelect(d)
                            
                          }
                        >
                          {d}
                        </ToggleButton>
                      </Grid>
                    ))}
                  </Grid>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ mt: 2 }}
                    placeholder="Additional details"
                    value={roadDetails}
                    onChange={handleRoadDetailsChange}
                  />
                </Box>
              </Fade>
            )}
          </Paper>
              {/* SUMMARY */}
         <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
          <Typography variant="h6" fontWeight={600}>
            Service summary
          </Typography>
          <Divider sx={{ my: 2 }} />
         <Typography>
           Pickup address: {fromAddress}
          </Typography>

          <Typography>
            Drop-off address: {toAddress}
          </Typography>
          {/* <Typography>
            Pickup floor charge: ₹{pickupFloorCharge}
          </Typography>

          <Typography>
            Drop floor charge: ₹{dropFloorCharge}
          </Typography> */}

          {pickupLiftCharge > 0 && (
            <Typography>
             {/* // Pickup lift not available: ₹500 */}
              Lift available at pickup location: No
            </Typography>
          )}
          
          {pickupLiftCharge == 0 && (
            <Typography>
             {/* // Pickup lift not available: ₹500 */}
              Lift available at pickup Location: Yes
            </Typography>
          )}
          {dropLiftCharge > 0 && (
            <Typography>
             {/* // Drop lift not available: ₹500 */}
             Lift available at drop-off location: No
            </Typography>
          )}
           {dropLiftCharge == 0 && (
            <Typography>
              Lift available at drop-off location: Yes
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* <Typography fontWeight={700}>
            Total extra charge: ₹{totalExtraCharge}
          </Typography> */}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={onBack}>
              Back to item selection page
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={onNext}
              disabled={isNextDisabled}
            >
              Service confirmation
            </Button>
          </Stack>
        </Paper>
        </Grid> 
    </Grid>
  );
};

export default Step2_ServiceOptions;
