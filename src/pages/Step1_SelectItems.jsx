import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  Box,
  Chip,
  Stack,
  Paper,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Container,
  Pagination
} from "@mui/material";

import {
  Add,
  Remove,
  Category,
  CheckCircle,
  Search,
  Clear
} from "@mui/icons-material";

const ITEMS_PER_PAGE = 12;

const Step1_SelectItems = ({
  bookingData,
  onUpdate,
  onNext,
  inventoryData,
  organizedInventory,
  loading
}) => {
  const { selectedItems, categories } = bookingData;

  const [activeCategory, setActiveCategory] = useState(categories[0] || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const itemsTopRef = useRef(null);

  /* ============================
      FLATTEN INVENTORY
  ============================ */
  const allItemsWithCategory = useMemo(() => {
    return Object.entries(organizedInventory).flatMap(
      ([category, items]) =>
        items.map(item => ({ ...item, __category: category }))
    );
  }, [organizedInventory]);

  /* ============================
      FILTER ITEMS
  ============================ */
  const filteredItems = useMemo(() => {
    let items = [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = allItemsWithCategory.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          (item.description &&
            item.description.toLowerCase().includes(q))
      );
    } else {
      items = organizedInventory[activeCategory] || [];
    }

    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [
    searchQuery,
    allItemsWithCategory,
    activeCategory,
    organizedInventory
  ]);

  /* ============================
      AUTO CATEGORY SWITCH
  ============================ */
  useEffect(() => {
    if (!searchQuery) return;

    const q = searchQuery.toLowerCase();
    const match = allItemsWithCategory.find(
      item =>
        item.name.toLowerCase().includes(q) ||
        (item.description &&
          item.description.toLowerCase().includes(q))
    );

    if (match && match.__category !== activeCategory) {
      setActiveCategory(match.__category);
    }
  }, [searchQuery, allItemsWithCategory, activeCategory]);

  /* ============================
      RESET PAGE
  ============================ */
  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery]);

  /* ============================
      PAGINATION
  ============================ */
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, page]);

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, filteredItems.length);

  /* ============================
      SCROLL TO TOP
  ============================ */
  useEffect(() => {
    if (itemsTopRef.current) {
      itemsTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [page]);

  /* ============================
      ACTION HANDLERS
  ============================ */
  const handleAddItem = (itemID) => {
    const exist = selectedItems.find(i => i.itemID === itemID);

    if (exist) {
      onUpdate({
        selectedItems: selectedItems.map(i =>
          i.itemID === itemID
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      });
    } else {
      const item = inventoryData.find(i => i.itemID === itemID);
      if (item) {
        onUpdate({
          selectedItems: [
            ...selectedItems,
            {
              itemID: item.itemID,
              name: item.name,
              sizeCFT: item.sizeCFT,
              quantity: 1
            }
          ]
        });
      }
    }
  };

  const handleRemoveItem = (itemID) => {
    onUpdate({
      selectedItems: selectedItems
        .map(i =>
          i.itemID === itemID
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    });
  };

  const handleQuantityChange = (itemID, value) => {
    const qty = parseInt(value, 10);
    if (qty === 0) {
      onUpdate({
        selectedItems: selectedItems.filter(i => i.itemID !== itemID)
      });
    } else {
      onUpdate({
        selectedItems: selectedItems.map(i =>
          i.itemID === itemID ? { ...i, quantity: qty } : i
        )
      });
    }
  };

  /* ============================
      TOTALS
  ============================ */
  const totalQuantity = selectedItems.reduce(
    (s, i) => s + i.quantity,
    0
  );

  const totalCFT = selectedItems.reduce(
    (s, i) => s + i.quantity * i.sizeCFT,
    0
  );

  /* ============================
      UI
  ============================ */
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* SEARCH */}
      <Paper sx={{ p: 4, mb: 4, bgcolor: "primary.main", color: "white" }}>
        <Typography fontWeight={700}>Select Your Items</Typography>

        <TextField
          fullWidth
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ bgcolor: "white", borderRadius: 1, mt: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery("")}>
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* CATEGORY */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: "auto" }}>
        {categories.map(cat => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSearchQuery("");
            }}
            color={activeCategory === cat ? "primary" : "default"}
            icon={
              activeCategory === cat
                ? <CheckCircle fontSize="small" />
                : <Category fontSize="small" />
            }
          />
        ))}
      </Stack>

      <Grid container spacing={2}>
        {/* LEFT GRID */}
        <Grid item xs={12} lg={8} ref={itemsTopRef}>
          <Grid container spacing={2}>
            {paginatedItems.map(item => {
              const selected = selectedItems.find(
                i => i.itemID === item.itemID
              );

              return (
   <Grid item xs={12} sm={6} md={3} key={item.itemID}>
  <Card
    sx={{
      height: "100%",
      minHeight: 40, // 🔥 same medium size for all
      display: "flex",
      flexDirection: "column"
    }}
  >
    <CardContent
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Item name */}
        <Typography fontSize="10px" fontWeight={600}>
          {item.name}
        </Typography>
      {/* Push counter to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Counter */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 1, alignItems: "center" }}>
        <IconButton
          disabled={!selected || selected.quantity <= 0}
          onClick={() => handleRemoveItem(item.itemID)}
          sx={{
            bgcolor: "error.light",
            color: "error.main",
            width: 36,
            height: 36
          }}
        >
          <Remove fontSize="small" />
        </IconButton>

        <Box
          sx={{
            width: 40,
            height: 36,
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 500
          }}
        >
          {selected?.quantity ?? 0}
        </Box>
        <IconButton
          onClick={() => handleAddItem(item.itemID)}
          sx={{
            bgcolor: "primary.light",
            color: "primary.main",
            width: 36,
            height: 36
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>
    </CardContent>
  </Card>
</Grid>
              );
            })}
          </Grid>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography fontSize="13px" color="text.secondary">
                Showing {startItem}–{endItem} of {filteredItems.length} items
              </Typography>

              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, v) => setPage(v)}
                size={isMobile ? "small" : "medium"}
                color="primary"
              />
            </Box>
          )}
        </Grid>

        {/* RIGHT PANEL */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 2,
              height: "calc(100vh - 120px)",
              display: "flex",
              flexDirection: "column",
              position: "sticky",
              top: 16
            }}
          >
            <Typography fontWeight={700}>Details of your selected items</Typography>
            <Typography fontSize="13px">
              Total Items: {totalQuantity}
            </Typography>

            <Typography fontSize="13px" color="primary.main">
              Total Volume: {totalCFT.toFixed(1)} CFT
            </Typography>

           <Box sx={{ flex: 1, overflowY: "auto", mt: 2 }}>
             {selectedItems.length === 0 ? (
              <Typography
                textAlign="center"
                color="text.secondary"
                sx={{ mt: 6 }}
              >
      No items selected
    </Typography>
  ) : (
    selectedItems.map(item => (
      <Box key={item.itemID} sx={{ mb: 1.5 }}>
        <Typography fontSize="10px" fontWeight={600}>
          {item.name}
        </Typography>

        {/* Inline counter */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 0.5
          }}
        >
          <Typography fontSize="11px" color="text.secondary">
            Quantity:
          </Typography>

          <IconButton
            size="small"
            disabled={item.quantity <= 0}
            onClick={() => handleRemoveItem(item.itemID)}
            sx={{ width: 24, height: 24,   bgcolor: "error.light"}}
          >
            <Remove fontSize="inherit" />
          </IconButton>

          <Box
            sx={{
              minWidth: 26,
              height: 22,
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 0.5,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 500
            }}
          >
            {item.quantity}
          </Box>

          <IconButton
            size="small"
            onClick={() => handleAddItem(item.itemID)}
            sx={{
              width: 24,
              height: 24,
              bgcolor: "primary.light",
              color: "primary.main"
            }}
          >
            <Add fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
    ))
  )}
          </Box>


            <Button
              fullWidth
              variant="contained"
              disabled={selectedItems.length === 0 || loading}
              onClick={onNext}
            >
              Continue
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step1_SelectItems;
