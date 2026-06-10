'use client';

// 음식점 상세 페이지용 단일 핀 정적 지도 미리보기 — 드래그·줌 비활성
import { CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import type { Category, Coordinates } from '@/lib/types/restaurant';
import { CategoryPin } from '@/components/common/category/category-pin';

interface Props {
  coordinates: Coordinates;
  category: Category;
  name: string;
  appKey: string;
}

interface OuterProps {
  coordinates?: Coordinates;
  category: Category;
  name: string;
}

// SDK 로딩 + 지도 렌더 담당
function KakaoMiniMap({ coordinates, category, name, appKey }: Props) {
  const [loading, error] = useKakaoLoader({
    appkey: appKey,
    libraries: ['services'],
  });

  if (loading || error) return null;

  return (
    <Map
      center={coordinates}
      level={3}
      style={{ width: '100%', height: '100%' }}
      aria-label={`${name} 위치 지도`}
    >
      <CustomOverlayMap
        position={coordinates}
        xAnchor={0.5}
        yAnchor={0.5}
      >
        <CategoryPin category={category} active />
      </CustomOverlayMap>
    </Map>
  );
}

// 앱키·좌표 가드 외부 래퍼 — null 반환 시 호출부 placeholder가 노출됨
export function RestaurantLocationMap({ coordinates, category, name }: OuterProps) {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  if (!appKey || !coordinates) return null;

  return <KakaoMiniMap coordinates={coordinates} category={category} name={name} appKey={appKey} />;
}
