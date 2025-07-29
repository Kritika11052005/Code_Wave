# 🎧 Code_Wave



![hi-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/acad04d8-fecc-42ae-b6f9-affdce33fd61)


# Website Front Page
<img width="1896" height="923" alt="image" src="https://github.com/user-attachments/assets/d384f888-9d13-4202-a0af-6404d149093a" />



**Code_Wave** is a fast, minimal, and powerful in-browser code editor that supports multiple programming languages with real-time execution. Built with performance and simplicity in mind, it provides developers with a playground to write, test, and customize code — right in the browser.

🌐 [Live Demo on Vercel](https://code-wave-lime.vercel.app/)

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

## 🔮 Future Roadmap

- 🔐 User authentication and cloud-based saved snippets
- 🤝 Real-time collaboration mode
- 🧠 AI-powered code suggestions using OpenAI API
- ❗ Inline syntax error highlighting and diagnostics



---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👩‍💻 Built with ❤️ by Kritika Benjwal
