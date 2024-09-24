import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios';
import { defaultURL } from '@/env';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchBlogs = async () => {
    
      try {
        const response = await axios.get(`${defaultURL}/blog/all/bulk`, {
          headers: {
            'Authorization': localStorage.getItem('token'), // Include the token if required
          },
        });
        if(response.status==200){
          setBlogs([...response.data]);
          setLoading(false);
        }
        console.log('Fetched blogs successfully:', response.data);
        return response.data; // Return the list of blogs
      } catch (error:any) {
        console.error('Error fetching blogs:', error.response ? error.response.data : error.message);
        throw error; // Rethrow or handle the error as needed
      }
    };

    fetchBlogs();
  }, []);

  const BlogSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-4" />
        <Skeleton className="h-10 w-28" />
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="grid gap-6">
        {loading ? (
          <>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>
                  <Link to={`/blogs/${blog.id}`} className="text-2xl font-bold hover:underline">
                    {blog.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{blog.content.substring(0, 150)}...</p>
                <p className="text-sm">Author ID: {blog.authorId}</p>
                <Button asChild className="mt-4">
                  <Link to={`/blogs/${blog.id}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}