const { Schema, model } = require("mongoose");

const itemSchema = new Schema ({
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
        enum: [ "Small", "Medium", "Large" ],
        default: "Small"
    }
},
{
    timestamps: true
}
);

module.exports = model("Item", userSchema);