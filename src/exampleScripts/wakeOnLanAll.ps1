


####
#Mac list in order of Kanaloa1 to Kanaloa 8
# Extra value for k2: 38:D5:47:C8:85:D4
####
$MacList = "00:D8:61:02:44:AD","00:D8:61:02:3E:A4","00:D8:61:02:44:8C","00:D8:61:02:44:C0","00:D8:61:02:3F:07","00:D8:61:02:44:D9","00:D8:61:02:44:91","00:D8:61:02:44:79"

####
#monitor variables
####
$monitorPort = new-Object System.IO.Ports.SerialPort COM3,9600,None,8,one
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
