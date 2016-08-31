
$prefix = $args[0]
$suffix = $args[1]

$port = new-Object System.IO.Ports.SerialPort COM6,9600,None,8,one
$port.open()

for ($x=1; $x -le 32; $x++) {
	$h = [Convert]::ToString($x,16)
	Write-Host ($prefix + " " + $h + " " + $suffix)
	Start-Sleep 1
}