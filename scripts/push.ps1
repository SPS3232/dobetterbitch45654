param(
  [string]$Message = "Update portal"
)

Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location ..

git add .
git commit -m $Message
git push
