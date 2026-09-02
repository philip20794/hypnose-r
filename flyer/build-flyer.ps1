$ErrorActionPreference = 'Stop'

$miktexBin = Join-Path $env:LOCALAPPDATA 'Programs\MiKTeX\miktex\bin\x64'
$pdflatex = Join-Path $miktexBin 'pdflatex.exe'

if (-not (Test-Path $pdflatex)) {
  $pdflatex = 'pdflatex'
}

Push-Location $PSScriptRoot
try {
  & $pdflatex --enable-installer --interaction=nonstopmode --halt-on-error hypnose-r-flyer-a4.tex
  & $pdflatex --enable-installer --interaction=nonstopmode --halt-on-error hypnose-r-flyer-a4.tex
}
finally {
  Pop-Location
}
