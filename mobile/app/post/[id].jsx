import { useLocalSearchParams } from 'expo-router';
import PostPage from '../components/postPage';

export default function PostScreen() {
  const { id } = useLocalSearchParams();

  return <PostPage postId={id} />;
}
