import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BlogDetails from './BlogDetails';
import { defaultURL } from '@/env';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
}

const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get postId from URL params
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null); // State for the fetched blog post
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        setError('Post ID is required.');
        setLoading(false);
        return;
      }

      const url = `${defaultURL}/blog/${id}`; // Replace with your actual API endpoint

      try {
        const response = await axios.get<BlogPost>(url, {
          headers: {
            'Authorization': localStorage.getItem('token'), // Assuming JWT is sent in Authorization header
            'Content-Type': 'application/json',
          },
        });
        setBlogPost(response.data); // Update state with fetched blog post
      } catch (err:any) {
        console.error('Error fetching blog post:', err.response ? err.response.data : err.message);
        setError('Failed to fetch blog post.'); // Set error message
      } finally {
        setLoading(false); // Set loading to false after request
      }
    };

    fetchBlogPost();
  }, [id]); // Run effect when postId changes

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error state

  return (
    <div>
      {blogPost ? <BlogDetails post={blogPost} /> : <p>No blog post found.</p>}
    </div>
  );
};

export default BlogPage;
