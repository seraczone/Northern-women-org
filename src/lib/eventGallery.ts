type GalleryItemLike = {
  image_url: string | null | undefined;
};

const GALLERY_WEBP_PATTERN = /\/(meet\d+|ns\d+)\.jpg(?=($|[?#]))/i;
const GALLERY_ORDER_PATTERN = /\/(?:meet|ns)(\d+)\.(?:jpg|webp)(?=($|[?#]))/i;

export const getGalleryImageSrc = (value: string | null | undefined) =>
  String(value ?? "").trim().replace(GALLERY_WEBP_PATTERN, "/$1.webp");

const getGalleryOrder = (value: string | null | undefined) => {
  const match = getGalleryImageSrc(value).match(GALLERY_ORDER_PATTERN);

  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

export const sortGalleryItems = <T extends GalleryItemLike>(items: T[]) =>
  items
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const orderDifference =
        getGalleryOrder(left.item.image_url) - getGalleryOrder(right.item.image_url);

      if (orderDifference !== 0) {
        return orderDifference;
      }

      return left.index - right.index;
    })
    .map(({ item }) => item);
