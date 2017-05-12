
$toggle = $args[0]

$port = new-Object System.IO.Ports.SerialPort COM6,9600,None,8,one
$port.open()

$port.WriteLine("xt 00 " + $toggle + " 00 00 14")
Write-Host("xt 00 " + $toggle + " 00 00 14")
Start-Sleep .5