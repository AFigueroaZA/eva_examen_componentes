# Guia Cordova Android

Estos pasos requieren Android Studio, Android SDK 36, Gradle/JDK y un dispositivo o emulador.

## Preparar plataforma

```bash
npm install
npm run build:mobile
npm run mobile:add-android
npm run mobile:prepare
```

## APK debug

```bash
npm run mobile:build-debug
```

El APK debug se genera dentro de `platforms/android/app/build/outputs/apk/debug/`.

## APK release firmado

1. Crea un keystore:

```bash
keytool -genkey -v -keystore examen-componentes.keystore -alias examen-componentes -keyalg RSA -keysize 2048 -validity 10000
```

2. Genera el release:

```bash
npm run mobile:build-release
```

3. Firma y alinea el APK usando las herramientas del Android SDK (`apksigner` y `zipalign`) o configura el firmado desde Android Studio.

## Pendientes externos

- Instalar Android Studio y aceptar licencias del SDK.
- Instalar o configurar JDK para que `javac -version` funcione.
- Configurar `ANDROID_HOME` apuntando al Android SDK.
- Agregar las herramientas del SDK al `PATH`, especialmente `avdmanager`.
- Ejecutar `cordova platform add android` en el equipo donde este Android SDK.
- Configurar el keystore real del grupo.
- Probar el APK en un dispositivo fisico.

## Resultado de prueba local

En esta maquina se pudo ejecutar `npm run build:mobile` y generar `www/`, pero Cordova no pudo completar la plataforma Android porque faltan JDK, `ANDROID_HOME`, Android SDK target y Gradle.
