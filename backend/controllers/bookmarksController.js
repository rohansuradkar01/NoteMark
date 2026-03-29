const Bookmark = require('../models/Bookmark');
const fetchMetadata = require('../utils/fetchMetadata');

// @desc    Get all bookmarks for user
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
    try {
        let query = { user: req.user.id };

        // Search by text
        if (req.query.q) {
            query.$text = { $search: req.query.q };
        }

        // Filter by tags
        if (req.query.tags) {
            const tagsArray = req.query.tags.split(',').map(tag => tag.trim());
            query.tags = { $in: tagsArray };
        }

        // Filter by favorites
        if (req.query.favorites === 'true') {
            query.isFavorite = true;
        }

        const bookmarks = await Bookmark.find(query).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: bookmarks.length,
            data: bookmarks
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single bookmark
// @route   GET /api/bookmarks/:id
// @access  Private
exports.getBookmark = async (req, res, next) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }

        // Make sure user owns the bookmark
        if (bookmark.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this bookmark'
            });
        }

        res.status(200).json({
            success: true,
            data: bookmark
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new bookmark
// @route   POST /api/bookmarks
// @access  Private
exports.createBookmark = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        // Auto-fetch title if not provided
        if (!req.body.title && req.body.url) {
            const fetchedTitle = await fetchMetadata(req.body.url);
            if (fetchedTitle) {
                req.body.title = fetchedTitle;
            }
        }

        const bookmark = await Bookmark.create(req.body);

        res.status(201).json({
            success: true,
            data: bookmark
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update bookmark
// @route   PUT /api/bookmarks/:id
// @access  Private
exports.updateBookmark = async (req, res, next) => {
    try {
        let bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }

        // Make sure user owns the bookmark
        if (bookmark.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this bookmark'
            });
        }

        bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: bookmark
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
exports.deleteBookmark = async (req, res, next) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }

        // Make sure user owns the bookmark
        if (bookmark.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this bookmark'
            });
        }

        await bookmark.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle favorite status
// @route   PUT /api/bookmarks/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
    try {
        let bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }

        // Make sure user owns the bookmark
        if (bookmark.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this bookmark'
            });
        }

        bookmark = await Bookmark.findByIdAndUpdate(
            req.params.id,
            { isFavorite: !bookmark.isFavorite },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: bookmark
        });
    } catch (err) {
        next(err);
    }
};
