const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3000;

// Cấu hình CORS để cho phép frontend kết nối với backend
app.use(cors());

// Kết nối với cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",  // Thay bằng tên người dùng của bạn
  password: "123",  // Thay bằng mật khẩu của bạn
  database: "GameDB"
});

// Kết nối tới MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

// API để lấy bảng xếp hạng theo điểm cao nhất
app.get("/leaderboard", (req, res) => {
  const query = "SELECT username, score FROM Players ORDER BY score DESC LIMIT 10"; // Lấy top 10 người chơi

  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Lỗi truy vấn cơ sở dữ liệu");
      return;
    }
    res.json(results);
  });
});

// Lắng nghe yêu cầu từ client
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
