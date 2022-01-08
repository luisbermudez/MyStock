
const { Schema, model } = require("mongoose");

const collectionSchema = new Schema (
    {
        collectionName: {
            type: String,
            default: "untitledCollection"
            /* mincharacter lenght*/ 
        },
        collectionImage: {
            type: String,
            //default: 
        },
        _collectionItems: [String]
    }, 
    {
        timestamps: true
    }
);

module.exports = model("Collection", collectionSchema);