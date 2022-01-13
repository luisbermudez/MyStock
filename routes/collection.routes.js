const router = require("express").Router();

const { loggedIn, loggedOut } = require("../middleware/route-guard");

const Collection = require('../models/Collection.model');
const mongoose = require("mongoose"); 

const Upload = require('../helper/multer');
const async = require("hbs/lib/async");


//Collections
router.get('/collection', loggedIn, async (req,res,next) => {
    const creatorUser = req.session.currentUser._id;
    try{
        const collectionsFromDB = await Collection.find({
            _userCreator: creatorUser
        });
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

router.post('/collection-add', Upload.single("collectionImage"), async (req,res,next) => {
    const { collectionName, collectionImage } = req.body;
    const creatorUser = req.session.currentUser._id;
    let picture = req.file.path;

    try{
        await Collection.create({
            _userCreator: creatorUser,
            collectionName, 
            collectionImage: picture
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
        const collectionsFromDB = await Collection.findById(
          collectionId
        ).populate("_collectionItems");

        console.log(collectionsFromDB);
        return res.render('collections/collection-details', { collections: collectionsFromDB });
    }catch(err) {
        console.log(err);
        next(err);
    }
    
});

//deletecollection

// router.post('/collection/:collectionId/delete', async (req, res, next) =>{
//     const { collectionId } =req.params;

//     try{
//         await Collection.findByIdAndDelete(collectionId);
//         res.redirect('/collections');
//     }catch(err){
//         console.log(err);
//         next(err);
// }})

//edit collection
router.get('/edit-collection/:collectionId', loggedIn, async(req,res,next) => {
    const { collectionId } = req.params;
    try{
    const collectionFromDB = await Collection.findById(
        collectionId,
    )
        res.render('collections/edit-collection', { collections: collectionFromDB});
    }catch(err){
        console.log(err)
        next(err);
    }
});

router.post('/edit-collection/:collectionId', Upload.single("collectionImage"), loggedIn, async (req, res, next) => {
    const { collectionId } = req.params;
    const { collectionName, collectionImage } = req.body
    let picture;

    try{
        if(req.file) {
            picture = req.file.path;
            const collectionFromDB = await Collection.findByIdAndUpdate(
                collectionId,
                {
                    collectionName,
                    collectionImage
                },
                { new: true }
            );
            return res.redirect (`/collection/${collectionFromDB._id}`);
        }else{
            const collectionFromDB = await Collection.findByIdAndUpdate(
                collectionId,
                {
                    collectionName,
                    collectionImage
                },
                { new: true }
            );
            return res.redirect (`/collection/${collectionFromDB._id}`);
        }
    } catch(err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;