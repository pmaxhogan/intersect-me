/**
 * Validate username
 * TODO: improve validation
 * @param {string} username
 * @return {boolean}
 */
export function validateUsername(username: string) {
    return username.length > 0 && username.length < 20;
}
