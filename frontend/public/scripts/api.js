import express from 'express';
const router = express.Router();

// Example API route
router.get('/data', (req, res) => {
    res.json({ message: 'Hello from the API!' });
});

export default router;
