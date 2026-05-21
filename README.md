# Piso WiFi Captive Portal

A modern, mobile-first Piso WiFi captive portal frontend UI designed to be clean, beginner-friendly, and easy for non-technical users to understand.

## Features

- **Mobile-First Design**: Optimized for Android devices and mobile phones
- **Clean Modern UI**: Large readable buttons, rounded corners, soft shadows
- **Green Theme**: Success states use green for clear visual feedback
- **Smooth Animations**: Framer Motion animations for a polished experience
- **Beginner-Friendly**: Clear labels, helper text, and step-by-step instructions

## Components

- **ConnectionStatusCard**: Displays WiFi connection status, IP, and MAC address
- **RemainingTimeDisplay**: Shows countdown timer with pause/resume functionality
- **InsertCoinModal**: Payment modal with live coin counter and package selection
- **PromoRatesCard**: Modern pricing cards for internet packages
- **VoucherInput**: Simple voucher code input with validation
- **PauseResumeButton**: Toggle button to pause/resume internet time
- **SuccessAnimation**: Animated success confirmation screen
- **LiveCoinCounter**: Real-time coin insertion display

## Tech Stack

- React 18
- Tailwind CSS
- Framer Motion
- Lucide React Icons
- Vite

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

The interface is designed to be extremely easy for first-time users:

1. **Insert Money**: Tap the green "Insert Money" button to open the payment modal
2. **Select Package**: Choose from available internet packages (₱1, ₱5, ₱10)
3. **Start Internet**: Confirm payment to begin browsing
4. **Pause Time**: Pause your session to save remaining minutes
5. **WiFi Rates**: View available packages and pricing
6. **Use Voucher**: Enter a voucher code for free internet time

## Design Principles

- Large tap targets for one-handed phone usability
- High readability for outdoor use
- Accessible colors and contrast
- Clear visual hierarchy
- Friendly wording and helpful instructions
- Minimal clutter, maximum clarity

## Customization

You can customize the following in `src/App.jsx`:
- Initial credits amount
- Default remaining time
- Package pricing and time equivalents
- Shop name and branding

## Responsive Design

The interface is fully responsive and works seamlessly on:
- Mobile phones (primary target)
- Tablets
- Desktop browsers
