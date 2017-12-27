const Artist = require('../models/artist');

/**
 * Edits a single artist in the Artists collection
 * @param {string} _id - The ID of the artist to edit.
 * @param {object} artistProps - An object with a name, age, yearsActive, and genre
 * @return {promise} A promise that resolves when the record is edited
 */
module.exports = (_id, artistProps) => {
  
  const age = artistProps.age;
  const genre = artistProps.genre;
  const name = artistProps.name;
  const yearsActive = artistProps.yearsActive;

  return Artist.findByIdAndUpdate(_id, {
    age,
    genre,
    name,
    yearsActive,
  });
};
