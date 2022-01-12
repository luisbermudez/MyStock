
const { Schema, model } = require("mongoose");

const collectionSchema = new Schema (
    {
        _userCreator: { type: Schema.Types.ObjectId, ref: "User"},
        collectionName: {
            type: String,
            default: "untitledCollection"
            /* mincharacter lenght*/ 
        },
        collectionImage: {
            type: String,
            //default: 
        },
        _collectionItems: [ { type: Schema.Types.ObjectId, ref: "Item" } ]
    }, 
    {
        timestamps: true
    }
);

module.exports = model("Collection", collectionSchema);