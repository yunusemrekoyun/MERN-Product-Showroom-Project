import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "./BlogItem.css";

const BlogItem = ({ blogId, image, title, date, comments, likes }) => (
  <li className="blog-item">
    <Link to={`/blogs/${blogId}`} className="blog-image-wrapper">
      <img
        src={`data:image/png;base64,${image}`}
        alt={title}
        className="blog-image"
      />
    </Link>
    <div className="blog-info">
      <div className="blog-info-top">
        <span>{dayjs(date).format("DD MMM, YYYY")}</span> -
        <span>{comments} Yorum</span>
      </div>
      <div className="blog-info-center">
        <Link to={`/blogs/${blogId}`}>{title}</Link>
      </div>
      <div className="blog-info-bottom">
        <Link to={`/blogs/${blogId}`}>Daha Fazla</Link>
      </div>
      <div className="blog-info-likes">{likes} Beğeni</div>
    </div>
  </li>
);

BlogItem.propTypes = {
  blogId: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  comments: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
};

export default BlogItem;
