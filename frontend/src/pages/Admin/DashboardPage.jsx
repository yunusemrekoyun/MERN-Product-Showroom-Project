import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DashboardPage = () => {
  const [productTimeData, setProductTimeData] = useState([]);
  const [blogTimeData, setBlogTimeData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProductLikes, setTotalProductLikes] = useState(0);
  const [totalBlogLikes, setTotalBlogLikes] = useState(0);
  const [totalVisitedProductsThisMonth, setTotalVisitedProductsThisMonth] =
    useState(0);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchVisitDurations = async () => {
      try {
        const [productRes, blogRes] = await Promise.all([
          fetch(`${apiUrl}/api/visits/total-duration?type=product`),
          fetch(`${apiUrl}/api/visits/total-duration?type=blog`),
        ]);

        const productData = await productRes.json();
        const blogData = await blogRes.json();

        const formatData = (arr) =>
          arr.map((item) => ({
            name: item.name,
            harcananSure: Math.round(item.totalDuration / 1000 / 60), // dakika
          }));

        setProductTimeData(formatData(productData));
        setBlogTimeData(formatData(blogData));
      } catch (err) {
        console.error("Ziyaret süresi verisi alınamadı:", err);
      }
    };

    const fetchGeneralStats = async () => {
      try {
        const [usersRes, productLikesRes, blogLikesRes, monthlyVisitedRes] =
          await Promise.all([
            fetch(`${apiUrl}/api/users/count`),
            fetch(`${apiUrl}/api/users/favorites/total-count`),
            fetch(`${apiUrl}/api/blogs/likes/total-count`),
            fetch(`${apiUrl}/api/visits/monthly-unique-products`),
          ]);

        const users = await usersRes.json();
        const productLikes = await productLikesRes.json();
        const blogLikes = await blogLikesRes.json();
        const monthlyVisited = await monthlyVisitedRes.json();

        setTotalUsers(users.total);
        setTotalProductLikes(productLikes.total);
        setTotalBlogLikes(blogLikes.total);
        setTotalVisitedProductsThisMonth(monthlyVisited.total);
      } catch (err) {
        console.error("Genel istatistikler alınamadı:", err);
      }
    };

    fetchVisitDurations();
    fetchGeneralStats();
  }, [apiUrl]);

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bu Ayki Ziyaret Edilen Ürün Sayısı"
              value={totalVisitedProductsThisMonth}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Toplam Kullanıcı Sayısı" value={totalUsers} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Toplam Ürün Beğenisi" value={totalProductLikes} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Toplam Blog Beğenisi" value={totalBlogLikes} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <h2>Hangi Üründe Ne Kadar Vakit Harcandı (Dakika)</h2>
        <LineChart
          width={600}
          height={300}
          data={productTimeData}
          margin={{ top: 5, right: 30, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="harcananSure"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <h2>Hangi Blogda Ne Kadar Vakit Harcandı (Dakika)</h2>
        <LineChart
          width={600}
          height={300}
          data={blogTimeData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="harcananSure"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </Card>
    </div>
  );
};

export default DashboardPage;
