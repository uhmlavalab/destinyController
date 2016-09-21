
$prefix = $args[0]
$h      = $args[1]
$suffix = $args[2]

$port = new-Object System.IO.Ports.SerialPort COM6,9600,None,8,one
$port.open()

$port.WriteLine($prefix + " " + $h + " " + $suffix)
Write-Host($prefix + " " + $h + " " + $suffix)
Start-Sleep .5