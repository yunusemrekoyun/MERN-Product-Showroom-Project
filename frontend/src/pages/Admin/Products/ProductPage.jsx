// src/pages/Admin/Products/ProductPage.jsx

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
      const res = await fetch(`${apiUrl}/api/products`);
      if (!res.ok) throw new Error("Veri getirilemedi");

      const result = await res.json();
      // Eğer result.products varsa onu, yoksa result direkt dizi
      const list = Array.isArray(result)
        ? result
        : Array.isArray(result.products)
        ? result.products
        : [];

      setDataSource(list);
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
      if (!res.ok) throw new Error("Silme başarısız");

      message.success("Ürün başarıyla silindi.");
      setDataSource((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
      message.error("Sunucu hatası.");
    }
  };

  const columns = [
    {
      title: "Görsel",
      dataIndex: "_id",
      key: "img",
      render: (id) => (
        <img
          src={`${apiUrl}/api/products/${id}/image/mainImages/0`}
          alt="Ürün"
          width={100}
          loading="lazy"
        />
      ),
    },
    {
      title: "İsim",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Kategori",
      dataIndex: ["category", "name"],
      key: "category",
      render: (_, record) => record.category?.name || "—",
    },
    {
      title: "Alt Kategori",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (s) => s || "—",
    },
    // {
    //   title: "Fiyat",
    //   dataIndex: "price",
    //   key: "price",
    //   render: (p) =>
    //     p?.current != null ? <span>₺{p.current.toFixed(2)}</span> : "—",
    // },
    // {
    //   title: "İndirim",
    //   dataIndex: "price",
    //   key: "discount",
    //   render: (p) =>
    //     p?.discount != null && p.discount > 0 ? (
    //       <span>%{p.discount}</span>
    //     ) : (
    //       "—"
    //     ),
    // },
    {
      title: "İşlemler",
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
