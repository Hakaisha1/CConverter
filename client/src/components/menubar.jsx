import { useState, useEffect, use } from "react"
import { Euro } from 'lucide-react';


export default function MenuBar() {
    const [activeLink, setActiveLink] = useState("convert");

    const navLinks = [
        { name: "Convert", id: "convert" },
        { name: "History", id: "conversion-history" },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver((entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        }), {
            root: null,
            rootMargin: "0px 0px -80% 0px",
            threshold: 0.3
        });

        const sections = document.querySelectorAll("#convert, #conversion-history");
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <nav className="flex flex-row justify-start p-4 bg-var(--paper) sticky top-0 px-8 space-x-6 border-b border-var(--line) z-10">
            <Euro />
            <span className="ml-auto space-x-10 px-6">
                {navLinks.map((link) => (
                    <a
                    key={link.id} 
                    href={`#${link.id}`}
                    onClick={() => setActiveLink(link.id)}
                    className={`transition-all duration-300 ${activeLink === link.id ? "text-ink font-bold opacity-100" : "text-ink font-normal opacity-40 hover:opacity-60"}`}>{link.name}</a>
                ))}
            </span>
        </nav>
    )
}
