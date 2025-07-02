const express = require("express")
const router = express.Router()
var fetchuser = require("../middleware/fetchUser")
const Notes = require("../models/Notes")
const DeletedNotes = require("../models/DeletedNotes")
const { body, validationResult } = require("express-validator")
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

// Route 1 : fetching notes by get route /api/notes/fetchnotes
router.get("/fetchnotes",
    fetchuser,
    async (req, res) => {
        try {
            const notes = await Notes.find({ user: req.user.id })
            res.json(notes)
        }
        catch (error) {
            console.error(error.message)
            res.status(400).send("some error ocuured")
        }
    })

router.get("/fetchdeletednotes",
    fetchuser,
    async (req, res) => {
        try {
            const notes = await DeletedNotes.find({ user: req.user.id })
            res.json(notes)
        }
        catch (error) {
            console.error(error.message)
            res.status(400).send("some error ocuured")
        }
    })

// Route 2 :To add a new note by post method at route /api/notes//addnote
router.post("/addnote",
    fetchuser,
    [
        body("title", "Enter a valid title").isLength({ min: 3 }),
        body("description", "Enter atleast a five character discription").isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            const err = validationResult(req);
            if (!err.isEmpty()) {
                return res.status(400).json({ err: err.array() });
            }
            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const saveNotes = await note.save()
            res.json(saveNotes)
        }
        catch (error) {
            console.error(error.message)
            res.status(400).send("some error ocuured")
        }
    })

// Route 3 :To upadte a note  by put method at route /api/notes//updatnote
router.put("/updatenote/:id",
    fetchuser,
    async (req, res) => {
        try {
            const { title, description, tag } = req.body
            // create a new note object
            const newNote = {};
            if (title) { newNote.title = title }
            if (description) { newNote.description = description }
            if (tag) { newNote.tag = tag }

            // find the note to be updated
            let note = await Notes.findById(req.params.id)
            if (!note) { res.status(404).send("NOT FOUND") }
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("NOT ALLOWED")
            }
            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            res.json(note)
        }
        catch (error) {
            console.error(error.message)
            res.status(400).send("some error ocuured")
        }
    })



// Route 4 :To deleta  a note by delete method at route /api/notes//deletenote
router.delete("/deletenote/:id",
    fetchuser,
    async (req, res) => {
        try {
            // find the note to be deleted and delete
            let note = await Notes.findById(req.params.id)
            if (!note) { res.status(404).send("NOT FOUND") }
            // Allow deletion only if user owns this note
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed")
            }
            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({ "Sucess": "Note has been deleted", note: note })
        }
        catch (error) {
            console.error(error.message)
            res.status(400).send("some error ocuured")
        }
    })
router.delete("/deletenote1/:id",
    fetchuser,
    async (req, res) => {
        try {
            // find the note to be deleted and delete
            let note = await DeletedNotes.findById(req.params.id)
            if (!note) { res.status(404).send("NOT FOUND") }
            // Allow deletion only if user owns this note
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed")
            }
            note = await DeletedNotes.findByIdAndDelete(req.params.id)
            res.json({ "Sucess": "Note has been deleted", note: note })
        }
        catch (error) {
            console.error(error.message)
            res.status(400).send("some error ocuured")
        }
    })

router.post("/fetchANote/:id",
    async (req, res) => {
        try {
            let note = await Notes.findById(req.params.id)
            if (!note) { res.status(404).send("NOT FOUND") }
            res.json({ "Sucess": "Note Fetched", note: note })
        }
        catch (error) {
            console.error(error.message)
            res.status(400).send("some error ocuured")
        }
    })
router.post("/addIntoDelete",
    fetchuser,
    [
        body("title", "Enter a valid title").isLength({ min: 3 }),
        body("description", "Enter atleast a five character discription").isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            const err = validationResult(req);
            if (!err.isEmpty()) {
                return res.status(400).json({ err: err.array() });
            }
            const note = new DeletedNotes({
                title, description, tag, user: req.user.id
            })
            const deletednotes = await note.save()
            res.json(deletednotes)
        }
        catch (error) {
            res.status(400).send("some error ocuured")
        }
    })

router.post("/downloadNote",
    // fetchuser,
    async (req, res) => {
        try {

            const note = req.body;

            const createdDate = new Date('2024-10-17T16:16:12.551Z');

            const doc = new PDFDocument();
            let chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=note.pdf');
                res.send(pdfBuffer);
            });

            const logoPath = path.join(__dirname, '../public/assets/logo2.png');

            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 45, { width: 60 });
            }

            doc
                .fontSize(20)
                .text('iNoteBook', 120, 50);

            doc
                .moveDown()
                .fontSize(12)
                .text(`Created Date: ${createdDate.toISOString().split('T')[0]}`)
                .text(`Email: ${note.email || 'N/A'}`)
                .moveDown();

            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

            doc
                .moveDown()
                .text('This is a note from your iNoteBook application.', { align: 'left' })
                .moveDown()
                .text(`Title: ${note.title || 'No Title'}`)
                .text(`Tag: ${note.tag || 'No Tag'}`)
                .text(`Description: ${note.description || 'No Description'}`);

            doc.end(); 

        }
        catch (error) {
            res.status(400).send("some error ocuured")
        }
    })


module.exports = router
