/**
 * @typedef {Object} UserDTO
 * @property {string} id
 * @property {string} role
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {Object} LoginResponseDTO
 * @property {string} token
 * @property {string} refreshToken
 * @property {UserDTO} user
 * @property {string[]} permissions
 */

/**
 * @typedef {Object} CurrentUserDTO
 * @property {string} id
 * @property {string} role
 * @property {string} name
 * @property {string} email
 * @property {string[]} permissions
 */
