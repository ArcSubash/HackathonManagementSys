@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%"=="" @ECHO OFF
@REM ##########################################################################
@REM ## Maven Wrapper
@REM ##########################################################################

SET MAVEN_PROJECTBASEDIR=%~dp0
SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
SET WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

@REM Download maven-wrapper.jar if not found
IF NOT EXIST %WRAPPER_JAR% (
    powershell -Command "& {Invoke-WebRequest -Uri %WRAPPER_URL% -OutFile %WRAPPER_JAR%}"
)

SET MAVEN_CMD_LINE_ARGS=%*
java -jar %WRAPPER_JAR% %MAVEN_CMD_LINE_ARGS%
