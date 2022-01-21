const router = require("express").Router();

const { loggedIn, loggedOut } = require("../middleware/route-guard");

const Item = require('../models/Item.model');
const Collection = require('../models/Collection.model');
const mongoose = require("mongoose"); 

const Upload = require('../helper/multer');
const async = require("hbs/lib/async");


router.get('/items', loggedIn, async (req, res, next) => {
    const creatorUser = req.session.currentUser._id;
    let zeroCollections;

    try {
        const collectionsFromDB = await Collection.find({
          _userCreator: creatorUser,
        });

        if (collectionsFromDB.length === 0) {
          zeroCollections = true;
        }

        const itemsFromDB = await Item.find({
          _userCreator: creatorUser,
        }).populate("_ownerCollection");

        res.render("items/items", { items: itemsFromDB, noCollections: zeroCollections });
    } catch(err) {
      console.log(err);
      next(err);
    }
});

router.post("/searchItems", loggedIn, async (req, res, next) => {
  const creatorUser = req.session.currentUser._id;
  const { searchSelection, searchInput } = req.body;

    if (searchSelection === "all") {
      return res.redirect("/items");
    }

    if (searchInput === "") {
      return res.redirect("/items");
    }
      try {
        query = { _userCreator: creatorUser, [searchSelection]: searchInput };
        const searchFromDB = await Item.find(query).populate(
          "_ownerCollection"
        );

        if (searchFromDB.length === 0) {
          const itemsFromDB = await Item.find({
            _userCreator: creatorUser,
          }).populate("_ownerCollection");

          return res.render("items/items", { items: itemsFromDB, zeroItems: true });
        }

        return res.render("items/items", { items: searchFromDB });
      } catch (err) {
        console.log(err);
        next(err);
      }

  return res.redirect("/items");
});

// New item
router.get("/add-new-item", loggedIn, async(req, res, next) => {
  const creatorUser = req.session.currentUser._id;
  try{
    const collectionsFromDB = await Collection.find({
      _userCreator: creatorUser
    });

    if (collectionsFromDB.length === 0) {
      return res.redirect("/items");
    }

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
        if(itemProperties) {
          const newItem = await Item.create({
            _userCreator: creatorUser,
            itemName,
            itemImage: picture,
            _ownerCollection,
            itemQuantity,
            itemPrice,
            itemProperties,
            size,
            itemColor,
          });
          
          await Collection.findByIdAndUpdate(
            { _id: _ownerCollection },
            { $push: { _collectionItems: newItem._id } }
          );
        } else {
          const newItem = await Item.create({
            _userCreator: creatorUser,
            itemName,
            itemImage: picture,
            _ownerCollection,
            itemQuantity,
            itemPrice,
            itemProperties: "false",
          });

          await Collection.findByIdAndUpdate(
            { _id: _ownerCollection },
            { $push: { _collectionItems: newItem._id } }
          );
        }
        
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
    const creatorUser = req.session.currentUser._id;

    let sizeCheck = true;

    try {
        const itemFromDB = await Item.findById(itemId)
          .populate("_ownerCollection");
        const collectionsFromDB = await Collection.find({
          _userCreator: creatorUser,
        });

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
          checkExtraProp();
        } else {
          checkExtraProp();
        }
    } catch(err) {
        console.log(err);
        next(err);
    }

    // Function declaration
    async function checkExtraProp() {
      if (itemProperties) {
        checkSizeValue();
      } else {
        const itemFromDB = await Item.findByIdAndUpdate(
          itemId,
          {
            itemName,
            _ownerCollection,
            itemImage: picture,
            itemQuantity,
            itemPrice,
            itemProperties: "false",
            $unset: {
              size: 1,
              itemColor: 1,
            },
          },
          { new: true }
        );
        checkForDuplicates(_ownerCollection, itemId, itemFromDB);
      }
    }

    async function checkSizeValue() {
      if(size === "null") {
        const itemFromDB = await Item.findByIdAndUpdate(
          itemId,
          {
            itemName,
            _ownerCollection,
            itemImage: picture,
            itemQuantity,
            itemPrice,
            itemProperties,
            size: "null",
            itemColor,
          },
          { new: true }
        );
        checkForDuplicates(_ownerCollection, itemId, itemFromDB);
      } else {
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
        checkForDuplicates(_ownerCollection, itemId, itemFromDB);
      }
    }

    async function checkForDuplicates(collection, itemID, item) {
      try {
        const checkDuplkts = await Collection.findOne({
          _id: collection,
          _collectionItems: itemID,
        });

        if (!checkDuplkts) {
          await Collection.findByIdAndUpdate(
            { _id: _ownerCollection },
            { $push: { _collectionItems: itemId } }
          );
        }
        return res.redirect(`/item/${item._id}`);
      } catch (err) {
        console.log(err);
        next(err);
      }
    }
});

module.exports = router;