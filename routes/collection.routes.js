const router = require("express").Router();

const { loggedIn, loggedOut } = require("../middleware/route-guard");

const Collection = require('../models/Collection.model');
const mongoose = require("mongoose"); 

const Upload = require('../helper/multer');
const async = require("hbs/lib/async");


//Collections
router.get('/collection', loggedIn, async (req,res,next) => {
    try{
        const collectionsFromDB = await Collection.find()
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

    let picture = req.file.path;

    try{
        await Collection.create({
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
        const collectionsFromDB = await Collection.findById(collectionId);
        return res.render('collections/collection-details', { collections: collectionsFromDB });
    }catch(err) {
        console.log(err);
        next(err);
    }
    
});


//edit collection
router.get('/edit-collection', loggedIn, (req,res,next) => {
    res.render('collections/edit-collection')
});

router.post('/edit-collection', (req, res, next) => {
    const { collectiomName, colllectionImage } = req.body
});

module.exports = router;