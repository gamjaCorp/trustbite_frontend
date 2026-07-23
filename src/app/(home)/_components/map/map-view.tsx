// 카카오 지도 뷰 — appKey 유무 게이트 후 KakaoMap에 위임
import { MapPin } from 'lucide-react';
import type { RegionalRankEntry } from '@/types/restaurant';
import { type SearchArea } from '@/lib/geo';
import { KakaoMap } from './kakao-map';

export type { SearchArea };

interface MapViewProps {
  entries: RegionalRankEntry[];
  activeId?: string | null;
  onPinClick?: (id: string) => void;
  onAreaChanged?: (area: SearchArea) => void; // 최초 타일 로드 시에만 검색 영역 전달 → 첫 자동 검색 트리거
  onViewportChange?: (area: SearchArea) => void; // 드래그·줌 등 viewport 변경 시마다 현재 영역 전달 → 재검색 버튼 표시 용도
  appliedArea?: SearchArea | null; // 현재 적용된 검색 영역 — 원이 이 영역에 고정됨. null이면 내부 초기값 사용
  onRegionChange?: (region: string | null) => void; // appliedArea 중심의 행정구역명 전달 (재검색 시에만 발화)
}

// 카카오 지도 뷰 — NEXT_PUBLIC_KAKAO_MAP_APP_KEY 게이트 통과 시 KakaoMap에 위임
export function MapView(props: MapViewProps) {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  if (!appKey) {
    return (
      <div className="absolute inset-0 bg-muted/30 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <MapPin className="w-8 h-8" />
        <p className="text-title-3">지도를 불러올 수 없어요</p>
        <p className="text-caption-2">NEXT_PUBLIC_KAKAO_MAP_APP_KEY 미설정</p>
      </div>
    );
  }

  return <KakaoMap {...props} appKey={appKey} />;
}
