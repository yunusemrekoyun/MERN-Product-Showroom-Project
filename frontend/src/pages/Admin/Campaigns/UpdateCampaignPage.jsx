import { Button, Form, Input, Select, Spin, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCampaignPage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, campaignRes] = await Promise.all([
          fetch(`${apiUrl}/api/products`),
          fetch(`${apiUrl}/api/campaigns/${id}`),
        ]);

        if (!productsRes.ok || !campaignRes.ok) {
          message.error("Veri getirme hatası");
          return;
        }

        const [productsData, campaignData] = await Promise.all([
          productsRes.json(),
          campaignRes.json(),
        ]);

        setProducts(productsData);

        form.setFieldsValue({
          title: campaignData.title,
          description: campaignData.description,
          selectedProducts: campaignData.selectedProducts,
        });
      } catch (err) {
        console.error("Hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, form, id]);

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const file = values.image?.file?.originFileObj;
      let base64Image = null;

      if (file) {
        base64Image = await toBase64(file);
      }

      const payload = {
        title: values.title,
        description: values.description,
        selectedProducts: values.selectedProducts,
        ...(base64Image && { image: base64Image }),
      };

      const res = await fetch(`${apiUrl}/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        message.success("Kampanya başarıyla güncellendi");
        navigate("/admin/campaigns");
      } else {
        message.error("Güncelleme başarısız oldu");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Kampanya Başlığı"
          name="title"
          rules={[{ required: true, message: "Başlık girin" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Kampanya Açıklaması"
          name="description"
          rules={[{ required: true, message: "Açıklama girin" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Görsel (Yeniden yüklemek için)">
          <Form.Item name="image" noStyle>
            <Upload maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Görsel Yükle</Button>
            </Upload>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label="İlgili Ürünler"
          name="selectedProducts"
          rules={[{ required: true, message: "Ürün seçin" }]}
        >
          <Select mode="multiple" allowClear placeholder="Ürün seçin">
            {products.map((p) => (
              <Select.Option key={p._id} value={p._id}>
                {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Güncelle
        </Button>
      </Form>
    </Spin>
  );
};

export default UpdateCampaignPage;
