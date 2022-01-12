const router = require("express").Router();

const { loggedIn, loggedOut } = require("../middleware/route-guard");

const Item = require('../models/Item.model');
const Collection = require('../models/Collection.model');
const mongoose = require("mongoose"); 

const Upload = require('../helper/multer');
const async = require("hbs/lib/async");


router.get('/items', loggedIn, async (req, res, next) => {
    const creatorUser = req.session.currentUser._id;
    try {
        const itemsFromDB = await Item.find({ _userCreator: creatorUser });
        console.log(req.session.currentUser._id)
        res.render("items/items", { items: itemsFromDB });
    } catch(err) {
      console.log(err);
      next(err);
    }
});

// New item
router.get("/add-new-item", loggedIn, async(req, res, next) => {
  const creatorUser = req.session.currentUser._id;
  try{
    const collectionsFromDB = await Collection.find({
      _userCreator: creatorUser
    });
    res.render('items/addNewItem', { collectionsList: collectionsFromDB })
  }catch(err) {
    console.log(err);
    next(err);
}
});

router.post('/add-new-item', Upload.single("itemImage"), async (req, res, next) => {
    const { itemName, _ownerCollection, itemQuantity, itemPrice, itemProperties, size, itemColor } = req.body;
    const creatorUser = req.session.currentUser._id;
    let picture = req.file.path;

    try {
        const newItem = await Item.create({
          _userCreator: creatorUser,
          itemName,
          itemImage: picture,
          _ownerCollection,
          itemQuantity,
          itemPrice,
          itemProperties,
          size,
          itemColor
        });
          let collectionUpdated = await Collection.findByIdAndUpdate({ _id: _ownerCollection}, {$push: { _collectionItems: newItem._id } });
        return res.redirect('/items');
    } catch(err) {
        console.log(err);
        next(err);
    }

});

//Item details
router.get("/item/:itemId", loggedIn, async (req, res, next) => {
    const { itemId } = req.params;
    let sizeCheck = true;

    try {
        const itemFromDB = await Item.findById(itemId)
          .populate("_ownerCollection");

        console.log(itemFromDB._ownerCollection);
        if (itemFromDB.size === "null") {
          sizeCheck = false;
        }
        return res.render("items/itemsDetails", {
          theItem: itemFromDB,
          size: sizeCheck,
        });
    } catch(err) {
        console.log(err);
        next(err);
    }
    
});

// Item delete
router.post("/item/:itemId/delete", async (req, res, next) => {
    const { itemId } = req.params;

    try {
        await Item.findByIdAndDelete(itemId);
        res.redirect('/items');
    } catch(err) {
        console.log(err);
        next(err);
    }
});


router.get("/item/:itemId/edit", loggedIn, async (req, res, next) => {
    const { itemId } = req.params;
    let sizeCheck = true;

    try {
        const itemFromDB = await Item.findById(itemId)
          .populate("_ownerCollection");
        const collectionsFromDB = await Collection.find();

        if (itemFromDB.size === "null") {
          sizeCheck = false;
        }
        return res.render("items/itemsEdit", {
          theItem: itemFromDB,
          theCollections: collectionsFromDB,
          size: sizeCheck,
        });
    } catch(err) {
        console.log(err);
        next(err);
    }
});

router.post("/item/:itemId/edit", Upload.single("itemImage"), loggedIn, async (req, res, next) => {
    const { itemId } = req.params;
    const { itemName,
        _ownerCollection,
        itemQuantity, 
        itemPrice, 
        itemProperties, 
        size, 
        itemColor 
    } = req.body;
    let picture;

    try {
        if (req.file) {
          picture = req.file.path;

          const itemFromDB = await Item.findByIdAndUpdate(
            itemId,
            {
              itemName,
              _ownerCollection,
              itemImage: picture,
              itemQuantity,
              itemPrice,
              itemProperties,
              size,
              itemColor,
            },
            { new: true }
          );
          return res.redirect(`/item/${itemFromDB._id}`);
        } else {
            const itemFromDB = await Item.findByIdAndUpdate(
              itemId,
              {
                itemName,
                _ownerCollection,
                itemQuantity,
                itemPrice,
                itemProperties,
                size,
                itemColor,
              },
              { new: true }
            );
            return res.redirect(`/item/${itemFromDB._id}`);
        }
    } catch(err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;