


$MacList = "D0:50:99:AB:D1:16","9C:5C:8E:4F:97:15","34:97:F6:5A:41:6D","34:97:F6:5A:3F:6D","34:97:F6:00:F8:A1","34:97:F6:00:F8:E1","34:97:F6:00:F8:DF","34:97:F6:00:F8:E7"

foreach ($Mac in $MacList){
  $MacByteArray = $Mac -split "[:-]" | ForEach-Object { [Byte] "0x$_"}
  [Byte[]] $MagicPacket = (,0xFF * 6) + ($MacByteArray  * 16)
  $UdpClient = New-Object System.Net.Sockets.UdpClient
  $UdpClient.Connect(([System.Net.IPAddress]::Broadcast),7)
  $UdpClient.Send($MagicPacket,$MagicPacket.Length)
  $UdpClient.Close()
  Write-host "Power on Maui $Mac"
  Start-Sleep 5
}
