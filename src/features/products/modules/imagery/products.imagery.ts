const artworkByTitle = new Map<string, number>([
  ["leather tote bag", 0],
  ["canvas backpack", 1],
  ["mini crossbody bag", 2],
  ["white sneakers", 3],
  ["running shoes", 4],
  ["suede loafers", 5],
  ["wool scarf", 6],
  ["silver watch", 7],
  ["sunglasses", 8],
  ["travel duffel bag", 9],
  ["rain boots", 10],
  ["leather belt", 11],
]);
const artworkByCategory = new Map<string, number>([
  ["bags", 0],
  ["shoes", 3],
  ["accessories", 7],
]);

/**
 * Chooses a decorative studio illustration without modifying the API model.
 * @param title - Actual product title from the validated API record.
 * @param category - Category used only when a title has no dedicated image.
 * @returns An atlas cell index, or null when no suitable illustration exists.
 */
export function getProductArtworkIndex(
  title: string,
  category: string,
): number | null {
  return (
    artworkByTitle.get(title.trim().toLowerCase()) ??
    artworkByCategory.get(category.trim().toLowerCase()) ??
    null
  );
}
