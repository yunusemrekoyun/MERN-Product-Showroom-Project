import { useEffect, useState } from "react";
import { List, Avatar, Form, Button, Input, message } from "antd";
import { Comment } from "@ant-design/compatible";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import "./BlogComments.css";

const BlogComments = ({ blogId, user }) => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchComments = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/blogs/${blogId}/comments`);
      if (!res.ok) throw new Error();
      setComments(await res.json());
    } catch {
      message.error("Yorumlar yüklenemedi");
    }
  };

  useEffect(() => {
    fetch(`${apiUrl}/api/blogs/${blogId}/comments`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setComments)
      .catch(() => message.error("Yorumlar yüklenemedi"));
  }, [apiUrl, blogId]);

  const handleSubmit = async () => {
    if (!user) return message.warning("Yorum yapmak için giriş yapın");
    if (!value.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, content: value }),
      });
      if (res.ok) {
        setValue("");
        fetchComments();
      } else {
        message.error("Yorum eklenemedi");
      }
    } catch {
      message.error("Sunucu hatası");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <h3>Yorumlar ({comments.length})</h3>

      {comments.length === 0 ? (
        <div className="no-comments">Henüz yorum yapılmamış. İlk sen ol!</div>
      ) : (
        <List
          dataSource={comments}
          itemLayout="horizontal"
          renderItem={(item) => (
            <Comment
              author={<strong>{item.user.username}</strong>}
              avatar={<Avatar icon={<UserOutlined />} />}
              content={<p>{item.content}</p>}
              datetime={dayjs(item.createdAt).format("DD MMM YYYY HH:mm")}
            />
          )}
        />
      )}

      {user && (
        <Form layout="vertical">
          <Form.Item style={{ marginTop: 20, marginBottom: 8 }}>
            <Input.TextArea
              rows={4}
              onChange={(e) => setValue(e.target.value)}
              value={value}
              placeholder="Yorumunuzu yazın..."
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              htmlType="submit"
              loading={submitting}
              onClick={handleSubmit}
              type="primary"
            >
              Yorum Yap
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

BlogComments.propTypes = {
  blogId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
  }),
};

export default BlogComments;
