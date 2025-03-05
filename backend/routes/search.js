// backend/routes/search.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Calculate relevance score for search results
const calculateRelevance = (content, searchTerm, fileName, headings) => {
    let score = 0;
    const lowerContent = content.toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();
    const words = searchTerm.toLowerCase().split(' ');

    // Exact match in content (highest priority)
    const exactMatches = (lowerContent.match(new RegExp(lowerSearchTerm, 'g')) || []).length;
    score += exactMatches * 10;

    // Matches in headings (high priority)
    headings.forEach(heading => {
        const lowerHeading = heading.text.toLowerCase();
        if (lowerHeading.includes(lowerSearchTerm)) {
            score += 15;
        }
        words.forEach(word => {
            if (lowerHeading.includes(word)) {
                score += 5;
            }
        });
    });

    // Matches in filename (high priority)
    if (fileName.toLowerCase().includes(lowerSearchTerm)) {
        score += 20;
    }

    // Individual word matches
    words.forEach(word => {
        const wordMatches = (lowerContent.match(new RegExp(word, 'g')) || []).length;
        score += wordMatches * 2;
    });

    // Early appearance bonus
    const firstOccurrence = lowerContent.indexOf(lowerSearchTerm);
    if (firstOccurrence !== -1) {
        score += Math.max(0, 100 - Math.floor(firstOccurrence / 100));
    }

    return score;
};

// Extract headings from markdown content
const extractHeadings = (content) => {
    const headings = [];
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        headings.push({
            level: match[1].length,
            text: match[2]
        });
    }

    return headings;
};

// Get context around the search term
const getSearchContext = (content, searchTerm, contextLength = 150) => {
    const lowerContent = content.toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();
    const index = lowerContent.indexOf(lowerSearchTerm);

    if (index === -1) return null;

    let start = Math.max(0, index - contextLength);
    let end = Math.min(content.length, index + searchTerm.length + contextLength);

    // Adjust to word boundaries
    while (start > 0 && content[start] !== ' ' && content[start] !== '\n') start--;
    while (end < content.length && content[end] !== ' ' && content[end] !== '\n') end++;

    const context = content.slice(start, end).trim();
    const matchStart = index - start;
    const matchEnd = matchStart + searchTerm.length;

    return {
        before: context.slice(0, matchStart),
        match: context.slice(matchStart, matchEnd),
        after: context.slice(matchEnd),
        position: index
    };
};

router.get('/', async (req, res) => {
    try {
        const { q: searchTerm, limit = 10 } = req.query;

        if (!searchTerm || searchTerm.length < 2) {
            return res.json({
                success: true,
                data: { results: [] }
            });
        }

        const results = [];
        const markdownDir = path.join(process.cwd(), 'markdown-files');

        const searchInFile = async (filePath, fileName) => {
            try {
                const content = await fs.readFile(filePath, 'utf8');
                const lowerContent = content.toLowerCase();
                const lowerSearchTerm = searchTerm.toLowerCase();

                if (lowerContent.includes(lowerSearchTerm)) {
                    const headings = extractHeadings(content);
                    const context = getSearchContext(content, searchTerm);
                    const relevance = calculateRelevance(content, searchTerm, fileName, headings);

                    // Find the nearest heading to the search result
                    let nearestHeading = null;
                    let minDistance = Infinity;
                    headings.forEach(heading => {
                        const headingIndex = content.indexOf(heading.text);
                        const distance = Math.abs(headingIndex - context.position);
                        if (distance < minDistance) {
                            minDistance = distance;
                            nearestHeading = heading;
                        }
                    });

                    const relativePath = path.relative(markdownDir, filePath).replace(/\\/g, '/');

                    results.push({
                        title: fileName.replace(/\.md$/, '').replace(/-/g, ' '),
                        path: relativePath,
                        context: context,
                        relevance,
                        section: nearestHeading?.text || null,
                        position: context.position
                    });
                }
            } catch (error) {
                console.error(`Error reading file ${filePath}:`, error);
            }
        };

        const processDirectory = async (dirPath) => {
            const items = await fs.readdir(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = await fs.stat(fullPath);
                
                if (stat.isDirectory()) {
                    await processDirectory(fullPath);
                } else if (item.endsWith('.md')) {
                    await searchInFile(fullPath, item);
                }
            }
        };

        await processDirectory(markdownDir);

        // Sort results by relevance score
        results.sort((a, b) => b.relevance - a.relevance);

        // Return only the top results based on limit
        const topResults = results.slice(0, limit);

        res.json({
            success: true,
            data: {
                results: topResults,
                total: results.length,
                query: searchTerm
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error performing search'
        });
    }
});

module.exports = router;