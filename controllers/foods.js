const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const foundUser = await User.findById(req.session.user._id)
    if (!foundUser) {
      return res.redirect('/');
    }
    res.render('foods/index.ejs', {
      user: foundUser,
      pantryItems: foundUser.pantry || []
    })
  }catch (error) {
    res.status(400).json({ msg: error.message })
  }
  });
  
router.get('/new', (req, res) => {
  res.render('foods/new.ejs', { user: req.session.user })
});

router.post('/', async (req, res) => {
  req.body.isInPantry === 'on' || req.body.isInPantry === true? 
  req.body.isInPantry = true : 
  req.body.isInPantry = false
  try{
    const foundUser = await User.findById(req.session.user._id)
    foundUser.pantry.push(req.body)
    await foundUser.save()
    res.redirect(`/users/${foundUser._id}/foods`)
  }catch(error){
    res.redirect('/')
  }
});


router.get('/:id/edit', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const user = await User.findById(req.session.user._id); 

    if (!user) {
      return res.redirect('/');
    }

    const itemToEdit = user.pantry.id(itemId); 
    if (!itemToEdit) {
      return res.redirect(`/users/${user._id}/foods`);
    }
    res.render('foods/edit.ejs', { user, item: itemToEdit });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const user = await User.findById(req.session.user._id);

    if (!user) {
      return res.redirect('/');
    }

    const itemToUpdate = user.pantry.id(itemId); 
    if (!itemToUpdate) {
      return res.redirect(`/users/${user._id}/foods`);
    }
    itemToUpdate.text = req.body.text;
    itemToUpdate.isInPantry = req.body.isInPantry === 'on' || req.body.isInPantry === true;
    await user.save(); 
    res.redirect(`/users/${user._id}/foods`);
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.redirect('/');
    }
    user.pantry.pull({ _id: itemId })
    await user.save();
    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;


// Collaberated with Anitra & Samantha