# Toonder

Project Duration: March 5, 2025 - March 14, 2025

A messaging app where users can chat with chatbots pretending to be cartoon characters as if they're in a romantic relationship.

This project is being developed as my submission for 𝐁𝐮𝐢𝐥𝐝 𝐚 𝐆𝐅/𝐁𝐅 𝐂𝐡𝐚𝐭𝐛𝐨𝐭! 𝐄𝐯𝐞𝐧𝐭 which will end on March 14, 2025. More details [here](https://www.facebook.com/share/p/18HJc3LZtV/).

[Figma Link](https://www.figma.com/design/FrZtZYkOmOYsVvo40gvfCn/toonder?node-id=0-1&p=f&t=vI8sVpNjrz3KJfyV-0)

## Features

- List of Cartoon characters (romantic chatbot) to choose from.
- Chatbots have customized responses based on the character's personality.
- Messaging
- UI will be cuztomized (tried) with cringy romance stuff, dw (but still cute).

## Tech Stack

- React Native (Expo)
- AI API (whatever i see that is free and ez)

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- Node.js
- Expo CLI (npm install -g expo-cli) -> i dont have this but you can try
- A device/emulator (i used Expo Go)
- Check out expo [docu](https://docs.expo.dev/tutorial/create-your-first-app/)

### Setup

1. Clone the repo
2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start
```

## How to Build APK/AAB

For an APK (Android installation file):

```bash
eas build --platform android --profile production
```

(i changed android build type in the eas.json file on production)

For an AAB :

```bash
eas build --platform android --profile production --type archive
```

(i think this is for google play and then gp will make the apk for u)

--- btw you need eas account for build

## Limitations & Future Improvements

- ❌ No real backend (chat history is not even stored, no asyncstorage 2muchw0rk).
- ❌ Basic messaging flow (no media, images, or voice support).
- ❌ UI could do better.
- ❌ Message limit.
