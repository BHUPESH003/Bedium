import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { CreateBlogInput } from "@10kdevs/medium-common";
import axios from "axios";
import { defaultURL } from "@/env";


export default function CreateBlog() {
  const [blogPost, setBlogPost] = useState<CreateBlogInput>({
    title: "",
    content: ""
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBlogPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token=localStorage.getItem('token');
      const response = await axios.post(`${defaultURL}/blog/auth/publish`,blogPost, {
        headers: {
          'Authorization': token, // Assuming JWT is sent in Authorization header
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {       
        navigate(`/blog${response.data.id}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error in signup:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Create New Blog Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={blogPost.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={blogPost.content}
                  onChange={handleChange}
                  placeholder="Write your blog content here"
                  rows={10}
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-6" type="submit">
              Create Blog Post
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
