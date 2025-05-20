// src/pages/UpdateCategoryPage.jsx
import { Button, Form, Input, Spin, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

const UpdateCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Mevcut veriyi çek, form ve fileList’e koy
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/categories/${categoryId}`);
        if (!res.ok) throw new Error("Kategori bulunamadı");
        const data = await res.json();
        form.setFieldsValue({ name: data.name });
        setFileList([
          {
            uid: data._id,
            name: "Mevcut Görsel",
            status: "done",
            url: `data:image/png;base64,${data.img}`,
            thumbUrl: `data:image/png;base64,${data.img}`,
          },
        ]);
      } catch (err) {
        message.error("Veri getirme hatası");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [apiUrl, categoryId, form]);

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const onFinish = async ({ name }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);

      // Yeni dosya seçilmişse sıkıştır ve ekle
      const file = fileList[0]?.originFileObj;
      if (file) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
        formData.append("img", compressed);
      }

      const res = await fetch(
        `${apiUrl}/api/categories/${categoryId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        message.success("Kategori başarıyla güncellendi.");
        navigate("/admin/categories");
      } else {
        message.error("Güncelleme başarısız.");
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
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          label="Kategori İsmi"
          name="name"
          rules={[{ required: true, message: "Kategori adı zorunlu" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Kategori Görseli">
          <Upload
            listType="picture"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Görsel Seç / Değiştir</Button>
          </Upload>
        </Form.Item>

        <Form.Item>

            <Button type="primary" htmlType="submit">
              Güncelle
            </Button>
            <Button onClick={() => navigate(-1)}>İptal</Button>

        </Form.Item>
      </Form>
    </Spin>
  );
};

export default UpdateCategoryPage;