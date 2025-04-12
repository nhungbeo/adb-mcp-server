Disable-NetAdapter -Name "Ethernet" -Confirm:$false
Enable-NetAdapter -Name "Wi-Fi" -Confirm:$false

Enable-NetAdapter -Name "Ethernet" -Confirm:$false
Disable-NetAdapter -Name "Wi-Fi" -Confirm:$false
Get-NetAdapter


adb shell "ip -f inet addr show wlan0 | grep inet"
adb shell "pm clear com.google.android.play.games ; pm clear com.google.android.gms ; pm clear com.android.vending ; pm clear com.geargames.aow"


ws.tapjoyads.com