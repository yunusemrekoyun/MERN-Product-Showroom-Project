import { useEffect, useState } from "react";
import CampaignItem from "./CampaignItem";
import "./Campaigns.css";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`
        );
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error("Kampanyalar alınamadı:", err);
      }
    };

    fetchCampaigns();
  }, []);

  // Her 2'li kampanya için ayrı bir wrapper oluşturuluyor
  const chunked = campaigns.reduce((acc, _, i) => {
    if (i % 2 === 0) acc.push(campaigns.slice(i, i + 2));
    return acc;
  }, []);

  return (
    <section className="campaigns">
      <div className="container">
        {chunked.map((pair, index) => (
          <div className="campaigns-wrapper" key={index}>
            {pair.map((item) => (
              <CampaignItem key={item._id} campaign={item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Campaigns;
