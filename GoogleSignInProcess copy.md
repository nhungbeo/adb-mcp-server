****# Quy trình đăng nhập tài khoản Google tự động

## Thông tin thiết bị
adb devices

## Mục tiêu
- Tự động hóa quá trình thêm tài khoản Google trên thiết bị Android
- Sử dụng ADB commands và UI Automation

## Các bước thực hiện

### 1. Mở màn hình thêm tài khoản
```bash
adb shell am start -a android.settings.ADD_ACCOUNT_SETTINGS -n com.android.settings/.accounts.AddAccountSettings
```
**Kết quả:** Thành công (Starting: Intent { act=android.settings.ADD_ACCOUNT_SETTINGS cmp=com.android.settings/.accounts.AddAccountSettings })

**Lưu ý quan trọng:** Sau khi mở màn hình, cần chờ khoảng 10 giây để giao diện được load hoàn toàn trước khi thực hiện các thao tác tiếp theo.

**Lưu ý quan trọng:** sau 10 giây chưa thaấthaaaaaayvị trí nhâậ mail thì chay laạlai adb shell am start -a android.settings.ADD_ACCOUNT_SETTINGS -n com.android.settings/.accounts.AddAccountSettings

### 2. Thông tin đăng nhập
- Email: quhuy1972
- Password: 123456123

### 3. Tọa độ các phần tử UI
Dựa trên UI dump từ thiết bị:
- WebView Input Area: [0,54][1080,1758]
- Next Button: [837,1785][1035,1893]
- Vị trí tap cho input fields (điểm giữa WebView):
  + Email field: x=540 y=906 (giữa WebView)
  + Password field: x=540 y=906 (giữa WebView)
- Vị trí tap cho Next button: x=936 y=1839 (giữa nút Next)

### 4. Các lệnh tap và input cần thiết
```bash
# Chờ màn hình email hiện ra (10s)
sleep 10

# Tap vào vùng nhập email (tọa độ từ UI dump)
adb shell input tap 540 729

# Nhập email (không cần @gmail.com)
adb shell input text "@gmail.com"

# Tap nút Next/Sign in
adb shell input tap 936 1839

# Chờ màn hình password (5s)
sleep 5

# Tap vào vùng nhập password
adb shell input tap 540 906

# Chờ người dùng Nhập password lại
adb shell input text ""


# Tap nút Next/Sign in
adb shell input tap 936 1839

# Chờ màn hình Terms of Service (5s)
sleep 5

# Tap nút Accept (cùng vị trí với Next)
adb shell input tap 936 1839
```

**Lưu ý về tọa độ:**
- Tọa độ được tính dựa trên vị trí giữa của các phần tử UI
- WebView có thể scroll, nên vị trí tap cần điều chỉnh theo thực tế
- Nút Next/Sign in/Accept thường ở cùng một vị trí

### 5. Xử lý lỗi password
#### Trường hợp sai mật khẩu
Khi nhận thông báo "Wrong password. Try again or click Forgot password to reset it":
```bash
# Xóa password hiện tại bằng cách tap vào input field
adb shell input tap 540 635

# Xóa nội dung bằng phím Del (20 ký tự để đảm bảo xóa hết)
adb shell input keyevent KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL KEYCODE_DEL

# Nhập lại password
adb shell input text " 123456123"

# Tap Next để thử lại
adb shell input tap 936 1790
```

#### Các trường hợp lỗi khác có thể xảy ra
1. Không thể tap vào input field
   - Thử lại sau 5 giây
   - Kiểm tra lại tọa độ bằng `get_ui_elements`
2. ADBKeyboard không hoạt động
   - Kiểm tra trạng thái keyboard: `adb shell ime list -a`
   - Set lại keyboard: `adb shell ime set com.android.adbkeyboard/.AdbIME`
3. Kết nối bị mất
   - Kiểm tra thiết bị: `adb devices`
   - Kết nối lại nếu cần

### 6. Xác nhận mã số và chờ hoàn tất
Sau khi đăng nhập thành công, giao diện chuyển sang màn hình "Verify it’s you".
Dựa trên nội dung UI dump, ta nhận ra:
- Một đoạn văn hiển thị thông báo: "Google sent a notification to your POCO X6 Pro 5G and Vsmart Joy 4. Tap Yes on the notification, then tap 97 on your phone to verify it’s you."
- Phần hiển thị số "97" là dấu hiệu nhận biết rằng mã số xác nhận là "97".
Do đó, hệ thống xác nhận rằng mã số để hoàn tất quá trình đăng nhập là **97**.

**Chờ và kiểm tra xác nhận:**
Sau khi hiển thị mã số, cần chờ người dùng xác nhận trên điện thoại.
```bash
# Chờ 10 giây để người dùng xác nhận
sleep 10

# Kiểm tra lại UI để xem xác nhận đã hoàn tất chưa
# (Lệnh get_ui_elements sẽ được thực hiện ở bước này)
```
**Dấu hiệu xác nhận thành công:**
- Màn hình "Verify it’s you" biến mất.

### 7. Chọn người dùng thiết bị
Giao diện chuyển sang màn hình "Who will be using this device?".
- Chọn "I will be using this device" (nếu chưa được chọn).
- Tap vào nút "NEXT" để tiếp tục.
Tọa độ nút "NEXT": [837,1785][1035,1893]
Điểm giữa: x=936, y=1839

```bash
# Tap vào nút NEXT
adb shell input tap 936 1839
```

### 8. Cập nhật số điện thoại
Giao diện chuyển sang màn hình "Keep your account updated with this phone’s number".
- Vuốt màn hình từ dưới lên trên để hiển thị nút "Skip".
```bash
# Vuốt từ dưới lên (tọa độ tham khảo)
adb shell input swipe 540 1800 540 1000
```
- Tap vào nút "Skip" để bỏ qua bước này.
Tọa độ nút "Skip": [72,1919][180,1920]
Điểm giữa: x=126, y=1919

```bash
# Tap vào nút Skip
adb shell input tap 126 1919
```

### 9. Đồng ý với điều khoản
Giao diện chuyển sang màn hình "Google Terms of Service".
- Tap vào nút "I agree" để đồng ý với điều khoản.
Tọa độ nút "I agree": [762,1134][990,1215]
Điểm giữa: x=876, y=1174

```bash
# Tap vào nút I agree
adb shell input tap 876 1174
```

### 10. Các dịch vụ của Google
Giao diện chuyển sang màn hình "Google services".
- Tap vào nút "ACCEPT" để hoàn tất.
Tọa độ nút "ACCEPT": [826,1785][1035,1893]
Điểm giữa: x=930, y=1839

```bash
# Tap vào nút ACCEPT
adb shell input tap 930 1839
```

## Kết quả thực hiện
- [x] Mở màn hình thêm tài khoản 
- [x] Chọn Google Account
- [x] Nhập email thành công
- [x] Nhập password thành công
- [x] Đăng nhập hoàn tất
- [x] Chọn người dùng thiết bị
- [x] Đồng ý với điều khoản
- [x] Đồng bộ danh bạ
- [x] Các dịch vụ của Google
