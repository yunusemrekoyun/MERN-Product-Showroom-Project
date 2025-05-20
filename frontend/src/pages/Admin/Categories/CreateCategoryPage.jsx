// src/pages/CreateCategoryPage.jsx
import { Button, Form, Input, Spin, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import imageCompression from "browser-image-compression";

const CreateCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const onFinish = async ({ name }) => {
    if (fileList.length === 0) {
      message.error("Lütfen bir görsel seçin.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);

      // Sıkıştır ve ekle
      const file = fileList[0].originFileObj;
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
      formData.append("img", compressedFile);

      const response = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Kategori başarıyla oluşturuldu.");
        form.resetFields();
        setFileList([]);
      } else {
        message.error("Kategori oluşturulamadı.");
      }
    } catch (error) {
      console.error("Kategori oluşturma hatası:", error);
      message.error("Sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        name="create-category"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          label="Kategori İsmi"
          name="name"
          rules={[{ required: true, message: "Lütfen kategori adını girin!" }]}
        >
          <Input placeholder="Örneğin: Çini Desenleri" />
        </Form.Item>

        <Form.Item
          label="Kategori Görseli"
          required
          // not using `name`, controlling via fileList state
        >
          <Upload
            listType="picture"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Görsel Seç</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Oluştur
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default CreateCategoryPage;
