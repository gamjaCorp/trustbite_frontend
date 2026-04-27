import { RestaurantDetail } from '@/types/restaurant';

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=600&fit=crop&auto=format`;

const yangmiok: RestaurantDetail = {
  id: '1',
  name: '을지로 양미옥',
  category: '한식',
  subCategory: '한정식',
  address: '서울 중구 을지로 123-45',
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
  reviewCount: 142,
  myReview: {
    visitCount: 2,
    lastVisitLabel: '3월 15일',
    visits: [
      {
        label: '1번째 방문 · 3월 15일',
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
        label: '2번째 방문 · 작년 12월',
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
    reviewerGrade: 'A',
    reviewerLevel: 4,
    reviewerTitle: '맛집 헌터',
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
      reviewerGrade: 'S',
      reviewerLevel: 5,
      reviewerTitle: '미식',
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
      reviewerGrade: 'A',
      reviewerLevel: 4,
      reviewerTitle: '맛집 헌터',
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
      reviewerGrade: 'B',
      reviewerLevel: 3,
      reviewerTitle: '맛집 수집',
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
      reviewerGrade: 'B',
      reviewerLevel: 3,
      reviewerTitle: '맛집 수집',
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
  reviewCount: 58,
  reviews: [
    {
      id: 's1',
      reviewerId: 'minseo',
      reviewerName: '오마카세러버',
      reviewerInitial: '오',
      reviewerGrade: 'S',
      reviewerLevel: 5,
      reviewerTitle: '미식',
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
      reviewerGrade: 'A',
      reviewerLevel: 4,
      reviewerTitle: '맛집 헌터',
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
  reviewCount: 521,
  reviews: [
    {
      id: 'o1',
      reviewerId: 'minseo',
      reviewerName: '커피덕후',
      reviewerInitial: '커',
      reviewerGrade: 'A',
      reviewerLevel: 4,
      reviewerTitle: '맛집 헌터',
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

export const mockRestaurantDetails: Record<string, RestaurantDetail> = {
  '1': yangmiok,
  '4': sushidoku,
  '5': onion,
};

export function getRestaurantDetail(id: string): RestaurantDetail | undefined {
  return mockRestaurantDetails[id];
}
