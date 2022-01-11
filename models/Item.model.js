const { Schema, model } = require("mongoose");

const itemSchema = new Schema ({
    _ownerCollection: { type: Schema.Types.ObjectId, ref: "Collection"},
    itemName: {
        type: String,
        required:true
    },
    itemImage: {
        type: String,
        required: true
    },
    itemQuantity: {
        type: Number, 
        required: true
    },
    itemPrice: Number,
    itemProperties: Boolean,
    size: {
        type: String,
        enum: [ "Small", "Medium", "Large", "null" ],
        // default: "Small"
    },
    itemColor: String
},
{
    timestamps: true
}
);

module.exports = model("Item", itemSchema);