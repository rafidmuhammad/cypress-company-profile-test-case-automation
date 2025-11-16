function toPascalCase(string) {
    const tempString = string.toLowerCase()
    const words = tempString.split(' ');

    return words.map(word => {
        return word[0].toUpperCase() + word.slice(1);
    }).join(' ');
}

module.exports = { toPascalCase };