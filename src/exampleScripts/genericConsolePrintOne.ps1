
$prefix = $args[0]
$suffix = $args[1]
$h      = $args[2]

$port = new-Object System.IO.Ports.SerialPort COM6,9600,None,8,one
$port.open()

Write-Host ($prefix + " " + $h + " " + $suffix)
Start-Sleep .5