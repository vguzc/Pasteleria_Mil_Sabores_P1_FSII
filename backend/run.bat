@echo off
echo Iniciando Backend Spring Boot - Pasteleria Mil Sabores...
set "MAVEN_CMD=C:\Users\Asus\.m2\wrapper\dists\apache-maven-3.9.15-bin\4rlcemksed9vjmkvgss0jpc4po\apache-maven-3.9.15\bin\mvn.cmd"
if not exist "%MAVEN_CMD%" (
    set "MAVEN_CMD=C:\Users\Asus\.m2\wrapper\dists\apache-maven-3.9.14-bin\1cb7fhup6b5n3bed6kckbrnspv\apache-maven-3.9.14\bin\mvn.cmd"
)
call "%MAVEN_CMD%" spring-boot:run
pause
