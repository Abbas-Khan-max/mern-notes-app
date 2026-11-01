const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user,
      isTrashed: false
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message
    }); 
  }
};

const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({
      message: "Title and description are required"
    });
  }

    const newNote = await Note.create({
      title: title.trim(),
      description: description.trim(),
      user: req.user
    });

    res.status(201).json(newNote);

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: error.message
    });
  }
};

const updatedNote = async (req, res) => {
  try {
    // Fields that users are allowed to update
    const allowedFields = ["title", "description", "isTrashed"];
    const updates = {};

    // Copy only allowed fields from req.body
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Reject requests that contain no allowed fields
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided"
      });
    }

    // Find and update the note only if the user owns it
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user
      },
      updates,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found!"
      });
    }

    return res.json(updatedNote);

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid note ID"
      });
    }

    return res.status(500).json({
      message: error.message
    });
  }
};

const deletedNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user
      },
      {
        isTrashed: true
      },
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found!"
      });
    }

    res.json(deletedNote);

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid note ID"
      });
    }

    res.status(500).json({
      message: error.message
    });
  }
};

const permanentDeleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found!"
      });
    }

    res.json(deletedNote);

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid note ID"
      });
    }

    res.status(500).json({
      message: error.message
    });
  }
};

const getTrash = async (req, res) => {
  try {
    const trash = await Note.find({
      user: req.user,
      isTrashed: true
    });

    res.json(trash);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const emptyTrash = async (req, res) => {
  try {
    const result = await Note.deleteMany({
      user: req.user,
      isTrashed: true
    });

    res.json({
      message: "Trash emptied successfully!",
      deletedCount: result.deletedCount
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getNotes,
  createNote,
  updatedNote,
  deletedNote,
  getTrash,
  permanentDeleteNote,
  emptyTrash
};