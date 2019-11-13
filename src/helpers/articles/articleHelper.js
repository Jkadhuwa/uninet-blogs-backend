import slugify from 'slug';
import uniqid from 'uniqid';

/**
 * @description creates a slug for articles
 * @param {object} title
 * @returns {object} slug
 */

const slugGen = title => `${slugify(title, { lower: true })}-${uniqid.process()}`;


export { slugGen };
