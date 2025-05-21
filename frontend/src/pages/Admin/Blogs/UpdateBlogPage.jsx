import { Button, Form, Spin, Upload, message, Space, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import imageCompression from "browser-image-compression";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // sadece base64 kısmı
    reader.onerror = (error) => reject(error);
  });
};

const UpdateBlogPage = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { blogId } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/blogs/${blogId}`);
        if (!res.ok) throw new Error("Blog bulunamadı");
        const blog = await res.json();
        form.setFieldsValue({
          title: blog.title,
          content: blog.content,
        });
        setFileList(
          blog.images.map((b64, i) => ({
            uid: `${blog.blogId}-${i}`,
            name: `Görsel ${i + 1}`,
            status: "done",
            url: `data:image/png;base64,${b64}`,
            thumbUrl: `data:image/png;base64,${b64}`,
          }))
        );
      } catch (err) {
        console.error(err);
        message.error("Blog verisi alınamadı");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [apiUrl, blogId, form]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList.slice(-3));
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);

      const base64Images = [];

      for (const fileItem of fileList) {
        if (fileItem.originFileObj) {
          const compressed = await imageCompression(fileItem.originFileObj, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });
          const base64 = await convertToBase64(compressed);
          base64Images.push(base64);
        } else if (fileItem.url) {
          base64Images.push(fileItem.url.split(",")[1]);
        }
      }

      formData.append("images", JSON.stringify(base64Images));

      const res = await fetch(`${apiUrl}/api/blogs/${blogId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        message.success("Blog başarıyla güncellendi");
        navigate("/admin/blogs");
      } else {
        message.error("Blog güncellenemedi");
      }
    } catch (err) {
      console.error(err);
      message.error("Sunucu hatası oluştu");
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
        style={{ maxWidth: 600, margin: "0 auto" }}
      >
        <Form.Item
          label="Blog Başlığı"
          name="title"
          rules={[{ required: true, message: "Lütfen başlık girin" }]}
        >
          <Input placeholder="Blog başlığını girin" />
        </Form.Item>

        <Form.Item
          label="İçerik"
          name="content"
          rules={[{ required: true, message: "Lütfen içerik girin" }]}
        >
          <ReactQuill theme="snow" style={{ background: "#fff" }} />
        </Form.Item>

        <Form.Item label="Kapak Görselleri">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            accept="image/*"
            multiple
          >
            {fileList.length < 3 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Yükle / Değiştir</div>
              </div>
            )}
          </Upload>
          <small>En fazla 3 görsel yükleyebilirsiniz.</small>
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

export default UpdateBlogPage;
