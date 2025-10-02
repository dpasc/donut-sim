/**
 * Groups an array into subarrays of a given size.
 * @param {Array} array - The array to group.
 * @param {number} rowSize - The size of each group.
 * @returns {Array[]} - Array of grouped subarrays.
 */
export function groupIntoRows(array, rowSize) {
  const rows = [];
  for (let i = 0; i < array.length; i += rowSize) {
    rows.push(array.slice(i, i + rowSize));
  }
  return rows;
}

/**
 * Maps order type to donut count.
 * @param {string} type - The order type.
 * @returns {number}
 */
export function getDonutCount(type) {
  switch (type) {
    case "single":
      return 1;
    case "double":
      return 2;
    case "halfDozen":
      return 6;
    case "fullDozen":
      return 12;
    default:
      return 1;
  }
}

/**
 * Formats a timestamp as HH:mm:ss (24-hour).
 * @param {number|string|Date} timestamp
 * @returns {string}
 */
export function getFormattedTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-AU", { hour12: false });
}
