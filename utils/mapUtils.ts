// файл: src/utils/mapUtils.ts (путь укажите любой удобный для себя)
import { Feature, FeatureCollection, Point } from 'geojson';
import { IWalkAdvrtDto } from '@/dtos/Interfaces/advrt/IWalkAdvrtDto';
import { IPointEntityDTO } from '@/dtos/Interfaces/map/IPointEntityDTO';

/**
 * Формирует FeatureCollection на базе объявлений о прогулках и кастомных поинтов.
 */
export function createGeoJSONFeatures(
  walkAdvrts: IWalkAdvrtDto[],
  mapPoints: IPointEntityDTO[]
): FeatureCollection<Point> {
  const features: Feature<Point>[] = [];

  // Добавляем точки прогулок
  walkAdvrts.forEach((advrt) => {
    features.push({
      type: 'Feature',
      properties: {
        id: advrt.id,
        type: 'advrt',
      },
      geometry: {
        type: 'Point',
        coordinates: [advrt.longitude!, advrt.latitude!],
      },
    });
  });

  // Добавляем кастомные поинты (Danger, Note и т.д.)
  mapPoints.forEach((point) => {
    features.push({
      type: 'Feature',
      properties: {
        id: point.id,
        type: 'point',
      },
      geometry: {
        type: 'Point',
        coordinates: [point.longitude!, point.latitude!],
      },
    });
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}