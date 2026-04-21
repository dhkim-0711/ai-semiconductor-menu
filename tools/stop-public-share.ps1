param()

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$shareDir = Join-Path $projectRoot ".share"
$statePath = Join-Path $shareDir "share-state.json"

$patterns = @(
  "tools\\static-server.js",
  "tools\\open-tunnel.js"
)

if (Test-Path $statePath) {
  $state = Get-Content -Path $statePath -Raw | ConvertFrom-Json
  if ($state.Port) {
    $patterns += "static-server.js $($state.Port)"
    $patterns += "open-tunnel.js $($state.Port)"
  }
}

$processes = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
  $commandLine = $_.CommandLine
  if (-not $commandLine) {
    return $false
  }

  foreach ($pattern in $patterns) {
    if ($commandLine -like "*$pattern*") {
      return $true
    }
  }

  return $false
}

$count = 0
foreach ($process in $processes) {
  Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
  $count++
}

if ($count -gt 0) {
  Write-Output "Stopped $count public share process(es)."
} else {
  Write-Output "No matching public share processes were running."
}
