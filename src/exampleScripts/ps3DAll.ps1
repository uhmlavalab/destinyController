
$prefix = $args[0]
$suffix1 = $args[1]
$suffix2 = $args[2]
$suffix3 = $args[3]
$suffix4 = $args[4]

$port = new-Object System.IO.Ports.SerialPort COM6,9600,None,8,one
$port.open()

for ($x=1; $x -le 32; $x++) {
	$h = [Convert]::ToString($x,16)
	$port.WriteLine($prefix + " " + $h + " " + $suffix1 + " " + $suffix2 + " " + $suffix3 + " " + $suffix4)
	Write-Host($prefix + " " + $h + " " + $suffix1 + " " + $suffix2 + " " + $suffix3 + " " + $suffix4)
	Start-Sleep 1.5
}