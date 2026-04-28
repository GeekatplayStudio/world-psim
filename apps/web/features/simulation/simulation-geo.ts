export const sceneLongitudeLimit = 180;
export const sceneLatitudeLimit = 82;

export const mapPlaneWidth = 37.2;
export const mapPlaneDepth = 20.8;

export const planeHalfWidth = mapPlaneWidth / 2;
export const planeHalfDepth = mapPlaneDepth / 2;

export const worldTextureWidth = 1800;
export const worldTextureHeight = Math.round((mapPlaneDepth / mapPlaneWidth) * worldTextureWidth);

export function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function projectLongitudeToPlane(longitude: number) {
  const normalizedLongitude = clamp(-sceneLongitudeLimit, longitude, sceneLongitudeLimit) / sceneLongitudeLimit;

  return Number((normalizedLongitude * planeHalfWidth).toFixed(3));
}

export function projectLatitudeToPlane(latitude: number) {
  const normalizedLatitude = clamp(-sceneLatitudeLimit, latitude, sceneLatitudeLimit) / sceneLatitudeLimit;

  return Number((-normalizedLatitude * planeHalfDepth).toFixed(3));
}

export function projectLonLatToTexture(longitude: number, latitude: number): [number, number] {
  const clampedLongitude = clamp(-sceneLongitudeLimit, longitude, sceneLongitudeLimit);
  const clampedLatitude = clamp(-sceneLatitudeLimit, latitude, sceneLatitudeLimit);
  const x = ((clampedLongitude + sceneLongitudeLimit) / (sceneLongitudeLimit * 2)) * worldTextureWidth;
  const y = ((sceneLatitudeLimit - clampedLatitude) / (sceneLatitudeLimit * 2)) * worldTextureHeight;

  return [Number(x.toFixed(2)), Number(y.toFixed(2))];
}