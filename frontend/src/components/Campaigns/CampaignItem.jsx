import PropTypes from "prop-types";
import "./CampaignItem.css";

const CampaignItem = ({ campaign }) => {
  return (
    <div
      className="campaign-item"
      style={{
        backgroundImage: `url(data:image/jpeg;base64,${campaign.background})`,
      }}
    >
      <h3 className="campaign-title">{campaign.title}</h3>
      <p className="campaign-desc">{campaign.description}</p>
      <a href="#" className="btn btn-primary">
        View All <i className="bi bi-arrow-right"></i>
      </a>
    </div>
  );
};

CampaignItem.propTypes = {
  campaign: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    background: PropTypes.string,
    description: PropTypes.string,
    products: PropTypes.array,
  }).isRequired,
};

export default CampaignItem;
