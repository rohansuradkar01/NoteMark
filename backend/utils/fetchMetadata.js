const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Fetches the title from a URL by parsing the HTML
 * @param {string} url - The URL to fetch metadata from
 * @returns {Promise<string|null>} - The page title or null if not found
 */
const fetchMetadata = async (url) => {
    try {
        // Add protocol if missing
        let fullUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            fullUrl = 'https://' + url;
        }

        const response = await fetch(fullUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 5000
        });

        if (!response.ok) {
            return null;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Try to get Open Graph title first, then regular title
        let title = $('meta[property="og:title"]').attr('content');

        if (!title) {
            title = $('title').text();
        }

        if (!title) {
            title = $('meta[name="title"]').attr('content');
        }

        return title ? title.trim() : null;
    } catch (error) {
        console.error('Error fetching metadata:', error.message);
        return null;
    }
};

module.exports = fetchMetadata;
