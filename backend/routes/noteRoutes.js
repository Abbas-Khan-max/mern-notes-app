const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getNotes,
  getTrash,
  createNote,
  updatedNote,
  deletedNote,
  permanentDeleteNote,
  emptyTrash
} = require("../controllers/noteController");

// Get active notes
router.get("/", protect, getNotes);

// Get the logged-in user's trash
router.get("/trash", protect, getTrash);

// Create a note
router.post("/", protect, createNote);

// Update a note
router.put("/:id", protect, updatedNote);

// Empty the logged-in user's trash
router.delete("/trash/empty", protect, emptyTrash);

// Permanently delete one note
router.delete("/:id/permanent", protect, permanentDeleteNote);

// Move a note to Trash
router.delete("/:id", protect, deletedNote);

module.exports = router;