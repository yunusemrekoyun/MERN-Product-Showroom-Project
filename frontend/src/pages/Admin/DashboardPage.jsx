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
  /* — Özet istatistik kartları — */
  const totalVisitedProductsThisMonth = 120; // örnek statik değer
  const totalUsers = 50; // örnek statik değer
  const totalProductLikes = 250; // örnek statik değer
  const totalBlogLikes = 75; // örnek statik değer  <-- YENİ

  /* — Ürün bazlı harcanan süre grafiği — */
  const productTimeData = [
    { name: "Ürün A", harcananSure: 120 },
    { name: "Ürün B", harcananSure: 95 },
    { name: "Ürün C", harcananSure: 150 },
    { name: "Ürün D", harcananSure: 60 },
  ];

  /* — Blog bazlı harcanan süre grafiği — */
  const blogTimeData = [
    { name: "Blog 1", harcananSure: 80 },
    { name: "Blog 2", harcananSure: 110 },
    { name: "Blog 3", harcananSure: 45 },
    { name: "Blog 4", harcananSure: 130 },
  ];

  return (
    <div>
      {/* Özet kartlar */}
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

      {/* Ürün bazlı harcanan süre grafiği */}
      <Card style={{ marginTop: 20 }}>
        <h2>Hangi Üründe Ne Kadar Vakit Harcandı</h2>
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

      {/* Blog bazlı harcanan süre grafiği */}
      <Card style={{ marginTop: 20 }}>
        <h2>Hangi Blogda Ne Kadar Vakit Harcandı</h2>
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
