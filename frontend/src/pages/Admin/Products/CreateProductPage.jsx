import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import imageCompression from "browser-image-compression";

const CreateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/categories`);
        if (!res.ok) throw new Error();
        setCategories(await res.json());
      } catch {
        message.error("Kategori yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList.slice(-5)); // max 5 görsel
  };

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      return message.error("Lütfen en az 1 görsel seçin.");
    }

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

      // Dosyaları sıkıştırıp ekle
      for (const fileWrapper of fileList) {
        const file = fileWrapper.originFileObj;
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
        formData.append("img", compressed);
      }

      const res = await fetch(`${apiUrl}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        message.success("Ürün başarıyla oluşturuldu.");
        form.resetFields();
        setFileList([]);
      } else {
        message.error("Ürün oluşturulamadı.");
      }
    } catch (err) {
      console.error(err);
      message.error("Sunucu hatası oluştu.");
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

        <Form.Item label="Fiyat" required>
          <Input.Group compact>
            <Form.Item
              name="current"
              noStyle
              rules={[{ required: true, message: "Fiyat girin" }]}
            >
              <InputNumber placeholder="₺0.00" style={{ width: "60%" }} />
            </Form.Item>
            <Form.Item
              name="discount"
              noStyle
              rules={[{ required: true, message: "İndirim oranı girin" }]}
            >
              <InputNumber
                formatter={(v) => `${v}%`}
                parser={(v) => v.replace("%", "")}
                placeholder="0%"
                style={{ width: "40%" }}
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

        <Form.Item label="Ürün Görselleri" required>
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
          <Input.TextArea autoSize={{ minRows: 2 }} placeholder="ör: #FF0000" />
        </Form.Item>

        <Form.Item
          label="Ürün Bedenleri (Her satır bir beden)"
          name="sizes"
          rules={[{ required: true, message: "Beden girin" }]}
        >
          <Input.TextArea autoSize={{ minRows: 2 }} placeholder="ör: S" />
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

export default CreateProductPage;
