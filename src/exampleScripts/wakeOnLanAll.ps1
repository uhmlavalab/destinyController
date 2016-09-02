


####
#Mac list in order of Kanaloa1 to Kanaloa 8
####
$MacList = "D0:50:99:AB:D1:16","9C:5C:8E:4F:97:15","34:97:F6:5A:41:6D","34:97:F6:5A:3F:6D","34:97:F6:00:F8:A1","34:97:F6:00:F8:E1","34:97:F6:00:F8:DF","34:97:F6:00:F8:E7"

####
#monitor variables
####
$monitorPort = new-Object System.IO.Ports.SerialPort COM6,9600,None,8,one
$monitorPort.open()
$monitorNumber = 32
$prefix = "ka"
$suffix = "01"


####
# For each computer, first turn on its monitors (4). Then wake on lan.
####
foreach ($Mac in $MacList){

  for ($x = 1; $x -le 4; $x++) {
	  $h =  [Convert]::ToString($monitorNumber,16)
	  $monitorPort.WriteLine($prefix + " " + $h + " " + $suffix)
	  Write-Host($prefix + " " + $h + " " + $suffix)
	  $monitorNumber--;
	  Start-Sleep 1.5
  }
  Start-Sleep 8

  $MacByteArray = $Mac -split "[:-]" | ForEach-Object { [Byte] "0x$_"}
  [Byte[]] $MagicPacket = (,0xFF * 6) + ($MacByteArray  * 16)
  $UdpClient = New-Object System.Net.Sockets.UdpClient
  $UdpClient.Connect(([System.Net.IPAddress]::Broadcast),7)
  $UdpClient.Send($MagicPacket,$MagicPacket.Length)
  $UdpClient.Close()
  Write-host "Power on Kanaloa $Mac"
}
