

$port = new-Object System.IO.Ports.SerialPort COM6,9600,None,8,one
$port.open()

for ($x=1; $x -le 32; $x++) {
	$h = [Convert]::ToString($x,16)
	Write-Host $h
	$port.WriteLine("ka " + $h + " 00")
	Start-Sleep 1.5
}

