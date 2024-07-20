const express = require('express');
const router = express.Router();
const { getPosts } = require('../controllers/postsController'); // Ensure this path is correct

router.get('/posts', async (req, res) => {
    try {
        const posts = await getPosts();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

module.exports = router;
