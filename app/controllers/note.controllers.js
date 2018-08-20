const Note = require('../models/note.model.js');

// connecting with zendesk
const zd = require('node-zendesk');
const config = require("./../../zendesk-config.js");

// create uuid
const uuidv1 = require('uuid/v1');

const client = zd.createClient({
    username : config.auth.username,
    token : config.auth.token,
    remoteUri : config.auth.remoteUri
});

/*
Create
*/

exports.create = (req, res) => {
    const query = req.body;
    const user = {
        user: {
            name: query.firstName || "Untitled Note",
            email: `${String.fromCharCode(Math.floor(Math.random() * 26 + 65), Math.floor(Math.random() * 26 + 65),
                Math.floor(Math.random() * 26 + 65))}${"@mail.ru"}`,
            user_fields: {
                firstName: query.firstName || "Untitled Note",
                lastName: query.lastName || "Untitled Note",
                mail: query.mail || "Untitled Note",
                birthDate: query.birthDate || "Untitled Note",
                address:  query.address || "Untitled Note",
                address2: query.address2 || "Untitled Note",
                country: query.country || "Untitled Note",
                city: query.city || "Untitled Note",
                postalCode: query.postalCode || "Untitled Note"
            }
        }
    };
    client.users.create(user, (err, req, result) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note in Zendesk."
            });
            console.log(err);
            return;
        }
        let newNote = {
            _id: result.id,
            firstName: query.firstName || "Untitled Note",
            lastName: query.lastName || "Untitled Note",
            mail: query.mail || "Untitled Note",
            birthDate: query.birthDate || "Untitled Note",
            address:  query.address || "Untitled Note",
            address2: query.address2 || "Untitled Note",
            country: query.country || "Untitled Note",
            city: query.city || "Untitled Note",
            postalCode: query.postalCode || "Untitled Note"
        }
        const note = new Note(newNote);
       
        // Save Note in the database of Zendesk
        note.save().then(data => {
            res.send({ mongoData: data, ZenData: result });
            console.log(JSON.stringify(result, null, 2, true));
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        });
    });
};


/*
    *Retrieve and return all notes from the Mongo
    *Retrieve and return all notes from the  Zendesk
*/


exports.findAll = (req, res) => {
    client.users.list((err, req, result) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note in Zendesk."
            });
            console.log(err);
            return;
        }
        res.send({result: result});
        //console.log(JSON.stringify(result, null, 2, true));
    });
    Note.find()
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId
        });
    });
};

/*
    *Update a note identified by the noteId in the request in Mongo
    *Update a note identified by the noteId in the request In Zendesk
*/

exports.update = (req, res) => {
    const query = req.body;
    const noteId = req.params.noteId;
    const user = {
        user: {
            name: query.firstName || "Untitled Note" + " " + query.lastName || "Untitled Note",
            user_fields: {
                firstName: query.firstName || "Untitled Note",
                lastName: query.lastName || "Untitled Note",
                mail: query.mail || "Untitled Note",
                birthDate: query.birthDate || "Untitled Note",
                address:  query.address || "Untitled Note",
                address2: query.address2 || "Untitled Note",
                country: query.country || "Untitled Note",
                city: query.city || "Untitled Note",
                postalCode: query.postalCode || "Untitled Note"
            }
        }
    };
    client.users.update(noteId, user, (err, data) => {
        err ? console.log(err) : console.log(data);
    })

        Note.findByIdAndUpdate(noteId, {
            firstName: query.firstName || "Untitled Note",
            lastName: query.lastName || "Untitled Note",
            mail: query.mail || "Untitled Note",
            birthDate: query.birthDate || "Untitled Note",
            address:  query.address || "Untitled Note",
            address2: query.address2 || "Untitled Note",
            country: query.country || "Untitled Note",
            city: query.city || "Untitled Note",
            postalCode: query.postalCode || "Untitled Note"
        }, {new: true})
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + query.noteId
                });
            }
            return res.status(200).send({ message: "Updated successfully!" })
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + query.noteId
                });                
            }
            return res.status(500).send({
                message: "Error updating note with id " + query.noteId
            });
        });
};  

/*
    *Delete a note with the specified noteId in the request in Mongo
    *Delete a note with the specified noteId in the request in Zendesk
*/

exports.delete = (req, res) => {
    console.log(req.params.noteId);
    client.users.delete(req.params.noteId,err => console.log(err));
    Note.findByIdAndRemove(req.params.noteId)
        .then(note => {
        res.send({ message: "Note deleted successfully!" });
        })
        .catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
    });
};






