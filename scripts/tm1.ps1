param(
  [string]$Message = "TM1 update"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
& "$scriptDir\\push.ps1" -Message $Message
