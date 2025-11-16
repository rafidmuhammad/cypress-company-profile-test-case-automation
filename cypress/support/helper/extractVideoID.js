const extractVideoId = (url) => {
    // Regular expression pattern to match YouTube video IDs
    const regex =
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?.*?v=|v\/|embed\/|user\/[^/]+\/u\/[0-9]\/))([^#&?]*)/;
    const match = url.match(regex);
    return match && match[1].length === 11 ? match[1] : null;
};

module.exports = { extractVideoId };