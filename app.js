const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const fs = require('fs'); // Import module File System

// Hàm ghi danh sách người dùng vào file users.json
const saveUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2)); // Ghi dữ liệu vào file JSON
};

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Lưu trữ thông tin người dùng (tạm thời dùng mảng)
const users = [];

// Route trang chính
app.get('/', (req, res) => {
    res.render('index', { title: 'Quản lý bóng bàn' });
});

// Route xử lý Đăng ký
app.post('/register', (req, res) => {
    const { name, email, phone } = req.body;

    // Thêm người dùng mới vào mảng
    const newUser = { name, email, phone };
    users.push(newUser);

    // Lưu danh sách vào file JSON
    saveUsers(users);

    console.log(`Email chúc mừng đã gửi tới: ${email}`);

    // Hiển thị trang chúc mừng
    res.render('success', { message: 'Chúc mừng bạn đã Đăng ký thành công!' });
});


// Route xử lý Đăng nhập
app.post('/login', (req, res) => {
    const { email } = req.body;

    // Kiểm tra email trong danh sách người dùng
    const user = users.find(u => u.email === email);

    if (user) {
        // Mô phỏng gửi link đăng nhập (thực tế sẽ gửi qua email, ở đây chỉ in ra console)
        console.log(`Link đăng nhập đã gửi tới: ${email}`);
        res.render('success', { message: 'Link đăng nhập đã được gửi tới email của bạn!' });
    } else {
        // Hiển thị thông báo lỗi nếu email không tồn tại
        res.render('error', { message: 'Email không tồn tại trong hệ thống. Vui lòng đăng ký trước!' });
    }
});


// Route hiển thị danh sách người chơi
app.get('/players', (req, res) => {
    res.render('players', { players: users }); // Gửi danh sách người chơi tới giao diện
});

// Lắng nghe server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
