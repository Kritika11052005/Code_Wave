# 🎧 code_wave



**code_wave** is a fast, minimal, and powerful in-browser code editor that supports multiple programming languages with real-time execution. Built with performance and simplicity in mind, it provides developers with a playground to write, test, and customize code — right in the browser.

🌐 [Live Demo on Vercel](https://code-wave-indol.vercel.app/)

---

## 🚀 Features

- 🌐 Multi-language support (via Piston API)
- 📝 Monaco-powered code editor
- 💾 Auto-save per language with `localStorage`
- 🎨 Custom themes & font size control
- 🔄 Switch languages on the fly
- ⚡ Fast, responsive UI with Tailwind CSS
- 🧠 State management with Zustand

---

## 🛠️ Tech Stack

| Technology       | Description                                      | Documentation |
|------------------|--------------------------------------------------|----------------|
| **Next.js**       | React framework with App Router support          | [Next.js Docs](https://nextjs.org/docs) |
| **TypeScript**    | Type-safe JavaScript for scalable development    | [TypeScript Docs](https://www.typescriptlang.org/docs/) |
| **Monaco Editor** | VS Code-like code editor for the browser         | [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/) |
| **Zustand**       | Lightweight and scalable state management        | [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction) |
| **Tailwind CSS**  | Utility-first CSS framework                      | [Tailwind CSS Docs](https://tailwindcss.com/docs) |
| **Piston API**    | Compile and run code in multiple languages       | [Piston API Docs](https://github.com/engineer-man/piston) |
| **localStorage**  | Store code and settings in the browser           | [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) |
| **Vercel**        | Hosting and deployment for frontend apps         | [Vercel Docs](https://vercel.com/docs) |

---

## ⚙️ Configuration

- **Languages**: Defined in `app/_constants.ts`
- **Piston API**: Endpoint configured in `lib/runCode.ts`
- **Themes & Font Size**: Managed via Zustand and `localStorage`
- **Code Persistence**: Per-language code is auto-saved locally

---

## 📦 Deployment

The project is deployed on **Vercel**:  
👉 [https://code-wave.vercel.app](https://code-wave.vercel.app)

To deploy your own version:

1. Push the project to a GitHub repository.
2. Go to [vercel.com/import](https://vercel.com/import) and import your repo.
3. Select **Next.js** as the framework.
4. Click **Deploy** 🚀

---

## 🔮 Future Roadmap

- 🔐 User authentication and cloud-based saved snippets
- 🤝 Real-time collaboration mode
- 🧠 AI-powered code suggestions using OpenAI API
- ❗ Inline syntax error highlighting and diagnostics

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Commit your changes**: `git commit -m "Add new feature"`
4. **Push to the branch**: `git push origin feature/your-feature`
5. **Open a Pull Request`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👩‍💻 Built with ❤️ by Kritika Benjwal & Team
