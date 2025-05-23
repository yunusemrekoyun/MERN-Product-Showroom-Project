// src/pages/UpdateProductPage.jsx
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Upload,
  message,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import imageCompression from "browser-image-compression";

const UpdateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // İlk verileri çek ve form ile fileList'e yerleştir
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${apiUrl}/api/categories`),
          fetch(`${apiUrl}/api/products/${productId}`),
        ]);
        if (!catRes.ok || !prodRes.ok) throw new Error();
        const [cats, prod] = await Promise.all([catRes.json(), prodRes.json()]);
        setCategories(cats);
        form.setFieldsValue({
          name: prod.name,
          category: prod.category,
          current: prod.price.current,
          discount: prod.price.discount,
          description: prod.description,
          colors: prod.colors.join("\n"),
          sizes: prod.sizes.join("\n"),
        });
        // Mevcut resimleri preview için fileList'e ekle
        setFileList(
          prod.img.map((_, i) => ({
            uid: `${prod._id}-${i}`,
            name: `Resim ${i + 1}`,
            status: "done",
            url: `${apiUrl}/api/products/${prod._id}/image/${i}`,
            thumbUrl: `${apiUrl}/api/products/${prod._id}/image/${i}`,
          }))
        );
      } catch (err) {
        console.error(err);
        message.error("Veri yüklenirken hata oldu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, productId, form]);

  const handleUploadChange = ({ fileList }) => {
    // Maksimum 5 resim
    setFileList(fileList.slice(-5));
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append(
        "price",
        JSON.stringify({ current: values.current, discount: values.discount })
      );
      formData.append("description", values.description);
      formData.append(
        "colors",
        JSON.stringify(values.colors.trim().split("\n"))
      );
      formData.append("sizes", JSON.stringify(values.sizes.trim().split("\n")));

      // Sadece yeni yüklenen dosyaları ekle
      for (const file of fileList) {
        if (file.originFileObj) {
          const compressed = await imageCompression(file.originFileObj, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });
          formData.append("img", compressed);
        }
      }

      const res = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        message.success("Ürün başarıyla güncellendi.");
        navigate("/admin/products");
      } else {
        message.error("Ürün güncellenirken hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      message.error("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Ürün İsmi"
          name="name"
          rules={[{ required: true, message: "Ürün adı zorunlu" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ürün Kategorisi"
          name="category"
          rules={[{ required: true, message: "Kategori seçin" }]}
        >
          <Select placeholder="Kategori seçin">
            {categories.map((c) => (
              <Select.Option key={c._id} value={c._id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Fiyat">
          <Input.Group compact>
            <Form.Item
              name="current"
              noStyle
              rules={[{ required: true, message: "Fiyat girin" }]}
            >
              <InputNumber
                style={{ width: "60%" }}
                formatter={(v) => `₺ ${v}`}
                parser={(v) => v.replace(/₺\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              name="discount"
              noStyle
              rules={[{ required: true, message: "İndirim oranı girin" }]}
            >
              <InputNumber
                style={{ width: "40%" }}
                formatter={(v) => `${v}%`}
                parser={(v) => v.replace("%", "")}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Ürün Açıklaması"
          name="description"
          rules={[{ required: true, message: "Açıklama zorunlu" }]}
        >
          <ReactQuill theme="snow" style={{ background: "white" }} />
        </Form.Item>

        <Form.Item label="Ürün Görselleri">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            accept="image/*"
            multiple
          >
            {fileList.length < 5 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Yükle</div>
              </div>
            )}
          </Upload>
          <small>En fazla 5 görsel yükleyebilirsiniz.</small>
        </Form.Item>

        <Form.Item
          label="Ürün Renkleri (Her satır bir renk)"
          name="colors"
          rules={[{ required: true, message: "Renk girin" }]}
        >
          <Input.TextArea autoSize={{ minRows: 2 }} placeholder="#FF0000" />
        </Form.Item>

        <Form.Item
          label="Ürün Bedenleri (Her satır bir beden)"
          name="sizes"
          rules={[{ required: true, message: "Beden girin" }]}
        >
          <Input.TextArea autoSize={{ minRows: 2 }} placeholder="S" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Güncelle
            </Button>
            <Button onClick={() => navigate(-1)}>İptal</Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default UpdateProductPage;
