Build

npm i
npm build dev
xcrun notarytool store-credentials "AC_PASSWORD" --apple-id "vitaliy.lukyanenko@gmail.com"  --team-id PD3LDCJ4FX --password **-**-***-**
xcrun notarytool submit release/1.0.107-arm/anty-code_1.0.107-arm.dmg --keychain-profile "AC_PASSWORD" --wait