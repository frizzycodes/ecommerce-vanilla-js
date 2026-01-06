# 🛒 Amazon-like E-commerce App (Vanilla JS)

This is my **first complete full-stack project**, an Amazon-style e-commerce app built **from scratch without frameworks**.

The goal was not UI polish — it was to deeply understand **how browsers, servers, sessions, and databases actually work in production**.

---

## ✨ Features

- Product listing & keyword search  
- Session-based cart (multi-user, no login)  
- Persistent cart & order history  
- Order placement & tracking  
- Client-side routing using History API  
- Custom Node.js HTTP server  
- MongoDB-backed persistence  
- Deployed on a cloud platform (multi-instance safe)

---

## 🧠 What I Learned (Key Takeaways)

- **“Works locally” ≠ works in production**  
  File-based storage (`fs.writeFile`) breaks on cloud platforms due to multiple instances and restarts.

- **Servers are stateless by default**  
  User data must live in external storage (database), not memory or files.

- **Sessions are server concepts**  
  I implemented cookie-based session IDs and scoped carts & orders per session.

- **Frontend state is not truth**  
  Back/forward navigation does not reload data — state must be re-synced using `popstate` and `pageshow`.

- **Databases are infrastructure, not folders**  
  MongoDB replaced fragile file storage and solved concurrency issues using atomic operations like `upsert`.

- **Deployment teaches different skills than coding**  
  Environment variables, IP whitelisting, DB connections, and logs mattered more than syntax.

---

## ⚠️ Important Mistakes I Fixed

- Assuming filesystem persistence is safe  
- Assuming one server instance exists  
- Assuming browser navigation refreshes state  
- Assuming local behavior reflects production  

Fixing these is what made the project real.

---

## 🚀 Why Vanilla JavaScript?

I intentionally avoided frameworks to understand:
- What the browser already provides  
- What frameworks abstract away  
- Why modern tools (React / Next.js) exist  

Because of this, higher-level frameworks now make **conceptual sense**, not just syntactic sense.

---

## 🧰 Tech Stack

<p align="center">
  <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/main/icons/javascript.png" width="42"/>
  <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/node_js.png" width="42"/>
  <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/main/icons/html.png" width="42"/>
  <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/main/icons/css.png" width="42"/>
  <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/main/icons/mongodb.png" width="42"/>
</p>

---

**This project marks my transition from “writing code” to understanding real-world web systems.**
