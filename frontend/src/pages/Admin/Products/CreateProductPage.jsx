import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Upload,
  message,
  Space
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

const CreateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [mainImages, setMainImages] = useState([]);
  const [childImages1, setChildImages1] = useState([]);
  const [childImages2, setChildImages2] = useState([]);
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/categories`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCategories(data);
      } catch {
        message.error("Kategoriler yüklenemedi.");
      }
    };
    fetchCategories();
  }, [apiUrl]);

  const handleCategoryChange = (categoryId) => {
    const selected = categories.find((cat) => cat._id === categoryId);
    if (selected?.subcategories?.length > 0) {
      setSubcategories(selected.subcategories);
    } else {
      setSubcategories([]);
      message.info("Bu kategorinin alt kategorisi bulunamadı.");
    }
    form.setFieldsValue({ subcategory: undefined });
  };

  const compressAndAppend = async (images, fieldName, formData) => {
    for (const fileWrapper of images) {
      const file = fileWrapper.originFileObj;
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
      formData.append(fieldName, compressed);
    }
  };

  const onFinish = async (values) => {
    if (mainImages.length === 0) {
      return message.error("En az 1 ana görsel gereklidir.");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("subcategory", values.subcategory || "");
      formData.append("buyLink", values.buyLink || "");
      formData.append(
        "price",
        JSON.stringify({ current: values.current, discount: values.discount })
      );
      formData.append("opt1", JSON.stringify((values.opt1 || "").split("\n")));
      formData.append("opt2", JSON.stringify((values.opt2 || "").split("\n")));
      formData.append("mainDescription", values.mainDescription || "");
      formData.append("childDescription1", values.childDescription1 || "");
      formData.append("childDescription2", values.childDescription2 || "");

      await compressAndAppend(mainImages, "mainImages", formData);
      await compressAndAppend(childImages1, "childImages1", formData);
      await compressAndAppend(childImages2, "childImages2", formData);

      const res = await fetch(`${apiUrl}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        message.success("Ürün oluşturuldu.");
        form.resetFields();
        setMainImages([]);
        setChildImages1([]);
        setChildImages2([]);
        setSubcategories([]);
      } else {
        const result = await res.json();
        message.error(result.error || "Ürün oluşturulamadı.");
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
          label="Kategori"
          name="category"
          rules={[{ required: true, message: "Kategori seçin" }]}
        >
          <Select placeholder="Kategori seçin" onChange={handleCategoryChange}>
            {categories.map((c) => (
              <Select.Option key={c._id} value={c._id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Alt Kategori" name="subcategory">
          <Select
            placeholder={
              subcategories.length > 0
                ? "Alt kategori seçin"
                : "Alt kategori bulunamadı"
            }
            disabled={subcategories.length === 0}
          >
            {subcategories.map((sub, index) => (
              <Select.Option key={index} value={sub}>
                {sub}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Satın Alma Linki" name="buyLink">
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item label="Fiyat">
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item name="current" noStyle>
              <InputNumber placeholder="₺" style={{ width: "50%" }} />
            </Form.Item>
            <Form.Item name="discount" noStyle>
              <InputNumber
                placeholder="%"
                formatter={(v) => `${v}%`}
                parser={(v) => v.replace("%", "")}
                style={{ width: "50%" }}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item label="Opsiyon 1 (renk vs)" name="opt1">
          <Input.TextArea placeholder="Her satıra bir seçenek" />
        </Form.Item>

        <Form.Item label="Opsiyon 2 (beden vs)" name="opt2">
          <Input.TextArea placeholder="Her satıra bir seçenek" />
        </Form.Item>

        <Form.Item label="Ana Açıklama" name="mainDescription">
          <Input.TextArea autoSize={{ minRows: 2 }} />
        </Form.Item>
        <Form.Item label="Alt Açıklama 1" name="childDescription1">
          <Input.TextArea autoSize={{ minRows: 2 }} />
        </Form.Item>
        <Form.Item label="Alt Açıklama 2" name="childDescription2">
          <Input.TextArea autoSize={{ minRows: 2 }} />
        </Form.Item>

        <Form.Item label="Ana Görseller">
          <Upload
            listType="picture-card"
            fileList={mainImages}
            beforeUpload={() => false}
            onChange={({ fileList }) => setMainImages(fileList)}
            accept="image/*"
            multiple
          >
            {mainImages.length < 5 && (
              <div>
                <UploadOutlined />
                <div>Yükle</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Alt Görseller 1">
          <Upload
            listType="picture-card"
            fileList={childImages1}
            beforeUpload={() => false}
            onChange={({ fileList }) => setChildImages1(fileList)}
            accept="image/*"
            multiple
          >
            {childImages1.length < 5 && (
              <div>
                <UploadOutlined />
                <div>Yükle</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Alt Görseller 2">
          <Upload
            listType="picture-card"
            fileList={childImages2}
            beforeUpload={() => false}
            onChange={({ fileList }) => setChildImages2(fileList)}
            accept="image/*"
            multiple
          >
            {childImages2.length < 5 && (
              <div>
                <UploadOutlined />
                <div>Yükle</div>
              </div>
            )}
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

export default CreateProductPage;
