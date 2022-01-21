const router = require("express").Router();

const { loggedIn, loggedOut } = require("../middleware/route-guard");

const Collection = require('../models/Collection.model');
const Item = require('../models/Item.model');
const mongoose = require("mongoose"); 

const Upload = require('../helper/multer');
const async = require("hbs/lib/async");


//Collections
router.get('/collection', loggedIn, async (req,res,next) => {
    const creatorUser = req.session.currentUser._id;
    try{
        const collectionsFromDB = await Collection.find({
            _userCreator: creatorUser
        })
        return res.render('collections/collection', {collections: collectionsFromDB})
    }catch(err){
    console.log("error", err);
    next(err)
    }
});

//add collection
router.get('/collection-add', loggedIn, (req,res, next) =>{
    res.render('collections/collection-add')
});

router.post('/collection-add', Upload.fields([
    { name: "collectionImage", maxCount: 1},
    { name: "itemImage", maxCount: 1},
]), async (req,res,next) => {
    const { collectionName, 
            itemName,
            _ownerCollection,
            addNewItem,
            itemQuantity, 
            itemPrice, 
            itemProperties, 
            size, 
            itemColor } = req.body;
    const creatorUser = req.session.currentUser._id;

    let pictureForNewCollection = req.files.collectionImage[0].path;

    try{
        const newCollectionforDTB = new Collection({
          _userCreator: creatorUser,
          collectionName,
          collectionImage: pictureForNewCollection,
        });

        newCollectionforDTB.save( async (err, res) => {
            if(err) {
                console.log(err);
            } else {
                console.log(res);
                if (addNewItem) {
                    let pictureForNewItem = req.files.itemImage[0].path;
                  let collectionId = res._id.toString();
                console.log("Test", collectionId);
                    try {
                        const newItemforDB = await Item.create({
                          _ownerCollection: collectionId,
                          _userCreator: creatorUser,
                          itemImage: pictureForNewItem,
                          itemName,
                          itemQuantity,
                          itemPrice,
                          itemProperties,
                          size,
                          itemColor,
                        });

                        await Collection.findByIdAndUpdate(
                          { _id: newCollectionforDTB._id },
                          { $push: { _collectionItems: newItemforDB._id } }
                        );
                    } catch(err) {
                        console.log("Catch error: ", err);
                    }
                }
            }
        });
        
        return res.redirect('/collection');
    } catch(err){
        console.log(err);
        next(err);
    }
})

//details
router.get('/collection/:collectionId', loggedIn, async(req,res,next) =>{
    const { collectionId } = req.params;

    try{
        const collectionsFromDB = await Collection.findById(collectionId)
        .populate("_collectionItems")
        return res.render('collections/collection-details', { collections: collectionsFromDB });
    }catch(err) {
        console.log(err);
        next(err);
    }
    
});

//deletecollection
router.post('/collection/:collectionsId/delete', async (req, res, next) =>{
    const { collectionsId } =req.params;

    try{
        await Collection.findByIdAndDelete(collectionsId);
        await Item.deleteMany({ _ownerCollection: collectionsId });
        res.redirect('/collection');
    }catch(err){
        console.log(err);
        next(err);
}})

//edit collection
router.get('/edit-collection/:collectionId', loggedIn, async(req,res,next) => {
    const { collectionId } = req.params;
    try{
        const collectionFromDB = await Collection.findById(
            collectionId,
        )

        const itemsFromDB = await Item.find({ _ownerCollection: collectionId });

        res.render("collections/edit-collection", {
          collections: collectionFromDB,
          items: itemsFromDB,
        });
    }catch(err){
        console.log(err)
        next(err);
    }
});

router.post('/edit-collection/:collectionId', Upload.single("collectionImage"), loggedIn, async (req, res, next) => {
    const { collectionId } = req.params;
    const { collectionName } = req.body
    let picture;

    try{
        if(req.file) {
            picture = req.file.path;
            const collectionFromDB = await Collection.findByIdAndUpdate(
              collectionId,
              {
                collectionName,
                collectionImage: picture,
              },
              { new: true }
            );

            return res.redirect(`/collection/${collectionFromDB._id}`);
        }else{
            const collectionFromDB = await Collection.findByIdAndUpdate(
                collectionId,
                {
                    collectionName
                },
                { new: true }
            );

            return res.redirect(`/collection/${collectionFromDB._id}`);
        }
    } catch(err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;