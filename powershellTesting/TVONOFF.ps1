#ERASE ALL THIS AND PUT XAML BELOW between the @" "@ 
$inputXML = @"
<Window x:Name="LGController" x:Class="TVONOFF.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:TVONOFF"
        mc:Ignorable="d"
        Title="LG Controller">
    <Grid>
        <Button x:Name="PowerON" Content="Power ON" HorizontalAlignment="Left" Height="30" Margin="20,20,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="PowerOFF" Content="Power OFF" HorizontalAlignment="Left" Height="30" Margin="140,20,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="AspectRatio" Content="Aspect Ratio" HorizontalAlignment="Left" Height="30" Margin="20,70,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="Volume" Content="Volume" HorizontalAlignment="Left" Height="30" Margin="20,120,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="Contrast" Content="Contrast" HorizontalAlignment="Left" Height="30" Margin="20,170,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="Brightness" Content="Brightness" HorizontalAlignment="Left" Height="30" Margin="20,220,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="Color" Content="Color" HorizontalAlignment="Left" Height="30" Margin="20,270,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="Tint" Content="Tint" HorizontalAlignment="Left" Height="30" Margin="20,320,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="Sharpness" Content="Sharpness" HorizontalAlignment="Left" Height="30" Margin="20,370,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="EnergySaving" Content="Evergy Saving" HorizontalAlignment="Left" Height="30" Margin="20,420,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="Input" Content="Input" HorizontalAlignment="Left" Height="30" Margin="20,470,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="JustScan" Content="Just Scan" HorizontalAlignment="Left" Height="30" Margin="140,70,0,0" VerticalAlignment="Top" Width="100"/>
        <Slider x:Name="VolumeSlider" HorizontalAlignment="Left" Height="30" Margin="140,120,0,0" VerticalAlignment="Top" Width="220" Maximum="64" SmallChange="1"/>
        <Slider x:Name="ContrastSlider" HorizontalAlignment="Left" Height="30" Margin="140,170,0,0" VerticalAlignment="Top" Width="220" Maximum="64" Value="32" SmallChange="1"/>
        <Slider x:Name="BrightnessSlider" HorizontalAlignment="Left" Height="30" Margin="140,220,0,0" VerticalAlignment="Top" Width="220" Maximum="64" Value="32" SmallChange="1"/>
        <Slider x:Name="ColorSlider" HorizontalAlignment="Left" Height="30" Margin="140,270,0,0" VerticalAlignment="Top" Width="220" Maximum="64" Value="32" SmallChange="1"/>
        <Slider x:Name="TintSlider" HorizontalAlignment="Left" Height="30" Margin="140,320,0,0" VerticalAlignment="Top" Width="220" Maximum="64" Value="32" SmallChange="1"/>
        <Slider x:Name="SharpnessSlider" HorizontalAlignment="Left" Height="30" Margin="140,370,0,0" VerticalAlignment="Top" Width="220" Maximum="32" Value="16" SmallChange="1"/>
        <Button x:Name="EnergySaving_Copy" Content="Evergy SAving" HorizontalAlignment="Left" Height="30" Margin="140,420,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="EnergySavingMinimum" Content="Minimum" HorizontalAlignment="Left" Height="30" Margin="260,420,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="EnergySaving_Copy2" Content="Evergy SAving" HorizontalAlignment="Left" Height="30" Margin="380,420,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="EnergySavingMaximum" Content="Maximum" HorizontalAlignment="Left" Height="30" Margin="500,420,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="SharpnessMinimum" Content="Minimum" HorizontalAlignment="Left" Height="30" Margin="380,370,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="SharpnessMaximum" Content="Maximum" HorizontalAlignment="Left" Height="30" Margin="500,370,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="TintMinimum" Content="Minimum" HorizontalAlignment="Left" Height="30" Margin="380,320,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="TintMaximum" Content="Maximum" HorizontalAlignment="Left" Height="30" Margin="500,320,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="ColorMinimum" Content="Minimum" HorizontalAlignment="Left" Height="30" Margin="380,270,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="ColorMaximum" Content="Maximum" HorizontalAlignment="Left" Height="30" Margin="500,270,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="BrightnessMinimum" Content="Minimum" HorizontalAlignment="Left" Height="30" Margin="380,220,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="BrightnessMaximum" Content="Maximum" HorizontalAlignment="Left" Height="30" Margin="500,220,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="ContrastMinimum" Content="Minimum" HorizontalAlignment="Left" Height="30" Margin="380,170,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="ContrastMaximum" Content="Maximum" HorizontalAlignment="Left" Height="30" Margin="500,170,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="VolumeMinimum" Content="Minimum" HorizontalAlignment="Left" Height="30" Margin="380,120,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="VolumeMaximum" Content="Maximum" HorizontalAlignment="Left" Height="30" Margin="500,120,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="EnergySavingOFF" Content="OFF" HorizontalAlignment="Left" Height="30" Margin="140,420,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="EnergySavingMedium" Content="Medium" HorizontalAlignment="Left" Height="30" Margin="380,420,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="InputHDMI2" Content="HDMI 2" HorizontalAlignment="Left" Height="30" Margin="260,470,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="InputHDMI1" Content="HDMI 1" HorizontalAlignment="Left" Height="30" Margin="140,470,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="InputHDMI3" Content="HDMI 3" HorizontalAlignment="Left" Height="30" Margin="380,470,0,0" VerticalAlignment="Top" Width="100"/>
        <Button x:Name="EnergySavingScreenOFF" Content="Screnn OFF" HorizontalAlignment="Left" Height="30" Margin="620,420,0,0" VerticalAlignment="Top" Width="100"/>
        

    </Grid>
