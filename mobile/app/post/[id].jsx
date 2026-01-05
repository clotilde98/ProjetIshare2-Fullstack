import { useLocalSearchParams } from 'expo-router';
import PostPage from '../components/postPage';

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  console.log(id);
  return <PostPage postId={id} />;
}
