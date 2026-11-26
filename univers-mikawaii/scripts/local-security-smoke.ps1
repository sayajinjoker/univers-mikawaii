[CmdletBinding()]
param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function Write-TestResult {
  param(
    [string]$Name,
    [bool]$Passed,
    [string]$Detail
  )

  if ($Passed) {
    Write-Host "[PASS] $Name - $Detail" -ForegroundColor Green
    return
  }

  Write-Host "[FAIL] $Name - $Detail" -ForegroundColor Red
}

function Invoke-JsonPost {
  param(
    [Parameter(Mandatory = $true)] [string]$Url,
    [Parameter(Mandatory = $true)] [string]$Body,
    [hashtable]$Headers = @{}
  )

  try {
    $response = Invoke-WebRequest -Uri $Url -Method POST -ContentType "application/json" -Headers $Headers -Body $Body -UseBasicParsing
    return [PSCustomObject]@{
      StatusCode = [int]$response.StatusCode
      Body = $response.Content
    }
  } catch {
    if ($_.Exception.Response) {
      $resp = $_.Exception.Response
      $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
      $body = $reader.ReadToEnd()
      return [PSCustomObject]@{
        StatusCode = [int]$resp.StatusCode
        Body = $body
      }
    }

    throw
  }
}

$failures = 0

try {
  $health = Invoke-WebRequest -Uri "$BaseUrl/" -Method GET -UseBasicParsing
  Write-Host "Connected to $BaseUrl (status $([int]$health.StatusCode))."
} catch {
  Write-Host "Cannot reach $BaseUrl. Start the app with npm run dev and retry." -ForegroundColor Yellow
  exit 1
}

$validCustomization = @{
  scoopCount = 1
  notes = "smoke"
  surpriseStar = $false
  socialMediaVideo = $false
  recipientName = "Smoke Test"
  audience = "adult"
}

$invalidProductPayload = @{
  items = @(
    @{
      id = 999
      quantity = 1
      customization = $validCustomization
    }
  )
  acceptedSalesPolicy = $true
  deliveryMethod = "pickup"
} | ConvertTo-Json -Depth 6

$allowedOriginHeaders = @{ Origin = $BaseUrl }
$blockedOriginHeaders = @{ Origin = "https://evil.example" }

# 1) Origin allowlist should block unknown origins.
$blockedOriginResponse = Invoke-JsonPost -Url "$BaseUrl/api/checkout" -Body $invalidProductPayload -Headers $blockedOriginHeaders
$blockedOriginPassed = $blockedOriginResponse.StatusCode -eq 403
Write-TestResult -Name "Checkout origin allowlist" -Passed $blockedOriginPassed -Detail "status=$($blockedOriginResponse.StatusCode)"
if (-not $blockedOriginPassed) { $failures += 1 }

# 2) Invalid product IDs should return client error (400), not server error.
$invalidProductResponse = Invoke-JsonPost -Url "$BaseUrl/api/checkout" -Body $invalidProductPayload -Headers $allowedOriginHeaders
$invalidProductPassed = $invalidProductResponse.StatusCode -eq 400
Write-TestResult -Name "Checkout invalid product response" -Passed $invalidProductPassed -Detail "status=$($invalidProductResponse.StatusCode)"
if (-not $invalidProductPassed) { $failures += 1 }

# 3) Contact endpoint should enforce rate limiting.
$contactPayload = @{
  name = "Smoke Contact"
  email = "smoke@example.com"
  orderNumber = ""
  message = "This is a smoke test message with enough characters."
  website = "filled-honeypot"
} | ConvertTo-Json -Depth 3

$contactHit429 = $false
for ($i = 1; $i -le 7; $i++) {
  $response = Invoke-JsonPost -Url "$BaseUrl/api/contact" -Body $contactPayload
  if ($response.StatusCode -eq 429) {
    $contactHit429 = $true
    break
  }
}

Write-TestResult -Name "Contact rate limit" -Passed $contactHit429 -Detail "429 observed=$contactHit429"
if (-not $contactHit429) { $failures += 1 }

if ($failures -gt 0) {
  Write-Host "Security smoke checks failed: $failures" -ForegroundColor Red
  exit 1
}

Write-Host "All local security smoke checks passed." -ForegroundColor Green