</Window>



 
"@       
 
$inputXML = $inputXML -replace 'mc:Ignorable="d"','' -replace "x:N",'N'  -replace '^<Win.*', '<Window'
 
 
[void][System.Reflection.Assembly]::LoadWithPartialName('presentationframework')
[xml]$XAML = $inputXML
#Read XAML
 
    $reader=(New-Object System.Xml.XmlNodeReader $xaml) 
  try{$Form=[Windows.Markup.XamlReader]::Load( $reader )}
catch{Write-Host "Unable to load Windows.Markup.XamlReader. Double-check syntax and ensure .net is installed."}
 
#===========================================================================
# Store Form Objects In PowerShell
#===========================================================================
 
$xaml.SelectNodes("//*[@Name]") | %{Set-Variable -Name "WPF$($_.Name)" -Value $Form.FindName($_.Name)}
 
Function Get-FormVariables{
if ($global:ReadmeDisplay -ne $true){Write-host "If you need to reference this display again, run Get-FormVariables" -ForegroundColor Yellow;$global:ReadmeDisplay=$true}
write-host "Found the following interactable elements from our form" -ForegroundColor Cyan
get-variable WPF*
}
 
Get-FormVariables
 
#===========================================================================
# Actually make the objects work
#===========================================================================
 
$port= new-Object System.IO.Ports.SerialPort COM6,9600,None,8,one
$port.open()

$WPFPowerON.Add_Click({
for($g=1; $g -le 32; $g++){
$h = [Convert]::ToString($g, 16)
Write-Host $h
$port.WriteLine("ka " + $h + " 01")
Start-Sleep 1}
#$port.WriteLine("ka E 01")
})

$WPFPowerOFF.Add_Click({
for($g=1; $g -le 32; $g++){
$h = [Convert]::ToString($g, 16)
Write-Host $h
$port.WriteLine("ka " + $h + " 00")
Start-Sleep 1.5
}
#$port.WriteLine("ka E 00")
})


$WPFAspectRatio.Add_Click({
$port.WriteLine("kc 01 01")
})

$WPFJustScan.Add_Click({
for($g=1; $g -le 32; $g++){
$h = [Convert]::ToString($g, 16)
Write-Host $h
$port.WriteLine("kc " + $h + " 09")
Start-Sleep 1}
#$port.WriteLine("ka E 01")
})

$WPFVolumeSlider.Value
$WPFContrastSlider.Value
$WPFVolumeMinimum.Add_Click({
Write-host "Hello"
Write-Host $WPFVolumeSlider.Value
#$port.WriteLine("kc 01 " + Value)
})

$WPFVolumeSlider.Add_ValueChanged({
#Write-host "Hello"
$a = [math]::Round($WPFVolumeSlider.Value)
$port.WriteLine("kf e " + $a)
Write-host $a
})

$WPFContrastSlider.Add_ValueChanged({
#Write-host "Hello"
$b = [math]::Round($WPFContrastSlider.Value)
$port.WriteLine("kg 01 " + $b)
Write-host $b
})

$WPFBrightnessSlider.Add_ValueChanged({
#Write-host "Hello"
$c = [math]::Round($WPFBrightnessSlider.Value)
$port.WriteLine("kh 01 " + $c)
Write-host $c
})

$WPFColorSlider.Add_ValueChanged({
#Write-host "Hello"
$d = [math]::Round($WPFColorSlider.Value)
$port.WriteLine("ki 01 " + $d)
Write-host $d
})

$WPFTintSlider.Add_ValueChanged({
#Write-host "Hello"
$e = [math]::Round($WPFBrightnessSlider.Value)
$port.WriteLine("kj 01 " + $e)
Write-host $e
})

$WPFSharpnessSlider.Add_ValueChanged({
#Write-host "Hello"
$f = [math]::Round($WPFBrightnessSlider.Value)
$port.WriteLine("kk 01 " + $f)
Write-host $f
})



 
#Function Get-DiskInfo {
#param($computername =$env:COMPUTERNAME)
 
#Get-WMIObject Win32_logicaldisk -ComputerName $computername | Select-Object @{Name='ComputerName';Ex={$computername}},`
#                                                                    @{Name=‘Drive Letter‘;Expression={$_.DeviceID}},`
#                                                                    @{Name=‘Drive Label’;Expression={$_.VolumeName}},`
#                                                                    @{Name=‘Size(MB)’;Expression={[int]($_.Size / 1MB)}},`
#                                                                    @{Name=‘FreeSpace%’;Expression={[math]::Round($_.FreeSpace / $_.Size,2)*100}}
#                                                                 }
                                                                  
#$WPFtextBox.Text = $env:COMPUTERNAME
 
#$WPFbutton.Add_Click({
#$WPFlistView.Items.Clear()
#start-sleep -Milliseconds 840
#Get-DiskInfo -computername $WPFtextBox.Text | % {$WPFlistView.AddChild($_)}
#})
#Sample entry of how to add data to a field
 
 
#$vmpicklistView.items.Add([pscustomobject]@{'VMName'=($_).Name;Status=$_.Status;Other="Yes"})
 
#===========================================================================
# Shows the form
#===========================================================================
write-host "To show the form, run the following" -ForegroundColor Cyan
$Form.ShowDialog() | out-null