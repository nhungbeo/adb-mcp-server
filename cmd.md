Disable-NetAdapter -Name "Ethernet" -Confirm:$false
Enable-NetAdapter -Name "Wi-Fi" -Confirm:$false

Enable-NetAdapter -Name "Ethernet" -Confirm:$false
Disable-NetAdapter -Name "Wi-Fi" -Confirm:$false
Get-NetAdapter

adb shell "ip -f inet addr show wlan0 | grep inet"
adb shell "ip -f inet addr show wlan0 | grep inet | awk '{print `$2}' | cut -d'/' -f1"

adb shell "pm clear com.google.android.play.games ; pm clear com.google.android.gms ; pm clear com.android.vending ; pm clear com.geargames.aow ; pm clear tech.httptoolkit.android.v1"

adb shell monkey -p com.geargames.aow -c android.intent.category.LAUNCHER 1

adb shell monkey -p com.google.android.play.games -c android.intent.category.LAUNCHER 1

 
ws.tapjoyads.com

adb shell am start -a android.settings.SYNC_SETTINGS

adb shell am start -a android.settings.ADD_ACCOUNT_SETTINGS -n com.android.settings/.accounts.AddAccountSettings

adb shell input text xxxx

# Tap command
adb shell input tap x y  # Tap at coordinates (x,y)

# MCP tool tap command
{
  "deviceId": "b6bad482", 
  "x": 69,
  "y": 56
}
