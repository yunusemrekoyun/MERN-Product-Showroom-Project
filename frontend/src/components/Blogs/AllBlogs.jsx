import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";
import "./AllBlogs.css";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/blogs`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setBlogs(data);
      } catch {
        message.error("Bloglar yüklenemedi");
        console.log("Çekilen Bloglar:", blogs);
      }
      console.log("API URL:", apiUrl);
    };
    fetchBlogs();
  }, [apiUrl]);

  return (
    <section className="all-blogs">
      <div className="container">
        <h2 className="page-title">Tüm Bloglar</h2>
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div
              key={blog.blogId}
              className="blog-card"
              onClick={() => navigate(`/blogs/${blog.blogId}`)}
            >
              <img
                src={`${apiUrl}/api/blogs/${blog.blogId}/image/0`}
                alt={blog.title}
                className="blog-image"
                onError={(e) => (e.target.src = "/img/fallback.jpg")}
              />
              <p className="blog-date">
                {dayjs(blog.createdAt).format("DD MMM YYYY")}
              </p>
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-preview">
                {blog.content.length > 120
                  ? blog.content.slice(0, 120) + "..."
                  : blog.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllBlogs;
