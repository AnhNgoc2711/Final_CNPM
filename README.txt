============================= Coffee Shop Menu System =============================

Giới Thiệu:
Hệ thống quản lý thực đơn cho quán cà phê đơn giản với giao diện HTML và backend sử dụng Node.js + Express.
Cho phép đăng ký, đăng nhập, xem thực đơn, và với tài khoản admin có thể thêm/sửa/xoá món ăn.

---------------------------- System Requirements ----------------------------

- Operating System: Windows / macOS / Linux
- Node.js: version 14.x hoặc cao hơn
  → Download: https://nodejs.org/en
- Trình duyệt bất kỳ (Chrome, Firefox,...)
- Postman (nếu muốn kiểm thử API): https://www.postman.com/downloads/

---------------------------- Setup Instructions ----------------------------

1. Clone hoặc tải source code về  
   → Giải nén toàn bộ thư mục dự án vào một thư mục trên máy.

2. Mở terminal (hoặc CMD) và điều hướng vào thư mục dự án: cd đường-dẫn-tới-thư-mục-dự-án

3. Khởi tạo và cài đặt các thư viện cần thiết:

Nếu chưa có file package.json, chạy: npm init -y

Sau đó cài đặt các thư viện: npm install express body-parser cors jsonwebtoken

----------------------------Running the Server-----------------------------------

Chạy server bằng Node: node server.js

kết quả sẽ ra : Server running on port 3000

------------------------ Truy cập Giao Diện Người Dùng ------------------------

Sau khi server chạy thành công, bạn có thể mở các file HTML trong trình duyệt như:

home.html – Trang chủ

login.html – Đăng nhập

signup.html – Đăng ký tài khoản

menu.html – Xem thực đơn

order.html – Đặt món

my_order.html – Xem giỏ hàng và lịch sử đặt món của tài khoản

booking.html - Đặt bàn

admin.html - Thực hiện các chức năng của admin

Sau khi đăng nhập, click vào icon user ở góc phải, chọn Setting để truy cập vào trang điều khiển của admin hoặc chọn My cart để truy cập vào giỏ hàng của người dùng.


-------------------------- Tài khoản mẫu để đăng nhập --------------------------

File user.json chứa danh sách tài khoản. 
Bạn có thể đăng nhập bằng tài khoản có sẵn:
Tài khoản admin có quyền thêm/sửa/xoá món ăn.
username: admin1
password: 123456

Tài khoản user để thực hiện các chức năng đặt món,đặt bàn.
username: user1
password: 123456

Hoặc có thể tự đăng ký tài khoản mới rồi đăng nhập bằng tài khoản vừa tạo.

-------------------------- Testing API với Postman --------------------------

Base URL: http://localhost:3000

1. Đăng nhập
POST /login
Body / raw / (JSON):
	{
    	"username": "admin1",
    	"password": "123456",
    	"role": "admin"
  	}
→ Trả về accessToken để sử dụng cho các API cần xác thực.

2. Xem thực đơn
GET /menu → Không cần đăng nhập.
http://localhost:3000/menu

3. Thêm món (chỉ dành cho admin)
POST /menu
Headers: Authorization: Bearer <accessToken>
Body (JSON):
{
    "name": "TEA PLUS",
    "description": "sieu ngon luon nha",
    "price": 4.5,
    "image": "img/slogan.png",
    "category": "tea"
  }
→ Trả về "message": "Item added!",

4. Sửa món
PUT /menu/:id
Headers: Authorization: Bearer <accessToken>
Body:
{
    "name": "TEA PLUS AP1",
    "description": "sieu ngon luon nha",
    "price": 4.5,
    "image": "img/slogan.png",
    "category": "tea"
}
→ Trả về "message": "Menu item updated successfully!"

5. Xoá món
DELETE /menu/:id

Headers: Authorization: Bearer <accessToken>
→ Trả về "message": "Menu item deleted successfully!"