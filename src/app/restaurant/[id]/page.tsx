import { RestaurantDetailView } from '@/components/features/restaurant';

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RestaurantDetailView id={id} />;
}
