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
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Blog detaylarını çek
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/blogs/${blogId}`);
        if (!res.ok) throw new Error("Sunucu hatası");
        const data = await res.json();
        setBlog(data);
        setLikesCount(data.likedBy.length);
        setLiked(data.likedBy.includes(storedUser?._id));
      } catch (err) {
        console.error(err);
        message.error("Blog yüklenemedi");
      }
    };

    fetchBlog();
  }, [apiUrl, blogId, storedUser]);

  // Beğeni işlemi
  const handleLike = async () => {
    if (!storedUser) return message.warning("Beğenmek için giriş yapın!");

    try {
      const res = await fetch(`${apiUrl}/api/blogs/${blogId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUser._id }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setLikesCount(data.likesCount);
      setLiked((prev) => !prev);
    } catch (err) {
      console.error(err);
      message.error("Beğeni güncellenemedi");
    }
  };

  // Yüklenme durumu
  if (!blog) return <div className="loading">Yükleniyor...</div>;

  return (
    <section className="single-blog">
      <div className="container">
        <article>
          {/* Çoklu görsel varsa Swiper, yoksa tek görsel */}
          {blog.images?.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500 }}
              className="blog-slider"
            >
              {blog.images.map((_, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={`${apiUrl}/api/blogs/${blogId}/image/${idx}`}
                    alt={blog.title}
                    className="blog-image limited-image"
                    onError={(e) => (e.target.src = "/img/fallback.jpg")}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            blog.images?.[0] && (
              <img
                src={`data:image/png;base64,${blog.images[0]}`}
                alt={blog.title}
                className="blog-image limited-image"
              />
            )
          )}

          <div className="blog-wrapper">
            <div className="blog-meta">
              <span className="blog-date">
                {dayjs(blog.createdAt).format("DD MMM, YYYY")}
              </span>
              <span className="blog-id">#{blog.blogId}</span>
              <button
                className={`blog-like-button ${liked ? "liked" : ""}`}
                onClick={handleLike}
              >
                {liked ? "❤️" : "🤍"} {likesCount} beğeni
              </button>
            </div>

            <h1 className="blog-title">{blog.title}</h1>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <button
              className="toggle-details-button"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? "Yorumları Gizle" : "Blog Yorumları"}
            </button>
          </div>
        </article>

        {/* Yorumlar sadece açıkken gösterilir */}
        {showComments && (
          <div className="comment-section">
            <BlogComments blogId={blogId} user={storedUser} />
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogDetails;