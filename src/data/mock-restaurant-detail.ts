import { RestaurantDetail } from '@/types/restaurant';

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=600&fit=crop&auto=format`;

const yangmiok: RestaurantDetail = {
  id: '1',
  name: '을지로 양미옥',
  category: '한식',
  subCategory: '한정식',
  region: '을지로',
  tagline: '육사시미부터 설렁탕까지 어떤 메뉴를 시켜도 실망이 없는 곳',
  address: '서울 중구 을지로 123-45',
  roadAddress: '서울 중구 을지로 123',
  buildingName: '을지로중앙빌딩',
  phone: '02-1234-5678',
  placeUrl: 'https://place.map.kakao.com/1',
  categoryGroupName: '음식점',
  categoryPath: '음식점 > 한식 > 한정식',
  administrativeArea: '을지로동',
  accessSummary: '을지로입구역 5번 출구 5분',
  hours: { weekday: '매일 11:00 – 22:00' },
  coordinates: { lat: 37.5662, lng: 126.9898 },
  photos: [
    unsplash('photo-1547592180-85f173990554'),
    unsplash('photo-1583394838336-acd977736f90'),
    unsplash('photo-1504674900247-0877df9cc836'),
    unsplash('photo-1498654896293-37aacf113fd9'),
    unsplash('photo-1546069901-ba9599a7e63c'),
    unsplash('photo-1482049016688-2d3e1b311543'),
  ],
  totalPhotoCount: 42,
  locationDescription:
    '을지로입구역 5번 출구에서 도보 5분. 한정식 전문점이 모여 있는 조용한 골목 안쪽이라 식사 후 산책하기에도 좋아요.',
  communityAvgScore: 4.7,
  dimensionScores: { taste: 4.8, value: 4.1, vibe: 4.5 },
  sceneScores: [
    { tag: '데이트', score: 4.8 },
    { tag: '회식', score: 4.6 },
    { tag: '혼밥', score: 4.2 },
  ],
  trustScore: 89,
  trustBreakdown: { photoRatio: 0.72, longTextRatio: 0.64, recentActivityRatio: 0.81 },
  reviewCount: 142,
  myReview: {
    visitCount: 2,
    lastVisitLabel: '3월 15일',
    visits: [
      {
        visitOrdinal: 1,
        dateLabel: '3월 15일',
        scores: { taste: 5.0, value: 4.5, vibe: 5.0 },
        content:
          '남자친구 생일이어서 미리 예약하고 방문했어요. 2주 전에 예약했는데도 원하는 시간대가 거의 없어서 당황했네요.\n\n입구부터 한옥 분위기로 꾸며져 있어서 사진 찍기도 좋았고, 룸으로 안내받았는데 조용하고 프라이빗해서 기념일 분위기 내기 딱 좋았어요. 2인 코스로 시켰는데 전체적으로 정갈하고 맛있었습니다. 특히 간장게장이 시그니처답게 밥도둑이고, 전복죽은 고소함이 남달랐어요.\n\n다만 가격대가 있어서 자주 오기엔 부담이고, 정말 특별한 날에 오기 좋은 곳이라는 느낌. 다음엔 부모님 모시고 와야겠다 생각했어요.',
        sceneTags: ['데이트'],
        photos: [
          unsplash('photo-1604908176997-125f25cc6f3d'),
          unsplash('photo-1567620905732-2d1ec7ab7445'),
          unsplash('photo-1565299624946-b28f40a0ae38'),
          unsplash('photo-1546069901-ba9599a7e63c'),
          unsplash('photo-1482049016688-2d3e1b311543'),
        ],
      },
      {
        visitOrdinal: 2,
        dateLabel: '작년 12월',
        scores: { taste: 4.5, value: 4.0, vibe: 4.5 },
        content:
          '친구랑 기념일에 왔어요. 한정식 코스가 정성스럽고 분위기도 좋아서 만족했어요. 반찬 가짓수가 많아서 하나하나 맛보는 재미가 있더라구요. 가격은 조금 있음.',
        sceneTags: ['데이트'],
      },
    ],
  },
  repeatVisitReview: {
    reviewerId: 'minseo',
    reviewerName: '이준기',
    reviewerInitial: '이',
    reviewerLevel: 5,
    reviewerTrustScore: 83,
    visitCount: 2,
    visits: [
      {
        label: '최근 · 3월 18일',
        scores: { taste: 4.5, value: 4.0, vibe: 4.5 },
        content:
          '재방문인데 여전히 좋아요. 전보다 직원분들이 더 친절해진 느낌이고, 신메뉴 우족탕이 진짜 맛있었습니다.',
      },
      {
        label: '첫 방문 · 작년 11월',
        scores: { taste: 4.0, value: 3.5, vibe: 4.5 },
        content:
          '인테리어가 진짜 예쁘고 음식도 괜찮았어요. 다만 가격대가 좀 있어서 특별한 날에 올만한 곳.',
      },
    ],
  },
  reviews: [
    {
      id: 'r1',
      reviewerId: 'minseo',
      reviewerName: '김미식',
      reviewerInitial: '김',
      reviewerLevel: 6,
      reviewerTrustScore: 91,
      visitOrdinal: 3,
      scores: { taste: 5.0, value: 4.0, vibe: 5.0 },
      content:
        '반찬 하나하나가 정성스러워요. 간장게장이 시그니처라는데 진짜 밥도둑이고, 전복죽도 고소함이 다릅니다. 예약은 필수고, 데이트로도 회식으로도 무난하게 좋아요.',
      photos: [
        unsplash('photo-1604908176997-125f25cc6f3d'),
        unsplash('photo-1567620905732-2d1ec7ab7445'),
        unsplash('photo-1565299624946-b28f40a0ae38'),
      ],
      sceneTags: ['데이트', '회식'],
      helpfulCount: 24,
      postedAt: '2주 전',
    },
    {
      id: 'r2',
      reviewerId: 'minseo',
      reviewerName: '박도윤',
      reviewerInitial: '박',
      reviewerLevel: 5,
      reviewerTrustScore: 78,
      visitOrdinal: 1,
      scores: { taste: 4.5, value: 3.5, vibe: 5.0 },
      content:
        '회사 회식으로 갔는데 룸이 꽤 넓고 조용해서 대화하기 좋았어요. 한정식 코스가 만족스러웠지만 가격이 좀 부담되긴 했습니다.',
      sceneTags: ['회식'],
      helpfulCount: 11,
      postedAt: '1개월 전',
    },
    {
      id: 'r3',
      reviewerId: 'minseo',
      reviewerName: '최서연',
      reviewerInitial: '최',
      reviewerLevel: 4,
      reviewerTrustScore: 76,
      visitOrdinal: 1,
      scores: { taste: 5.0, value: 4.0, vibe: 4.5 },
      content:
        '부모님 모시고 갔는데 정말 만족하셨어요. 음식도 정갈하고 서비스도 좋고. 다만 예약이 꽤 어렵더라구요. 2주 전에는 해야해요.',
      sceneTags: ['회식'],
      helpfulCount: 18,
      postedAt: '1개월 전',
    },
    {
      id: 'r4',
      reviewerId: 'minseo',
      reviewerName: '정유진',
      reviewerInitial: '정',
      reviewerLevel: 4,
      reviewerTrustScore: 74,
      visitOrdinal: 1,
      scores: { taste: 4.5, value: 4.0, vibe: 4.5 },
      content:
        '한정식 코스가 정말 정성스러워요. 반찬 하나하나가 다 맛있고, 특히 간장게장이 인상적이었어요. 분위기도 차분해서 조용한 식사하기 좋습니다.',
      sceneTags: ['데이트'],
      helpfulCount: 9,
      postedAt: '2개월 전',
    },
  ],
};

const sushidoku: RestaurantDetail = {
  id: '4',
  name: '홍대 스시도쿠',
  category: '일식',
  subCategory: '오마카세',
  region: '홍대',
  tagline: '오마카세 퀄리티를 합리적으로 즐길 수 있는 곳',
  address: '서울 마포구 와우산로 10',
  accessSummary: '홍대입구역 9번 출구 7분',
  hours: { weekday: '화–일 12:00 – 22:00 (월 휴무)' },
  coordinates: { lat: 37.5573, lng: 126.925 },
  photos: [
    unsplash('photo-1579584425555-c3ce17fd4351'),
    unsplash('photo-1617196034796-73dfa7b1fd56'),
    unsplash('photo-1553621042-f6e147245754'),
    unsplash('photo-1563612116625-3012372fccce'),
    unsplash('photo-1534482421-64566f976cfa'),
    unsplash('photo-1607301406259-dfb186e15de8'),
  ],
  totalPhotoCount: 58,
  locationDescription:
    '홍대입구역 9번 출구에서 도보 7분. 조용한 주택가에 자리잡은 오마카세 전문점.',
  communityAvgScore: 4.3,
  dimensionScores: { taste: 4.8, value: 3.5, vibe: 4.4 },
  sceneScores: [
    { tag: '데이트', score: 4.7 },
    { tag: '회식', score: 4.0 },
    { tag: '혼밥', score: 4.5 },
  ],
  trustScore: 81,
  trustBreakdown: { photoRatio: 0.65, longTextRatio: 0.55, recentActivityRatio: 0.75 },
  reviewCount: 58,
  reviews: [
    {
      id: 's1',
      reviewerId: 'minseo',
      reviewerName: '오마카세러버',
      reviewerInitial: '오',
      reviewerLevel: 6,
      reviewerTrustScore: 89,
      visitOrdinal: 3,
      scores: { taste: 5.0, value: 4.0, vibe: 4.5 },
      content:
        '코스 구성이 훌륭했어요. 가격 대비 퀄리티가 정말 좋고 셰프님이 친절하세요. 재료 설명 하나하나 꼼꼼히 해주시는 것도 좋았습니다.',
      photos: [unsplash('photo-1579584425555-c3ce17fd4351'), unsplash('photo-1617196034796-73dfa7b1fd56')],
      sceneTags: ['데이트'],
      helpfulCount: 32,
      postedAt: '3일 전',
    },
    {
      id: 's2',
      reviewerId: 'minseo',
      reviewerName: '스시덕후',
      reviewerInitial: '스',
      reviewerLevel: 5,
      reviewerTrustScore: 82,
      visitOrdinal: 2,
      scores: { taste: 5.0, value: 3.5, vibe: 4.5 },
      content:
        '두 번째 방문인데 여전히 만족. 제철 생선 퀄리티가 좋고, 샤리 온도도 딱 좋았어요. 혼자 카운터에 앉아 먹기에도 편합니다.',
      sceneTags: ['혼밥', '데이트'],
      helpfulCount: 14,
      postedAt: '3주 전',
    },
  ],
};

const onion: RestaurantDetail = {
  id: '5',
  name: '카페 어니언 성수',
  category: '카페',
  subCategory: '베이커리 카페',
  region: '성수',
  tagline: '공간 자체가 예술, 아메리카노 한 잔에 창고 감성이 덤',
  address: '서울 성동구 아차산로9길 8',
  accessSummary: '성수역 2번 출구 5분',
  hours: { weekday: '매일 08:00 – 22:00' },
  coordinates: { lat: 37.5443, lng: 127.0553 },
  photos: [
    unsplash('photo-1509042239860-f550ce710b93'),
    unsplash('photo-1517705008128-361805f42e86'),
    unsplash('photo-1534432586043-d45ebcf6f88c'),
    unsplash('photo-1495474472287-4d71bcdd2085'),
    unsplash('photo-1453614512568-c4024d13c9a1'),
    unsplash('photo-1511920170033-f8396924c348'),
  ],
  totalPhotoCount: 203,
  locationDescription:
    '성수역 2번 출구에서 도보 5분. 오래된 공장을 리모델링한 대형 카페로 평일 오전 방문이 쾌적합니다.',
  communityAvgScore: 4.4,
  dimensionScores: { taste: 4.2, value: 3.4, vibe: 5.0 },
  sceneScores: [
    { tag: '데이트', score: 4.9 },
    { tag: '회식', score: 3.8 },
    { tag: '혼밥', score: 4.0 },
  ],
  trustScore: 66,
  trustBreakdown: { photoRatio: 0.58, longTextRatio: 0.42, recentActivityRatio: 0.69 },
  reviewCount: 521,
  reviews: [
    {
      id: 'o1',
      reviewerId: 'minseo',
      reviewerName: '커피덕후',
      reviewerInitial: '커',
      reviewerLevel: 5,
      reviewerTrustScore: 78,
      visitOrdinal: 4,
      scores: { taste: 4.0, value: 3.0, vibe: 5.0 },
      content:
        '공간이 너무 예쁘고 라떼가 맛있어요. 주말엔 줄이 길지만 기다릴 가치 있어요. 팡도르가 시그니처.',
      photos: [unsplash('photo-1509042239860-f550ce710b93')],
      sceneTags: ['데이트'],
      helpfulCount: 48,
      postedAt: '5일 전',
    },
  ],
};

const karedang: RestaurantDetail = {
  id: '1309119533',
  name: '카레당',
  category: '일식',
  subCategory: '카레',
  region: '을지로',
  tagline: '카츠카레 한 그릇으로 점심시간이 살아나는 곳',
  address: '서울 중구 을지로 24-1',
  accessSummary: '을지로3가역 11번 출구 4분',
  hours: { weekday: '평일 11:30 – 21:00 (토·일 휴무)' },
  coordinates: { lat: 37.566, lng: 126.992 },
  photos: [
    unsplash('photo-1565557623262-b51c2513a641'),
    unsplash('photo-1547573854-74d2a71d0826'),
    unsplash('photo-1553621042-f6e147245754'),
    unsplash('photo-1563612116625-3012372fccce'),
    unsplash('photo-1574484284002-952d92456975'),
    unsplash('photo-1626100134240-1c0b3437d65a'),
  ],
  totalPhotoCount: 37,
  locationDescription:
    '을지로3가역 11번 출구에서 도보 4분. 점심시간 줄이 길지만 회전이 빨라 10분 안에 자리가 납니다. 1인 카운터석도 있어서 혼밥하기 좋아요.',
  communityAvgScore: 4.5,
  dimensionScores: { taste: 4.7, value: 4.3, vibe: 3.9 },
  sceneScores: [
    { tag: '혼밥', score: 4.8 },
    { tag: '데이트', score: 3.8 },
    { tag: '회식', score: 3.5 },
  ],
  trustScore: 78,
  trustBreakdown: { photoRatio: 0.66, longTextRatio: 0.58, recentActivityRatio: 0.74 },
  reviewCount: 87,
  myReview: {
    visitCount: 2,
    lastVisitLabel: '4월 8일',
    visits: [
      {
        visitOrdinal: 1,
        dateLabel: '2월 22일',
        scores: { taste: 4.5, value: 4.5, vibe: 3.5 },
        content:
          '을지로에서 점심을 해결할 곳을 찾다가 지나가다 발견했어요. 들어가니 자리가 꽉 찼는데 카운터석이 있어서 혼자도 어색하지 않았습니다.\n\n카츠카레 주문했는데 소스가 진하고 고소하면서도 매콤하지 않아서 좋았어요. 돈카츠 튀김이 얇게 잘 튀겨져서 소스에 푹 적셔 먹으면 최고. 밥 양도 넉넉해서 배부르게 먹었습니다.\n\n가격도 점심 기준으로 착한 편이고, 조용히 혼자 먹기 딱 좋은 분위기예요. 근처 일하는 분들이 많이 오시는 것 같았어요.',
        sceneTags: ['혼밥'],
        photos: [
          unsplash('photo-1565557623262-b51c2513a641'),
          unsplash('photo-1547573854-74d2a71d0826'),
        ],
      },
      {
        visitOrdinal: 2,
        dateLabel: '4월 8일',
        scores: { taste: 5.0, value: 4.5, vibe: 4.0 },
        content:
          '이번엔 새우카레 시켜봤어요. 새우가 통통하고 소스가 카츠카레랑 또 달라서 좋았습니다. 두 번 왔는데 메뉴마다 맛이 다 훌륭하네요. 직원분들도 빠릿빠릿해서 점심시간에 빠르게 먹고 나올 수 있어서 특히 좋아요.',
        sceneTags: ['혼밥'],
      },
    ],
  },
  repeatVisitReview: {
    reviewerId: 'jiho_seo',
    reviewerName: '서지호',
    reviewerInitial: '서',
    reviewerLevel: 5,
    reviewerTrustScore: 82,
    visitCount: 2,
    visits: [
      {
        label: '최근 · 3월 30일',
        scores: { taste: 5.0, value: 4.5, vibe: 4.0 },
        content:
          '이번엔 새우카레로 바꿔봤는데 전보다 더 좋았어요. 첫 방문 때보다 소스가 더 짙게 느껴졌고, 덮밥 형식이라 먹기 편했습니다. 카운터 자리에 앉아서 혼자 먹는 분위기가 도쿄 카레집 같아서 좋아요.',
      },
      {
        label: '첫 방문 · 작년 10월',
        scores: { taste: 4.5, value: 4.5, vibe: 3.5 },
        content:
          '카츠카레가 맛있는데 소스가 진하고 카츠가 바삭해서 식감이 좋아요. 분위기는 좀 좁고 북적이는 편이지만 점심 한 끼로는 완벽한 곳.',
      },
    ],
  },
  reviews: [
    {
      id: 'kr1',
      reviewerId: 'jihun_kim',
      reviewerName: '김지훈',
      reviewerInitial: '김',
      reviewerLevel: 6,
      reviewerTrustScore: 88,
      visitOrdinal: 3,
      scores: { taste: 5.0, value: 4.5, vibe: 4.0 },
      content:
        '카츠카레가 시그니처인데 소스가 진하고 카츠가 얇게 잘 튀겨져서 밥이랑 비벼 먹으면 진짜 맛있어요. 을지로 점심 픽으로 항상 추천하는 곳입니다. 줄이 길어도 기다릴 가치 있어요.',
      photos: [
        unsplash('photo-1565557623262-b51c2513a641'),
        unsplash('photo-1553621042-f6e147245754'),
      ],
      sceneTags: ['혼밥'],
      helpfulCount: 21,
      postedAt: '1주 전',
    },
    {
      id: 'kr2',
      reviewerId: 'sumin_lee',
      reviewerName: '이수민',
      reviewerInitial: '이',
      reviewerLevel: 4,
      reviewerTrustScore: 71,
      visitOrdinal: 1,
      scores: { taste: 4.5, value: 4.5, vibe: 3.5 },
      content:
        '점심 피크 때는 웨이팅이 좀 있지만 회전이 빠른 편이라 오래 기다리지 않았어요. 카운터석이 있어서 1인 방문도 편하고, 음식이 빨리 나와서 바쁜 점심시간에 딱입니다.',
      sceneTags: ['혼밥'],
      helpfulCount: 9,
      postedAt: '2주 전',
    },
    {
      id: 'kr3',
      reviewerId: 'jaehyun_park',
      reviewerName: '박재현',
      reviewerInitial: '박',
      reviewerLevel: 5,
      reviewerTrustScore: 80,
      visitOrdinal: 2,
      scores: { taste: 4.5, value: 4.0, vibe: 4.0 },
      content:
        '카운터석에 앉아서 혼자 먹었는데 도쿄 카레 전문점 같은 느낌이 나서 좋았어요. 카레 자체가 향신료 향이 강하지 않고 부드러운 편이라 자극적인 게 싫은 분께도 추천할 수 있어요.',
      sceneTags: ['혼밥'],
      helpfulCount: 14,
      postedAt: '1개월 전',
    },
    {
      id: 'kr4',
      reviewerId: 'yuna_jung',
      reviewerName: '정유나',
      reviewerInitial: '정',
      reviewerLevel: 3,
      reviewerTrustScore: 65,
      visitOrdinal: 1,
      scores: { taste: 4.0, value: 5.0, vibe: 3.5 },
      content:
        '을지로에서 이 가격에 이 맛이면 가성비 최고예요. 메뉴가 심플해서 고민 없이 주문할 수 있고, 양도 많아서 만족스러웠습니다. 분위기가 좀 협소하긴 하지만 맛으로 커버됩니다.',
      sceneTags: ['혼밥', '데이트'],
      helpfulCount: 6,
      postedAt: '1개월 전',
    },
  ],
};

const mockRestaurantDetails: Record<string, RestaurantDetail> = {
  '1': yangmiok,
  '4': sushidoku,
  '5': onion,
  '1309119533': karedang,
};

export function getRestaurantDetail(id: string): RestaurantDetail | undefined {
  return mockRestaurantDetails[id];
}
