import React from "react";
import { Stepper, Step, StepLabel, Box, Typography } from "@mui/material";
import {
  ShoppingCart,
  Settings,
  Receipt,
  Payment,
  CheckCircle
} from "@mui/icons-material";

const BookingProgress = ({ currentStep }) => {
  const steps = [
    { label: "Select Items", icon: <ShoppingCart /> },
    { label: "Service Options", icon: <Settings /> },
    { label: "Review Booking", icon: <Receipt /> },
    { label: "Payment", icon: <Payment /> },
    { label: "Confirmation", icon: <CheckCircle /> }
  ];

  return (
    <Box sx={{ mb: 4,pt:'45px' }}>
      <Stepper 
        activeStep={currentStep - 1} 
        alternativeLabel
        sx={{ 
          '& .MuiStepConnector-line': {
            borderColor: 'primary.main',
            borderWidth: 2
          }
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: index < currentStep - 1 ? 'primary.main' : 
                             index === currentStep - 1 ? 'primary.main' : 'grey.300',
                    color: index < currentStep - 1 ? 'white' : 
                           index === currentStep - 1 ? 'white' : 'grey.700',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  {index < currentStep - 1 ? <CheckCircle /> : step.icon}
                </Box>
              )}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, mt: 1 }}>
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Progress Text */}
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        Step {currentStep} of {steps.length}
      </Typography>
    </Box>
  );
};

export default BookingProgress;