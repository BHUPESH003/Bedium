import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  
}

interface BlogDetailsProps {
  post: BlogPost;
}

export default function BlogDetails({ post }: BlogDetailsProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          <div className="flex items-center mt-4">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback>{post.authorId.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.authorId}</p>
              <p className="text-xs text-muted-foreground">Author ID: {post.authorId}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}