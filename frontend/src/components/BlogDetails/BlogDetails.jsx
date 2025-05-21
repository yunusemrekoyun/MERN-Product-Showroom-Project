import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";
import BlogComments from "../BlogComments/BlogComments";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./BlogDetails.css";

const BlogDetails = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/blogs/${blogId}`);
        if (!res.ok) throw new Error();
        setBlog(await res.json());
      } catch (err) {
        console.error(err);
        message.error("Blog yüklenemedi");
      }
    };
    fetchBlog();
  }, [apiUrl, blogId]);

  if (!blog) return <div className="loading">Yükleniyor...</div>;

  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <section className="single-blog">
      <div className="container">
        <article>
          {blog.images.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500 }}
              className="blog-slider"
            >
              {blog.images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={blog.title}
                    className="blog-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={`data:image/png;base64,${blog.images[0]}`}
              alt={blog.title}
              className="blog-image"
            />
          )}

          <div className="blog-wrapper">
            <div className="blog-meta">
              <span className="blog-date">
                {dayjs(blog.createdAt).format("DD MMM, YYYY")}
              </span>
              <span className="blog-id">#{blog.blogId}</span>
              <span className="blog-likes">
                ❤️ {blog.likedBy.length} beğeni
              </span>
            </div>
            <h1 className="blog-title">{blog.title}</h1>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

        <div className="comment-section">
          <h3>Yorumlar</h3>
          <BlogComments blogId={blogId} user={storedUser} />
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
