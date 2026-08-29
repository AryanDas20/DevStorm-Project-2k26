# 🔒 Password Strength & Breach Checker
![Uploading image.png…]()


> A cybersecurity utility designed to evaluate the robustness of user passwords while verifying their compromise status, all without exposing sensitive data.

## 📖 Overview

This project is a secure tool that scores a password's strength locally and checks whether it has appeared in known data leaks via a public breach API. **The primary architectural requirement is strict data privacy:** the application must perform the breach verification without ever sending the raw password over the network.

---

## ✨ Key Features

* **Local Strength Evaluation:** Calculates a complexity score based on length, character variety, and entropy entirely on the client side. No plain-text data is transmitted for strength analysis.
* **Privacy-Preserving API Integration:** Interfaces with a public breach database (such as the *Have I Been Pwned* API) using a k-Anonymity model.
* **Client-Side Cryptography:** Hashes the user's password locally (e.g., using SHA-1).
* **Zero-Knowledge Verification:** Transmits only the first 5 characters (the prefix) of the hash to the API. The client receives a list of matching compromised suffixes and cross-references them locally, ensuring the full hash and raw password never leave the device.

---

## 🛠 Tech Stack

| Category | Technologies |
| --- | --- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Cryptography** | Web Crypto API (for local hashing) |
| **External Services** | Public Breach API (k-Anonymity endpoints) |

---

## 🚀 Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/AryanDas20/DevStorm-Project-2k26.git

```

**2. Navigate to the project directory**

```bash
cd DevStorm-Project-2k26

```

**3. Run the application**
Open `index.html` in any modern web browser. Because the cryptography and logic are handled via client-side JavaScript, no complex backend environment is required to run the local checks.

---

## 👥 Team

This project was built collaboratively by:

* **Aryan Das**
* **Om Prabhat Singh**
* **Jaan Nisar Shaikh**
* **Anshuman Basu**
