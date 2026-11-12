# Leben in Deutschland – Ôn thi

App ôn thi "Leben in Deutschland" / Einbürgerungstest: 310 câu chính thức của BAMF (300 câu chung + 10 câu Baden-Württemberg), kèm đáp án và bản dịch tiếng Việt (bật/tắt được).

- **⚡ Học nhanh**: 253 câu đại diện (bỏ câu trùng ý), mỗi câu có mẹo nhớ tiếng Việt
- **Luyện**: theo thứ tự, ngẫu nhiên, câu chưa làm, câu sai, câu Baden-Württemberg
- **🎧 Nghe**: app đọc to câu hỏi, đáp án đúng và mẹo (tiếng Đức + tiếng Việt), tự chuyển câu — để nghe khi đi xe
- **Thi thử**: 33 câu (30 + 3 BW), 60 phút, chấm điểm (≥15 đậu LiD, ≥17 đậu Einbürgerungstest)
- **Tra cứu**: tìm câu hỏi theo số hoặc từ khoá, xem đáp án
- Tiến độ được lưu trên trình duyệt; có thể "Thêm vào màn hình chính" trên điện thoại

Nguồn câu hỏi: BAMF Gesamtfragenkatalog (Stand 07.05.2025).

## Đăng nhập Google & đồng bộ (Firebase)

App chạy bình thường khi `firebase-config.js` để `null`. Để bật đăng nhập Google và lưu tiến độ lên mây:

1. Tạo project ở https://console.firebase.google.com
2. **Build → Authentication → Get started → Sign-in method → Google → Enable**
3. **Authentication → Settings → Authorized domains → Add domain:** `dothanhdatdo.github.io`
4. **Build → Firestore Database → Create database** (chọn vùng `europe-west3` Frankfurt, Production mode)
5. **Firestore → Rules:** dán nội dung file `firestore.rules` → Publish
6. **Project settings → Your apps → Web (</>)** → đăng ký app → copy `firebaseConfig` vào `firebase-config.js`

Dữ liệu mỗi người nằm ở `users/{uid}`; quy tắc bảo mật chỉ cho phép người đó đọc/ghi dữ liệu của chính mình.
