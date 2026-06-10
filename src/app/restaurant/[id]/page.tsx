import { RestaurantDetailView } from './_components';

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RestaurantDetailView id={id} />;
}
