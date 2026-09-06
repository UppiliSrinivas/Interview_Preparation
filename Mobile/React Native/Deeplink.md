# React Native Deep Linking

## Table of Contents

1. Introduction
2. Types of Deep Links
   - Custom URL Scheme
   - Universal Links / App Links
3. Why Use Deep Linking?
4. How Deep Linking Works
5. React Native Linking API
6. React Navigation Configuration
7. Android Configuration
8. iOS Configuration
9. Real-World Example
10. Route Parameters
11. Testing Deep Links
12. Common Challenges
13. Summary

---

# Introduction

Deep Linking in React Native allows users to open a specific screen inside your mobile application directly from an external source such as:

- Browser
- Email
- SMS
- QR Code
- Push Notification
- Another Mobile App

Instead of opening the home screen, a deep link navigates users directly to a specific screen.

For example:

```
User clicks a product link
        ↓
App Opens
        ↓
Product Screen
```

---

# Types of Deep Links

## 1. Custom URL Scheme

This is the simplest type of deep linking.

Example URLs:

```text
myapp://profile/123

myapp://settings

myapp://product/25
```

When the user taps

```text
myapp://profile/123
```

The app opens directly to

```
Profile Screen

User ID: 123
```

---

## 2. Universal Links (iOS) / App Links (Android)

Instead of a custom scheme, these use your website domain.

Example:

```text
https://myapp.com/profile/123
```

Behavior:

If App Installed

```
User clicks link
        ↓
App Opens
```

If App Not Installed

```
User clicks link
        ↓
Website Opens
```

This provides a much better user experience.

---

# Why Use Deep Linking?

Deep Linking is commonly used in:

- Password Reset
- Email Verification
- OTP Verification
- Referral Programs
- Product Sharing
- Payment Gateway Redirects
- Push Notifications
- QR Code Navigation
- Marketing Campaigns

Example

```
Email

Check out this amazing product!

https://myapp.com/product/567
```

When clicked:

```
App Opens
       ↓
Product Screen
       ↓
Loads Product ID 567
```

---

# How Deep Linking Works

```
User taps URL

        ↓

Android / iOS

        ↓

React Native Linking Module

        ↓

React Navigation

        ↓

Specific Screen Opens
```

---

# React Native Linking API

Import

```javascript
import { Linking } from 'react-native';
```

---

## Opening URLs

Open a website

```javascript
Linking.openURL('https://google.com');
```

Call a phone number

```javascript
Linking.openURL('tel:+919999999999');
```

Open Email

```javascript
Linking.openURL('mailto:test@gmail.com');
```

---

## Check if URL Can Be Opened

```javascript
const supported = await Linking.canOpenURL(url);

if (supported) {
    Linking.openURL(url);
}
```

---

## Get Initial URL

When the app is closed and opened through a deep link

```javascript
const url = await Linking.getInitialURL();

console.log(url);
```

Output

```text
myapp://profile/25
```

---

## Listen for Incoming Links

When the app is already running

```javascript
import { useEffect } from 'react';
import { Linking } from 'react-native';

useEffect(() => {

    const subscription = Linking.addEventListener(
        'url',
        ({ url }) => {
            console.log(url);
        }
    );

    return () => subscription.remove();

}, []);
```

---

# React Navigation Configuration

Configure navigation

```javascript
const linking = {

    prefixes: [

        'myapp://',

        'https://myapp.com'

    ],

    config: {

        screens: {

            Home: '',

            Profile: 'profile/:id',

            Product: 'product/:id',

            Settings: 'settings',

        },

    },

};
```

Pass it to NavigationContainer

```javascript
<NavigationContainer linking={linking}>
    ...
</NavigationContainer>
```

Now

```
myapp://profile/10
```

Automatically opens

```
Profile Screen

ID = 10
```

---

# Android Configuration

File

```
android/app/src/main/AndroidManifest.xml
```

Add Intent Filter

```xml
<intent-filter>

    <action android:name="android.intent.action.VIEW"/>

    <category android:name="android.intent.category.DEFAULT"/>

    <category android:name="android.intent.category.BROWSABLE"/>

    <data
        android:scheme="myapp"/>

</intent-filter>
```

For Android App Links

```xml
<data
    android:scheme="https"
    android:host="myapp.com"/>
```

---

# iOS Configuration

File

```
Info.plist
```

Add

```xml
<key>CFBundleURLTypes</key>

<array>

    <dict>

        <key>CFBundleURLSchemes</key>

        <array>

            <string>myapp</string>

        </array>

    </dict>

</array>
```

For Universal Links you also need

- Associated Domains capability
- apple-app-site-association file hosted on your website

---

# Real-World Example

Imagine an e-commerce application.

Screens

```
Home

Product

Cart

Profile
```

Someone shares

```
myshop://product/200
```

Flow

```
Tap Link

↓

App Opens

↓

Reads URL

↓

Product ID = 200

↓

API Call

↓

Display Product Details
```

---

# Route Parameters

Navigation Configuration

```javascript
const linking = {

    config: {

        screens: {

            Product: {

                path: 'product/:id',

            },

        },

    },

};
```

Inside Product Screen

```javascript
function ProductScreen({ route }) {

    console.log(route.params.id);

}
```

Output

```
200
```

---

# Testing Deep Links

## Android

```bash
adb shell am start \
-W \
-a android.intent.action.VIEW \
-d "myapp://profile/123" \
com.myapp
```

Replace

```
com.myapp
```

with your application package.

---

## iOS Simulator

```bash
xcrun simctl openurl booted "myapp://profile/123"
```

---

# Common Challenges

### App Already Running

Use

```javascript
Linking.addEventListener('url', callback);
```

---

### App Closed

Use

```javascript
Linking.getInitialURL();
```

---

### Dynamic Route Parameters

Configure React Navigation correctly

```text
profile/:id
product/:id
order/:orderId
```

---

### Universal Links / App Links

Require additional setup

Android

- assetlinks.json

iOS

- apple-app-site-association

---

# Summary

| Feature | Purpose |
|----------|---------|
| Custom URL Scheme | Open app using custom URLs like `myapp://` |
| Universal Links | Open app through HTTPS links on iOS |
| App Links | Open app through HTTPS links on Android |
| `Linking.openURL()` | Open websites or other apps |
| `Linking.canOpenURL()` | Check whether a URL can be opened |
| `Linking.getInitialURL()` | Get the URL that launched the app |
| `Linking.addEventListener()` | Listen for incoming links while app is running |
| React Navigation Linking | Map URLs to app screens |

---

# Best Practices

- Prefer Universal Links / App Links for production apps.
- Always validate route parameters before using them.
- Handle both cold starts (`getInitialURL`) and warm starts (`addEventListener`).
- Test deep links on both Android and iOS.
- Keep your URL structure simple and REST-like.

Example:

```
myapp://profile/10

myapp://product/200

https://myapp.com/profile/10

https://myapp.com/product/200
```

These URL structures are easy to understand, maintain, and share.