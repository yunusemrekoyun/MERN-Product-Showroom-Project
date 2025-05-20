import BlogItem from "./BlogItem";
import "./Blogs.css";

const Blogs = () => {
  const blogData = [
    {
      image: "/img/blogs/blog1.jpg",
      title: "Çini sanatıyla geçmişe zarif bir yolculuk",
      date: "25 Şub, 2021",
      comments: 0,
    },
    {
      image: "/img/blogs/blog2.jpg",
      title: "Minimal seramikle sıcak dokunuş",
      date: "10 Mar, 2021",
      comments: 2,
    },
    {
      image: "/img/blogs/blog3.jpg",
      title: "Vazolarla dekorasyonda sade şıklık",
      date: "18 Nis, 2021",
      comments: 5,
    },
  ];

  return (
    <section className="blogs">
      <div className="container">
        <div className="section-title">
          <h2>Bloğumuza Göz Atın</h2>
        </div>
        <ul className="blog-list">
          {blogData.map((item, index) => (
            <BlogItem
              key={index}
              image={item.image}
              title={item.title}
              date={item.date}
              comments={item.comments}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Blogs;
