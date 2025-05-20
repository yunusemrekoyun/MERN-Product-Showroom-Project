import PropTypes from "prop-types";
import "./BlogItem.css";

const BlogItem = ({ image, title, date, comments }) => {
  return (
    <li className="blog-item">
      <a href="#" className="blog-image">
        <img src={image} alt={title} />
      </a>
      <div className="blog-info">
        <div className="blog-info-top">
          <span>{date} </span>-<span>{comments} Yorum</span>
        </div>
        <div className="blog-info-center">
          <a href="#">{title}</a>
        </div>
        <div className="blog-info-bottom">
          <a href="#">Daha Fazla</a>
        </div>
      </div>
    </li>
  );
};

BlogItem.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  comments: PropTypes.number.isRequired,
};

export default BlogItem;
