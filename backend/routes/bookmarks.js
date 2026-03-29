const express = require('express');
const router = express.Router();
const {
    getBookmarks,
    getBookmark,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite
} = require('../controllers/bookmarksController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getBookmarks)
    .post(createBookmark);

router.route('/:id')
    .get(getBookmark)
    .put(updateBookmark)
    .delete(deleteBookmark);

router.put('/:id/favorite', toggleFavorite);

module.exports = router;
