const router = require("express").Router();

const { loggedIn, loggedOut } = require("../middleware/route-guard");

const Item = require('../models/Item.model');
const mongoose = require("mongoose"); 

const Upload = require('../helper/multer');


router.get('/items', loggedIn, async (req, res, next) => {

    try {
        const itemsFromDB = await Item.find();

        res.render("user/items", { items: itemsFromDB });
    } catch(err) {

    }
});

router.get("/add-new-item", loggedIn, (req, res, next) => res.render('user/addNewItem'));

router.post('/add-new-item', Upload.single("itemImage"), async (req, res, next) => {
    const { itemName, itemQuantity, itemPrice, itemProperties, size, itemColor } = req.body;

    let picture = req.file.path;

    try {
        const newItem = await Item.create({
          itemName,
          itemImage: picture,
          itemQuantity,
          itemPrice,
          itemProperties,
          size,
          itemColor
        });

        res.redirect('/items')
    } catch(err) {
        console.log(err);
        next(err);
    }

})

module.exports = router;