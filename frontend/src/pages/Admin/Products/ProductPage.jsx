import { Button, Popconfirm, Space, Table, message } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        fetch(`${apiUrl}/api/categories`),
        fetch(`${apiUrl}/api/products`),
      ]);
      if (!categoriesRes.ok || !productsRes.ok) {
        message.error("Veri getirme başarısız.");
        return;
      }
      const [categories, products] = await Promise.all([
        categoriesRes.json(),
        productsRes.json(),
      ]);
      const withCat = products.map((p) => {
        const cat = categories.find((c) => c._id === p.category);
        return { ...p, categoryName: cat?.name || "" };
      });
      setDataSource(withCat);
    } catch (err) {
      console.error("Veri hatası:", err);
      message.error("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Ürün başarıyla silindi.");
        setDataSource((prev) => prev.filter((p) => p._id !== id));
      } else {
        message.error("Silme işlemi başarısız.");
      }
    } catch (err) {
      console.error("Silme hatası:", err);
      message.error("Sunucu hatası.");
    }
  };

  const columns = [
    {
      title: "Product Görseli",
      dataIndex: "_id",
      key: "img",
      render: (id) => (
        <img
          src={`${
            import.meta.env.VITE_API_BASE_URL
          }/api/products/${id}/image/0`}
          alt="Ürün"
          width={100}
          loading="lazy"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (t) => <b>{t}</b>,
    },
    {
      title: "Kategori",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: ({ current }) => <span>${current.toFixed(2)}</span>,
    },
    {
      title: "İndirim",
      dataIndex: "price",
      key: "discount",
      render: ({ discount }) => <span> %{discount}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/admin/products/update/${record._id}`)}
          >
            Güncelle
          </Button>
          <Popconfirm
            title="Ürünü sil"
            description="Silmek istediğinizden emin misiniz?"
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => deleteProduct(record._id)}
          >
            <Button danger>Sil</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(r) => r._id}
      loading={loading}
    />
  );
};

export default ProductPage;
