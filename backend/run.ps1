Write-Host "Iniciando Backend Spring Boot - Pasteleria Mil Sabores..." -ForegroundColor Cyan

$mavenPath = "C:\Users\Asus\.m2\wrapper\dists\apache-maven-3.9.15-bin\4rlcemksed9vjmkvgss0jpc4po\apache-maven-3.9.15\bin\mvn.cmd"
if (-not (Test-Path $mavenPath)) {
    $mavenPath = "C:\Users\Asus\.m2\wrapper\dists\apache-maven-3.9.14-bin\1cb7fhup6b5n3bed6kckbrnspv\apache-maven-3.9.14\bin\mvn.cmd"
}

if (Test-Path $mavenPath) {
    & $mavenPath spring-boot:run
} else {
    Write-Host "No se encontró el ejecutable de Maven en .m2." -ForegroundColor Red
}
