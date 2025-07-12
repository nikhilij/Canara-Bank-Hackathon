const rateLimit = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // limit each IP to 100 requests per windowMs
        message = 'Too many requests, please try again later.',
        keyGenerator = (req) => req.ip,
    } = options;

    // Store for tracking requests per IP
    const hits = new Map();

    // Cleanup expired entries periodically
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of hits.entries()) {
            if (entry.expiry < now) {
                hits.delete(key);
            }
        }
    }, windowMs);

    return (req, res, next) => {
        const key = keyGenerator(req);
        const now = Date.now();

        let entry = hits.get(key);

        if (!entry || entry.expiry < now) {
            // New window for this key
            entry = { count: 1, expiry: now + windowMs };
            hits.set(key, entry);
        } else {
            entry.count += 1;
        }

        if (entry.count > max) {
            res.status(429).json({ error: message });
        } else {
            next();
        }
    };
};

module.exports = rateLimit;