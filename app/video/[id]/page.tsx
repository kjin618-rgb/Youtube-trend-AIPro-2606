import VideoDetailClient from "@/components/VideoDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params;
  return <VideoDetailClient videoId={id} />;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `영상 ${id} | YouTube 트렌드` };
}
