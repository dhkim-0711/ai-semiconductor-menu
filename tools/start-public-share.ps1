param(
  [int]$Port = 4173,
  [string]$Subdomain = ""
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$shareDir = Join-Path $projectRoot ".share"

$serverOutLog = Join-Path $shareDir "server.out.log"
$serverErrLog = Join-Path $shareDir "server.err.log"
$tunnelOutLog = Join-Path $shareDir "open-tunnel.out.log"
$tunnelErrLog = Join-Path $shareDir "open-tunnel.err.log"
$publicUrlPath = Join-Path $shareDir "public-url.txt"
$statePath = Join-Path $shareDir "share-state.json"
$moduleRoot = Join-Path $projectRoot ".share\\tunnel-deps\\node_modules\\localtunnel"

function Quote-Arg {
  param([string]$Value)

  if ($Value -notmatch "\s") {
    return $Value
  }

  return '"' + $Value + '"'
}

New-Item -ItemType Directory -Path $shareDir -Force | Out-Null

Remove-Item @(
  $serverOutLog,
  $serverErrLog,
  $tunnelOutLog,
  $tunnelErrLog,
  $publicUrlPath,
  $statePath
) -Force -ErrorAction SilentlyContinue

if (-not (Test-Path $moduleRoot)) {
  throw "Tunnel dependency not found at $moduleRoot. Install it with: npm.cmd install --prefix `"$projectRoot\\.share\\tunnel-deps`" localtunnel"
}

@{
  Port = $Port
  ModuleRoot = $moduleRoot
} | ConvertTo-Json | Set-Content -Path $statePath -Encoding UTF8

$serverLaunch = 'start "" /min cmd.exe /c "cd /d ""{0}"" && node tools\static-server.js {1} 1>""{2}"" 2>""{3}"""' -f `
  $projectRoot, $Port, $serverOutLog, $serverErrLog

$subdomainArg = if ($Subdomain) { Quote-Arg $Subdomain } else { "-" }
$tunnelCommand = @(
  "node",
  "tools\\open-tunnel.js",
  $Port,
  Quote-Arg $publicUrlPath,
  $subdomainArg
) -join " "

$tunnelLaunch = 'start "" /min cmd.exe /c "cd /d ""{0}"" && {1} 1>""{2}"" 2>""{3}"""' -f `
  $projectRoot, $tunnelCommand, $tunnelOutLog, $tunnelErrLog

cmd.exe /c $serverLaunch | Out-Null
Start-Sleep -Seconds 3
cmd.exe /c $tunnelLaunch | Out-Null

$deadline = (Get-Date).AddSeconds(45)

while ((Get-Date) -lt $deadline -and -not (Test-Path $publicUrlPath)) {
  Start-Sleep -Seconds 2
}

if (-not (Test-Path $publicUrlPath)) {
  throw "Could not detect a public URL. Check $tunnelOutLog and $tunnelErrLog."
}

$publicUrl = (Get-Content -Path $publicUrlPath -ErrorAction Stop | Select-Object -First 1).Trim()

Write-Output $publicUrl
Write-Output "Saved URL to $publicUrlPath"
Write-Output "Server logs: $serverOutLog / $serverErrLog"
Write-Output "Tunnel logs: $tunnelOutLog / $tunnelErrLog"
