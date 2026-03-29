const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'Please add a URL'],
        match: [
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i,
            'Please use a valid URL'
        ]
    },
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    tags: [String],
    isFavorite: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for search
BookmarkSchema.index({ title: 'text', url: 'text', description: 'text', tags: 'text' });

// Update the updatedAt field on save
BookmarkSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
